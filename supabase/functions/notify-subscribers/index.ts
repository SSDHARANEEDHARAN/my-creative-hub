import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://story-and-more.lovable.app";

const getAllowedOrigin = (req: Request): string => {
  const origin = req.headers.get("origin") || "";
  const allowedPatterns = [
    SITE_URL,
    "https://story-and-more.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ].filter(Boolean);
  if (allowedPatterns.includes(origin) || origin.endsWith(".lovable.app")) return origin;
  return SITE_URL;
};

const getCorsHeaders = (req: Request) => ({
  "Access-Control-Allow-Origin": getAllowedOrigin(req),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Credentials": "true",
});

const NotifySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["post", "project", "update"]),
  slug: z.string().optional(),
  url: z.string().url().optional(),
});

const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, (m) => htmlEscapes[m] || m);
};

// Premium email template
const buildEmailHtml = (opts: {
  emoji: string; headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string; unsubscribeUrl: string;
}) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eaeaea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<div style="max-width:620px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="height:4px;background:linear-gradient(90deg,#111111,#444444,#111111);"></div>
  <div style="padding:36px 32px 28px;text-align:center;border-bottom:1px solid #f0f0f0;">
    <div style="display:inline-block;width:48px;height:48px;background:#111;border-radius:10px;line-height:48px;font-size:20px;color:#fff;font-weight:800;letter-spacing:-1px;margin-bottom:14px;">AE</div>
    <p style="margin:0 0 6px;font-size:11px;color:#999;letter-spacing:3px;text-transform:uppercase;font-weight:600;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:20px;color:#111;font-weight:700;line-height:1.3;">${opts.emoji} ${opts.headline}</h1>
  </div>
  <div style="padding:28px 32px 32px;">
    ${opts.body}
    ${opts.ctaUrl ? `
    <div style="text-align:center;margin:32px 0 12px;">
      <a href="${opts.ctaUrl}" style="display:inline-block;background:#111;color:#fff;padding:13px 36px;text-decoration:none;font-weight:600;font-size:14px;border-radius:8px;letter-spacing:0.5px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${opts.ctaLabel || 'View Now'} →</a>
    </div>` : ''}
  </div>
  <div style="padding:20px 32px;text-align:center;background:#fafafa;border-top:1px solid #f0f0f0;">
    <p style="margin:0 0 4px;font-size:11px;color:#aaa;letter-spacing:1px;">© ${new Date().getFullYear()} DHARANEEDHARAN SS</p>
    <p style="margin:0;"><a href="${opts.unsubscribeUrl}" style="color:#999;text-decoration:underline;font-size:11px;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Verify admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });

  const adminSupabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roleData } = await adminSupabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  if (!roleData) return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });

  try {
    const rawBody = await req.json();
    const parseResult = NotifySchema.safeParse(rawBody);
    if (!parseResult.success) return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });

    const { title, description, type, slug, url } = parseResult.data;
    const safeTitle = escapeHtml(title);
    const safeDesc = description ? escapeHtml(description) : "";

    // Fetch all active subscribers
    const { data: subscribers } = await adminSupabase.from("newsletter_subscribers").select("email, name, unsubscribe_token").eq("is_active", true);
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: "No active subscribers found", count: 0 }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const typeLabel = type === "post" ? "Blog Post" : type === "project" ? "Project" : "Update";
    const emoji = type === "post" ? "📝" : type === "project" ? "🚀" : "🔔";

    // Build content URL
    let contentUrl = url;
    if (!contentUrl && slug) {
      contentUrl = type === "post" ? `${SITE_URL}/blog/${slug}` : `${SITE_URL}/projects`;
    }
    if (!contentUrl) contentUrl = SITE_URL;

    let successCount = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${sub.unsubscribe_token}`;
      const subscriberName = sub.name || "there";

      const body = `
        <h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${escapeHtml(subscriberName)}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
          A new <strong>${typeLabel}</strong> has just been published:
        </p>
        <div style="background:#f8f9fa;border-left:4px solid #0a0a0a;padding:16px 20px;margin:0 0 16px;">
          <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:18px;">${safeTitle}</h3>
          ${safeDesc ? `<p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">${safeDesc}</p>` : ''}
        </div>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
          Thank you for being a subscriber — you're the first to know!
        </p>`;

      const emailHtml = buildEmailHtml({
        emoji, headline: `New ${typeLabel} Published!`,
        body, ctaUrl: contentUrl, ctaLabel: `View ${typeLabel}`,
        unsubscribeUrl,
      });

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "ArtTech Engine <onboarding@resend.dev>",
            to: [sub.email],
            subject: `${emoji} New ${typeLabel}: ${safeTitle}`,
            html: emailHtml,
          }),
        });
        if (response.ok) successCount++;
        else errors.push(`${sub.email}: ${await response.text()}`);
      } catch (err: unknown) {
        errors.push(`${sub.email}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    console.log(`Sent notifications to ${successCount}/${subscribers.length} subscribers`);
    return new Response(
      JSON.stringify({ success: true, sent: successCount, total: subscribers.length, errors: errors.length > 0 ? errors : undefined }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: "Failed to send notifications" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
