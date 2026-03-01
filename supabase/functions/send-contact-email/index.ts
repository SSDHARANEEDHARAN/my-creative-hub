import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = "tharaneetharanss@gmail.com";
const SITE_URL = Deno.env.get("SITE_URL") || "https://story-and-more.vercel.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ContactEmailSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(200).trim(),
  message: z.string().min(1).max(5000).trim(),
  serviceType: z.string().optional(),
  serviceCategory: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional(),
  type: z.enum(["contact", "service", "blog_like", "blog_comment", "newsletter", "comment_reply", "guest_welcome", "user_onboarding"]).optional(),
  blogTitle: z.string().optional(),
  blogUrl: z.string().optional(),
  comment: z.string().optional(),
  originalComment: z.string().optional(),
  replyContent: z.string().optional(),
});

type ContactEmailRequest = z.infer<typeof ContactEmailSchema>;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const escapeHtml = (str: string): string => {
  const m: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, (c) => m[c] || c);
};

const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const r = rateLimitStore.get(ip);
  if (!r || now > r.resetTime) { rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS }); return { allowed: true }; }
  if (r.count >= RATE_LIMIT_MAX) return { allowed: false, retryAfter: Math.ceil((r.resetTime - now) / 1000) };
  r.count++;
  return { allowed: true };
};

// ─── Shuttle Glassmorphism SVG Background ───
const SVG_BG = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="120" viewBox="0 0 620 120" fill="none"><defs><linearGradient id="g1" x1="0" y1="0" x2="620" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0a0a0a" stop-opacity="0.95"/><stop offset="50%" stop-color="#1a1a2e" stop-opacity="0.9"/><stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.95"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="620" height="120" fill="url(#g1)"/><rect width="620" height="120" fill="url(#grid)"/><circle cx="520" cy="30" r="60" fill="rgba(255,255,255,0.015)"/><circle cx="80" cy="90" r="45" fill="rgba(255,255,255,0.01)"/></svg>`;
const SVG_BG_B64 = btoa(SVG_BG.replace(/\n\s*/g, ''));

// ─── AE Logo SVG (transparent, clean) ───
const AE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="1" y="1" width="50" height="50" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_B64 = btoa(AE_LOGO_SVG.replace(/\n\s*/g, ''));

// ─── AE Logo for light sections ───
const AE_LOGO_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="0.5" y="0.5" width="35" height="35" rx="8" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="0.5"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_DARK_B64 = btoa(AE_LOGO_DARK_SVG.replace(/\n\s*/g, ''));

// ─── Shuttle Email Template ───
const buildEmail = (opts: {
  emoji: string; headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string;
  footerText?: string; unsubscribeUrl?: string;
}) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.headline}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">

<!-- Outer Container -->
<div style="max-width:620px;margin:32px auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.06);">

  <!-- Header with SVG Background -->
  <div style="background:url('data:image/svg+xml;base64,${SVG_BG_B64}') center/cover no-repeat,#0a0a0a;padding:40px 36px 36px;text-align:center;">
    <!--[if !mso]><!-->
    <img src="data:image/svg+xml;base64,${AE_LOGO_B64}" alt="AE" width="52" height="52" style="display:block;margin:0 auto 16px;border:0;" />
    <!--<![endif]-->
    <p style="margin:0 0 8px;font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:4px;text-transform:uppercase;font-weight:600;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;line-height:1.3;letter-spacing:-0.3px;">${opts.emoji} ${opts.headline}</h1>
  </div>

  <!-- Glassmorphism Card Body -->
  <div style="background:#ffffff;padding:0;">
    <div style="border-top:1px solid rgba(0,0,0,0.04);padding:32px 36px 36px;">
      ${opts.body}
      ${opts.ctaUrl ? `
      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${opts.ctaUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:14px 40px;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 14px rgba(0,0,0,0.18);transition:all 0.2s;">${opts.ctaLabel || 'View Now'} &rarr;</a>
      </div>` : ''}
    </div>
  </div>

  <!-- Frost Footer -->
  <div style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 36px;text-align:center;">
    <img src="data:image/svg+xml;base64,${AE_LOGO_DARK_B64}" alt="AE" width="24" height="24" style="display:block;margin:0 auto 10px;border:0;opacity:0.6;" />
    <p style="margin:0 0 4px;font-size:11px;color:#b0b0b0;letter-spacing:0.5px;">© ${new Date().getFullYear()} Dharaneedharan SS · ArtTech Engine</p>
    ${opts.footerText ? `<p style="margin:0 0 4px;font-size:11px;color:#c0c0c0;">${opts.footerText}</p>` : ''}
    ${opts.unsubscribeUrl ? `<p style="margin:4px 0 0;"><a href="${opts.unsubscribeUrl}" style="color:#999;text-decoration:underline;font-size:11px;letter-spacing:0.3px;">Unsubscribe</a></p>` : ''}
  </div>

</div>

