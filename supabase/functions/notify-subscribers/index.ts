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

// ─── Shuttle SVG Background ───
const SVG_BG = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="120" viewBox="0 0 620 120" fill="none"><defs><linearGradient id="g1" x1="0" y1="0" x2="620" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0a0a0a" stop-opacity="0.95"/><stop offset="50%" stop-color="#1a1a2e" stop-opacity="0.9"/><stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.95"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="620" height="120" fill="url(#g1)"/><rect width="620" height="120" fill="url(#grid)"/><circle cx="520" cy="30" r="60" fill="rgba(255,255,255,0.015)"/><circle cx="80" cy="90" r="45" fill="rgba(255,255,255,0.01)"/></svg>`;
const SVG_BG_B64 = btoa(SVG_BG.replace(/\n\s*/g, ''));

const AE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="1" y="1" width="50" height="50" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_B64 = btoa(AE_LOGO_SVG.replace(/\n\s*/g, ''));

const AE_LOGO_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="0.5" y="0.5" width="35" height="35" rx="8" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="0.5"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_DARK_B64 = btoa(AE_LOGO_DARK_SVG.replace(/\n\s*/g, ''));

const buildEmailHtml = (opts: {
  emoji: string; headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string; unsubscribeUrl: string;
}) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.headline}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="max-width:620px;margin:32px auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.06);">

  <div style="background:url('data:image/svg+xml;base64,${SVG_BG_B64}') center/cover no-repeat,#0a0a0a;padding:40px 36px 36px;text-align:center;">
    <img src="data:image/svg+xml;base64,${AE_LOGO_B64}" alt="AE" width="52" height="52" style="display:block;margin:0 auto 16px;border:0;" />
    <p style="margin:0 0 8px;font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;font-weight:600;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;line-height:1.3;letter-spacing:-0.3px;">${opts.emoji} ${opts.headline}</h1>
  </div>

  <div style="background:#ffffff;padding:0;">
    <div style="border-top:1px solid rgba(0,0,0,0.04);padding:32px 36px 36px;">
      ${opts.body}
      ${opts.ctaUrl ? `
      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${opts.ctaUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:14px 40px;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(0,0,0,0.18);">${opts.ctaLabel || 'View Now'} &rarr;</a>
      </div>` : ''}
    </div>
  </div>

  <div style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 36px;text-align:center;">
    <img src="data:image/svg+xml;base64,${AE_LOGO_DARK_B64}" alt="AE" width="24" height="24" style="display:block;margin:0 auto 10px;border:0;opacity:0.6;" />
    <p style="margin:0 0 4px;font-size:11px;color:#b0b0b0;letter-spacing:0.5px;">© ${new Date().getFullYear()} Dharaneedharan SS · ArtTech Engine</p>
    <p style="margin:4px 0 0;"><a href="${opts.unsubscribeUrl}" style="color:#999;text-decoration:underline;font-size:11px;letter-spacing:0.3px;">Unsubscribe</a></p>
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
    const emoji = type === "post" ? "📝" : type === "project" ? "🚀" : "🔔";

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
        <p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${escapeHtml(subscriberName)} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 20px;">
          A new <strong style="color:#0a0a0a;">${typeLabel}</strong> has just been published:
        </p>
        <div style="background:linear-gradient(135deg,#f8f9fa 0%,#ffffff 50%,#f8f9fa 100%);border:1px solid #e8e8ec;border-radius:12px;padding:20px 22px;margin:0 0 16px;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <h3 style="margin:0 0 8px;color:#0a0a0a;font-size:17px;font-weight:700;">${safeTitle}</h3>
          ${safeDesc ? `<p style="margin:0;color:#6b7280;font-size:14px;line-height:1.7;">${safeDesc}</p>` : ''}
        </div>
        <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
          Thank you for being a subscriber — you're the first to know!
        </p>`;

      const emailHtml = buildEmailHtml({
        emoji, headline: `New ${typeLabel} Published`,
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
