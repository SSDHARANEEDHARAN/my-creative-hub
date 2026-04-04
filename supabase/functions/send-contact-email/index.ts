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

// ─── Professional Email Template ───
const buildEmail = (opts: {
  headline: string; body: string; preheader?: string;
  ctaUrl?: string; ctaLabel?: string;
  footerText?: string; unsubscribeUrl?: string;
}) => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.headline}</title>
${opts.preheader ? `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${opts.preheader}</span>` : ''}
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
    ${opts.footerText ? `<p style="margin:0 0 4px;font-size:11px;color:#bbb;">${opts.footerText}</p>` : ''}
    ${opts.unsubscribeUrl ? `<p style="margin:4px 0 0;"><a href="${opts.unsubscribeUrl}" style="color:#999;text-decoration:underline;font-size:11px;">Unsubscribe</a></p>` : ''}
  </div>

</div>

</body></html>`;

const infoRow = (label: string, value: string) =>
  `<tr><td style="padding:8px 12px 8px 0;color:#888;font-weight:500;width:90px;vertical-align:top;font-size:13px;border-bottom:1px solid #f3f4f6;">${label}</td><td style="padding:8px 0;color:#111;font-size:14px;border-bottom:1px solid #f3f4f6;">${value}</td></tr>`;

const card = (content: string) =>
  `<div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;margin:16px 0;">${content}</div>`;

const quoteBlock = (content: string, label?: string) =>
  `<div style="border-left:3px solid #111;padding:14px 18px;margin:16px 0;background:#fafafa;border-radius:0 6px 6px 0;">
    ${label ? `<p style="margin:0 0 6px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;">${label}</p>` : ''}
    <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap;font-size:14px;">${content}</p>
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
      await sendEmail(OWNER_EMAIL, `New Subscriber: ${sN}`, buildEmail({
        headline: "New Newsletter Subscriber",
        body: `${card(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
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

      await sendEmail(d.email, "Welcome to ArtTech Engine", buildEmail({
        headline: "Welcome Aboard",
        body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 20px;">You're now part of the ArtTech Engine community. Here's what you'll receive:</p>
        ${card(`
          <div style="display:flex;flex-direction:column;gap:10px;">
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Projects</span> — New case studies &amp; portfolio updates</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Insights</span> — Latest blog posts &amp; technical articles</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Trends</span> — Industry analysis &amp; engineering updates</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Exclusive</span> — Subscriber-only content</p>
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
      await sendEmail(OWNER_EMAIL, `New Like: ${sT}`, buildEmail({
        headline: "New Post Engagement",
        body: `${card(`<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Article", sT)}</table>`)}`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Blog Comment ───
    if (type === "blog_comment") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      const sC = d.comment ? escapeHtml(d.comment) : "";
      await sendEmail(OWNER_EMAIL, `New Comment: ${sT}`, buildEmail({
        headline: "New Blog Comment",
        body: `${card(`<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Article", sT)}</table>`)}
        ${quoteBlock(sC, "Comment")}`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      await sendEmail(d.email, `Comment Received: ${sT}`, buildEmail({
        headline: "Thanks for Your Comment",
        body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">Your comment on <strong style="color:#111;">${sT}</strong> has been received and is now visible.</p>
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
      await sendEmail(d.email, `Reply to Your Comment: ${sT}`, buildEmail({
        headline: "You Received a Reply",
        body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">Dharaneedharan SS replied to your comment on <strong style="color:#111;">${sT}</strong>.</p>
        ${quoteBlock(sOC, "Your Comment")}
        <div style="border-left:3px solid #1a1a2e;padding:14px 18px;margin:16px 0;background:#f0f0ff;border-radius:0 6px 6px 0;">
          <p style="margin:0 0 6px;color:#1a1a2e;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;">Admin Reply</p>
          <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap;font-size:14px;">${sRC}</p>
        </div>`,
        ctaUrl: `${SITE_URL}/blog`, ctaLabel: "View Blog",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Guest Welcome ───
    if (type === "guest_welcome") {
      await sendEmail(OWNER_EMAIL, `New Guest: ${sN}`, buildEmail({
        headline: "New Guest Visitor",
        body: `${card(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
      }), d.email);
      await sendEmail(d.email, "Welcome to ArtTech Engine", buildEmail({
        headline: "Welcome",
        body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 20px;">Thanks for visiting. As a guest you can explore:</p>
        ${card(`
          <div style="display:flex;flex-direction:column;gap:10px;">
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Blog</span> — Articles &amp; technical insights</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Projects</span> — Case studies &amp; portfolio</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Gallery</span> — Certificates &amp; achievements</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Services</span> — Consulting &amp; development</p>
          </div>
        `)}`,
        ctaUrl: SITE_URL, ctaLabel: "Explore Now",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── User Onboarding ───
    if (type === "user_onboarding") {
      await sendEmail(OWNER_EMAIL, `New User: ${sN}`, buildEmail({
        headline: "New User Registration",
        body: `${card(`<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`)}`,
      }), d.email);
      await sendEmail(d.email, "Welcome to ArtTech Engine", buildEmail({
        headline: "Welcome",
        body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 20px;">Thanks for signing up. Here's what awaits you:</p>
        ${card(`
          <div style="display:flex;flex-direction:column;gap:10px;">
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Projects</span> — Portfolio &amp; case studies</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Blog</span> — Technical insights &amp; articles</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Services</span> — Consulting &amp; development</p>
            <p style="margin:0;color:#333;font-size:14px;"><span style="color:#111;font-weight:600;">Gallery</span> — Certificates &amp; achievements</p>
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

    let bodyRows = `${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#111;font-weight:600;text-decoration:none;">${sE}</a>`)}`;
    if (isService) {
      bodyRows += `${infoRow("Category", svcCat)}${infoRow("Service", svcType)}`;
      if (sBudget) bodyRows += infoRow("Budget", sBudget);
      if (sTimeline) bodyRows += infoRow("Timeline", sTimeline);
    } else {
      bodyRows += infoRow("Subject", sS);
    }

    await sendEmail(OWNER_EMAIL, isService ? `Service Request: ${svcType}` : `Contact: ${sS}`, buildEmail({
      headline: isService ? "New Service Request" : "New Contact Message",
      body: `${card(`<table style="width:100%;border-collapse:collapse;">${bodyRows}</table>`)}
      ${quoteBlock(isService && sReqs ? sReqs : sM, isService ? "Requirements" : "Message")}`,
      footerText: `Reply directly to respond to ${sN}.`,
    }), d.email);

    await sendEmail(d.email, "Message Received — ArtTech Engine", buildEmail({
      headline: "Thank You for Reaching Out",
      body: `<p style="color:#111;margin:0 0 6px;font-size:16px;font-weight:600;">Hi ${sN},</p>
      <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 20px;">I've received your message and will respond within <strong style="color:#111;">24 hours</strong>.</p>
      ${card(`
        <p style="margin:0 0 12px;color:#111;font-size:14px;font-weight:600;">What's Next</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <p style="margin:0;color:#555;font-size:14px;">1. I'll review your message carefully</p>
          <p style="margin:0;color:#555;font-size:14px;">2. Personalized response within 24 hours</p>
          <p style="margin:0;color:#555;font-size:14px;">3. We can schedule a call if needed</p>
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