</body></html>`;

const infoRow = (label: string, value: string) =>
  `<tr><td style="padding:10px 12px 10px 0;color:#9ca3af;font-weight:500;width:100px;vertical-align:top;font-size:13px;border-bottom:1px solid #f5f5f5;">${label}</td><td style="padding:10px 0;color:#1a1a1a;font-size:14px;border-bottom:1px solid #f5f5f5;">${value}</td></tr>`;

const glassCard = (content: string) =>
  `<div style="background:linear-gradient(135deg,#f8f9fa 0%,#ffffff 50%,#f8f9fa 100%);border:1px solid #e8e8ec;border-radius:12px;padding:20px 22px;margin:16px 0;box-shadow:0 2px 8px rgba(0,0,0,0.03);">${content}</div>`;

const quoteBlock = (content: string, label?: string) =>
  `<div style="background:linear-gradient(135deg,rgba(10,10,10,0.02) 0%,rgba(10,10,10,0.04) 100%);border-left:3px solid #0a0a0a;padding:16px 20px;margin:16px 0;border-radius:0 10px 10px 0;">
    ${label ? `<p style="margin:0 0 6px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${label}</p>` : ''}
    <p style="margin:0;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;font-size:14px;">${content}</p>
  </div>`;

const sendEmail = async (to: string, subject: string, html: string, replyTo?: string) => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: "ArtTech Engine <onboarding@resend.dev>", to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) console.warn("Email send warning:", await res.text());
    else console.log("Email sent to:", to);
    return res.ok;
  } catch (e) { console.warn("Email failed:", e); return false; }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) return new Response(JSON.stringify({ error: "Too many requests." }), { status: 429, headers: { ...corsHeaders, "Retry-After": String(rl.retryAfter) } });

  try {
    const rawBody = await req.json();
    const parseResult = ContactEmailSchema.safeParse(rawBody);
    if (!parseResult.success) return new Response(JSON.stringify({ error: `Validation: ${parseResult.error.errors.map(e => e.message).join(", ")}` }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });

    const d: ContactEmailRequest = parseResult.data;
    const sN = escapeHtml(d.name), sE = escapeHtml(d.email), sS = escapeHtml(d.subject), sM = escapeHtml(d.message);
    const type = d.type || "contact";

    // ─── Newsletter ───
    if (type === "newsletter") {
      await sendEmail(OWNER_EMAIL, `📰 New Subscriber: ${sN}`, buildEmail({
        emoji: "📰", headline: "New Newsletter Subscriber",
        body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
        footerText: "Subscriber signed up through your portfolio.",
      }), d.email);

      let unsub = "";
      try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const r = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(d.email)}&select=unsubscribe_token`, { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } });
        const data = await r.json();
        if (data?.[0]) unsub = data[0].unsubscribe_token;
      } catch (e) { console.error("Token fetch error:", e); }

      await sendEmail(d.email, "🎉 Welcome to ArtTech Engine", buildEmail({
        emoji: "🎉", headline: "Welcome Aboard!",
        body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 20px;">You're now part of the ArtTech Engine community. Here's what you'll get:</p>
        ${glassCard(`
          <div style="display:flex;flex-direction:column;gap:12px;">
            <p style="margin:0;color:#1a1a1a;font-size:14px;">🚀 &nbsp; New projects &amp; case studies</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">📝 &nbsp; Latest blog posts &amp; insights</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">💡 &nbsp; Industry trends &amp; analysis</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">🎯 &nbsp; Exclusive subscriber content</p>
          </div>
        `)}`,
        ctaUrl: SITE_URL, ctaLabel: "Explore Portfolio",
        unsubscribeUrl: `${SITE_URL}/unsubscribe?token=${unsub}`,
      }));

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Blog Like ───
    if (type === "blog_like") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      await sendEmail(OWNER_EMAIL, `❤️ New Like: ${sT}`, buildEmail({
        emoji: "❤️", headline: "Someone Liked Your Post",
        body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Article", sT)}</table>`)}`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Blog Comment ───
    if (type === "blog_comment") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      const sC = d.comment ? escapeHtml(d.comment) : "";
      await sendEmail(OWNER_EMAIL, `💬 New Comment: ${sT}`, buildEmail({
        emoji: "💬", headline: "New Comment on Your Blog",
        body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Article", sT)}</table>`)}
        ${quoteBlock(sC, "Comment")}`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      await sendEmail(d.email, `💬 Thanks for commenting on: ${sT}`, buildEmail({
        emoji: "💬", headline: "Thanks for Your Comment",
        body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 16px;">Your comment on <strong style="color:#0a0a0a;">${sT}</strong> has been received and is now visible.</p>
        ${quoteBlock(sC, "Your Comment")}`,
        ctaUrl: d.blogUrl, ctaLabel: "View Blog",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Comment Reply ───
    if (type === "comment_reply") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      const sOC = d.originalComment ? escapeHtml(d.originalComment) : "";
      const sRC = d.replyContent ? escapeHtml(d.replyContent) : "";
      await sendEmail(d.email, `💬 Reply to your comment on: ${sT}`, buildEmail({
        emoji: "💬", headline: "You Got a Reply!",
        body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 16px;">Dharaneedharan SS replied to your comment on <strong style="color:#0a0a0a;">${sT}</strong>.</p>
        ${quoteBlock(sOC, "Your Comment")}
        <div style="background:linear-gradient(135deg,rgba(10,10,10,0.04) 0%,rgba(10,10,10,0.07) 100%);border-left:3px solid #0a0a0a;padding:16px 20px;margin:16px 0;border-radius:0 10px 10px 0;">
          <p style="margin:0 0 6px;color:#0a0a0a;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Admin Reply</p>
          <p style="margin:0;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;font-size:14px;">${sRC}</p>
        </div>`,
        ctaUrl: `${SITE_URL}/blog`, ctaLabel: "View Blog",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Guest Welcome ───
    if (type === "guest_welcome") {
      await sendEmail(OWNER_EMAIL, `👤 New Guest: ${sN}`, buildEmail({
        emoji: "👤", headline: "New Guest Visitor",
        body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
      }), d.email);
      await sendEmail(d.email, "👋 Welcome to ArtTech Engine", buildEmail({
        emoji: "👋", headline: "Welcome!",
        body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 20px;">Thanks for visiting! As a guest you can explore:</p>
        ${glassCard(`
          <div style="display:flex;flex-direction:column;gap:12px;">
            <p style="margin:0;color:#1a1a1a;font-size:14px;">📖 &nbsp; Blog posts &amp; articles</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">💼 &nbsp; Projects &amp; case studies</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">🎨 &nbsp; Gallery &amp; certificates</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">📧 &nbsp; Contact &amp; services</p>
          </div>
        `)}`,
        ctaUrl: SITE_URL, ctaLabel: "Explore Now",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── User Onboarding ───
    if (type === "user_onboarding") {
      await sendEmail(OWNER_EMAIL, `🆕 New User: ${sN}`, buildEmail({
        emoji: "🆕", headline: "New User Login",
        body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
      }), d.email);
      await sendEmail(d.email, "🎉 Welcome to ArtTech Engine", buildEmail({
        emoji: "🎉", headline: "Welcome!",
        body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 20px;">Thanks for signing up! Here's what awaits you:</p>
        ${glassCard(`
          <div style="display:flex;flex-direction:column;gap:12px;">
            <p style="margin:0;color:#1a1a1a;font-size:14px;">🚀 &nbsp; Projects &amp; portfolio</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">📝 &nbsp; Blog &amp; insights</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">💼 &nbsp; Services &amp; consulting</p>
            <p style="margin:0;color:#1a1a1a;font-size:14px;">🎨 &nbsp; Gallery &amp; certificates</p>
          </div>
        `)}`,
        ctaUrl: SITE_URL, ctaLabel: "Get Started",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Contact / Service ───
    const isService = d.serviceType && d.serviceCategory;
    const svcType = d.serviceType ? escapeHtml(d.serviceType) : "";
    const svcCat = d.serviceCategory ? escapeHtml(d.serviceCategory) : "";
    const sBudget = d.budget ? escapeHtml(d.budget) : "";
    const sTimeline = d.timeline ? escapeHtml(d.timeline) : "";
    const sReqs = d.requirements ? escapeHtml(d.requirements) : "";

    let bodyRows = `${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${sE}</a>`)}`;
    if (isService) {
      bodyRows += `${infoRow("Category", svcCat)}${infoRow("Service", svcType)}`;
      if (sBudget) bodyRows += infoRow("Budget", sBudget);
      if (sTimeline) bodyRows += infoRow("Timeline", sTimeline);
    } else {
      bodyRows += infoRow("Subject", sS);
    }

    await sendEmail(OWNER_EMAIL, isService ? `🚀 Service Request: ${svcType}` : `📬 Contact: ${sS}`, buildEmail({
      emoji: isService ? "🚀" : "📬", headline: isService ? "New Service Request" : "New Contact Message",
      body: `${glassCard(`<table style="width:100%;border-collapse:collapse;">${bodyRows}</table>`)}
      ${quoteBlock(isService && sReqs ? sReqs : sM, isService ? "Requirements" : "Message")}`,
      footerText: `Reply directly to respond to ${sN}.`,
    }), d.email);

    await sendEmail(d.email, "✅ Message Received — ArtTech Engine", buildEmail({
      emoji: "✅", headline: "Thank You for Reaching Out",
      body: `<p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Hi ${sN} 👋</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 20px;">I've received your message and will respond within <strong style="color:#0a0a0a;">24 hours</strong>.</p>
      ${glassCard(`
        <p style="margin:0 0 12px;color:#0a0a0a;font-size:14px;font-weight:700;">What's Next?</p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <p style="margin:0;color:#374151;font-size:14px;">✓ &nbsp; I'll review your message carefully</p>
          <p style="margin:0;color:#374151;font-size:14px;">✓ &nbsp; Personalized response within 24h</p>
          <p style="margin:0;color:#374151;font-size:14px;">✓ &nbsp; We can schedule a call if needed</p>
        </div>
      `)}
      ${quoteBlock(sM.substring(0, 200) + (sM.length > 200 ? '...' : ''), "Your Message")}`,
      ctaUrl: SITE_URL, ctaLabel: "Visit Portfolio",
    }));

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("Contact email error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
