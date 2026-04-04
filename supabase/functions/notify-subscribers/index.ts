import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://story-and-more.vercel.app";

const getAllowedOrigin = (req: Request): string => {
  const origin = req.headers.get("origin") || "";
  const allowedPatterns = [
    SITE_URL,
    "https://story-and-more.vercel.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ].filter(Boolean);
  if (allowedPatterns.includes(origin)) return origin;
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

const buildEmailHtml = (opts: {
  headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string; unsubscribeUrl: string;
}) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.headline}</title>
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08),0 8px 30px rgba(0,0,0,0.05);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%);padding:36px 40px 32px;text-align:center;">
    <div style="display:inline-block;width:44px;height:44px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:10px;line-height:44px;margin:0 auto 14px;">
      <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AE</span>
    </div>
    <h1 style="margin:0;font-size:20px;color:#ffffff;font-weight:600;line-height:1.4;letter-spacing:-0.2px;">${opts.headline}</h1>
  </div>

  <!-- Body -->
  <div style="padding:36px 40px 40px;">
    ${opts.body}
    ${opts.ctaUrl ? `
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${opts.ctaUrl}" style="display:inline-block;background:#111;color:#ffffff;padding:12px 32px;text-decoration:none;font-weight:600;font-size:13px;border-radius:6px;letter-spacing:0.2px;">${opts.ctaLabel || 'View Now'} &rarr;</a>
    </div>` : ''}
  </div>

  <!-- Footer -->
  <div style="background:#f8f9fa;border-top:1px solid #eee;padding:20px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#999;letter-spacing:0.3px;">&copy; ${new Date().getFullYear()} Dharaneedharan SS &middot; ArtTech Engine</p>
    <p style="margin:4px 0 0;"><a href="${opts.unsubscribeUrl}" style="color:#999;text-decoration:underline;font-size:11px;">Unsubscribe</a></p>
  </div>

</div>

</body></html>`;

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    const { data: subscribers } = await adminSupabase.from("newsletter_subscribers").select("email, name, unsubscribe_token").eq("is_active", true);
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: "No active subscribers found", count: 0 }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const typeLabel = type === "post" ? "Blog Post" : type === "project" ? "Project" : "Update";

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
        <p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${escapeHtml(subscriberName)},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 20px;">
          A new <strong style="color:#111;">${typeLabel}</strong> has just been published:
        </p>
        <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin:0 0 16px;">
          <h3 style="margin:0 0 8px;color:#111;font-size:16px;font-weight:600;">${safeTitle}</h3>
          ${safeDesc ? `<p style="margin:0;color:#555;font-size:14px;line-height:1.7;">${safeDesc}</p>` : ''}
        </div>
        <p style="color:#999;font-size:13px;line-height:1.6;margin:0;">
          Thank you for being a subscriber — you're the first to know.
        </p>`;

      const emailHtml = buildEmailHtml({
        headline: `New ${typeLabel} Published`,
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
            subject: `New ${typeLabel}: ${safeTitle}`,
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
