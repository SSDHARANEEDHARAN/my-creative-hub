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

// Unified email template builder
const buildEmailHtml = (opts: {
  emoji: string; headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string; unsubscribeUrl: string;
}) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:32px 24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#a1a1aa;letter-spacing:2px;text-transform:uppercase;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">${opts.emoji} ${opts.headline}</h1>
  </div>
  <!-- Body -->
  <div style="padding:32px 24px;background:#ffffff;">
    ${opts.body}
    ${opts.ctaUrl ? `
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${opts.ctaUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:600;font-size:15px;border-radius:6px;">${opts.ctaLabel || 'View Now'}</a>
    </div>` : ''}
  </div>
  <!-- Footer -->
  <div style="padding:20px 24px;text-align:center;background:#1a1a2e;color:#71717a;font-size:12px;">
    <p style="margin:0 0 6px;">© ${new Date().getFullYear()} Dharaneedharan SS — ArtTech Engine</p>
    <p style="margin:0;"><a href="${opts.unsubscribeUrl}" style="color:#71717a;text-decoration:underline;">Unsubscribe</a></p>
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
