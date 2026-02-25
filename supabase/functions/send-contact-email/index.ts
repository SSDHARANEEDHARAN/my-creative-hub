import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = "tharaneetharanss@gmail.com";
const SITE_URL = Deno.env.get("SITE_URL") || "https://story-and-more.lovable.app";

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

// ─── Unified Email Template ───
const buildEmail = (opts: {
  emoji: string; headline: string; body: string;
  ctaUrl?: string; ctaLabel?: string;
  footerText?: string; unsubscribeUrl?: string;
}) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:32px 24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:14px;color:#a1a1aa;letter-spacing:2px;text-transform:uppercase;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">${opts.emoji} ${opts.headline}</h1>
  </div>
  <div style="padding:32px 24px;background:#ffffff;">
    ${opts.body}
    ${opts.ctaUrl ? `<div style="text-align:center;margin:28px 0 8px;"><a href="${opts.ctaUrl}" style="display:inline-block;background:#0a0a0a;color:#ffffff;padding:14px 32px;text-decoration:none;font-weight:600;font-size:15px;border-radius:6px;">${opts.ctaLabel || 'View Now'}</a></div>` : ''}
  </div>
  <div style="padding:20px 24px;text-align:center;background:#1a1a2e;color:#71717a;font-size:12px;">
    <p style="margin:0 0 6px;">© ${new Date().getFullYear()} Dharaneedharan SS — ArtTech Engine</p>
    ${opts.footerText ? `<p style="margin:0 0 6px;">${opts.footerText}</p>` : ''}
    ${opts.unsubscribeUrl ? `<p style="margin:0;"><a href="${opts.unsubscribeUrl}" style="color:#71717a;text-decoration:underline;">Unsubscribe</a></p>` : ''}
  </div>
</div>
</body></html>`;

const infoRow = (label: string, value: string) =>
  `<tr><td style="padding:8px 0;color:#6b7280;font-weight:600;width:110px;vertical-align:top;">${label}:</td><td style="padding:8px 0;color:#1a1a1a;">${value}</td></tr>`;

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
      // Notify admin
      await sendEmail(OWNER_EMAIL, `📰 New Subscriber: ${sN}`, buildEmail({
        emoji: "📰", headline: "New Newsletter Subscriber!",
        body: `<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`,
        footerText: "Subscriber signed up through your portfolio.",
      }), d.email);

      // Get unsubscribe token
      let unsub = "";
      try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const r = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(d.email)}&select=unsubscribe_token`, { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } });
        const data = await r.json();
        if (data?.[0]) unsub = data[0].unsubscribe_token;
      } catch (e) { console.error("Token fetch error:", e); }

      // Welcome email to subscriber
      await sendEmail(d.email, "🎉 Welcome to ArtTech Engine Newsletter!", buildEmail({
        emoji: "🎉", headline: "Welcome to the Newsletter!",
        body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;">Thank you for subscribing! You'll receive updates about:</p>
        <ul style="color:#374151;line-height:2;font-size:15px;">
          <li>🚀 New projects and case studies</li><li>📝 Latest blog posts</li><li>💡 Industry insights</li><li>🎯 Exclusive content</li>
        </ul>`,
        ctaUrl: SITE_URL, ctaLabel: "Visit Portfolio",
        unsubscribeUrl: `${SITE_URL}/unsubscribe?token=${unsub}`,
      }));

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Blog Like ───
    if (type === "blog_like") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      await sendEmail(OWNER_EMAIL, `❤️ New Like: ${sT}`, buildEmail({
        emoji: "❤️", headline: "Someone Liked Your Post!",
        body: `<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}${infoRow("Article", sT)}</table>`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Blog Comment ───
    if (type === "blog_comment") {
      const sT = d.blogTitle ? escapeHtml(d.blogTitle) : "";
      const sC = d.comment ? escapeHtml(d.comment) : "";
      // Admin notification
      await sendEmail(OWNER_EMAIL, `💬 New Comment: ${sT}`, buildEmail({
        emoji: "💬", headline: "New Comment on Your Blog!",
        body: `<table style="width:100%;border-collapse:collapse;">${infoRow("From", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}${infoRow("Article", sT)}</table>
        <div style="background:#f8f9fa;border-left:4px solid #2563eb;padding:16px;margin:16px 0;"><p style="margin:0;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${sC}</p></div>`,
        ctaUrl: d.blogUrl, ctaLabel: "View Article",
      }), d.email);
      // Commenter confirmation
      await sendEmail(d.email, `💬 Thanks for commenting on: ${sT}`, buildEmail({
        emoji: "💬", headline: "Thanks for Your Comment!",
        body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;">Your comment on <strong>${sT}</strong> has been received and is now visible.</p>
        <div style="background:#f8f9fa;border-left:4px solid #2563eb;padding:16px;margin:16px 0;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Your comment:</p>
          <p style="margin:0;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${sC}</p>
        </div>`,
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
        body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;">Dharaneedharan SS replied to your comment on <strong>${sT}</strong>.</p>
        <div style="background:#f8f9fa;border-left:4px solid #d1d5db;padding:16px;margin:16px 0;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Your comment:</p>
          <p style="margin:0;color:#374151;line-height:1.6;white-space:pre-wrap;">${sOC}</p>
        </div>
        <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;margin:16px 0;">
          <p style="margin:0 0 4px;color:#059669;font-size:12px;font-weight:600;">Reply from Dharaneedharan SS:</p>
          <p style="margin:0;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${sRC}</p>
        </div>`,
        ctaUrl: `${SITE_URL}/blog`, ctaLabel: "View Blog",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── Guest Welcome ───
    if (type === "guest_welcome") {
      await sendEmail(OWNER_EMAIL, `👤 New Guest: ${sN}`, buildEmail({
        emoji: "👤", headline: "New Guest Visitor!",
        body: `<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`,
      }), d.email);
      await sendEmail(d.email, "👋 Welcome to My Portfolio!", buildEmail({
        emoji: "👋", headline: "Welcome!",
        body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;">Thank you for visiting! As a guest you can explore:</p>
        <ul style="color:#374151;line-height:2;font-size:15px;"><li>📖 Blog posts</li><li>💼 Projects</li><li>🎨 Gallery</li><li>📧 Contact</li></ul>`,
        ctaUrl: SITE_URL, ctaLabel: "Visit Portfolio",
      }));
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // ─── User Onboarding ───
    if (type === "user_onboarding") {
      await sendEmail(OWNER_EMAIL, `🆕 New User: ${sN}`, buildEmail({
        emoji: "🆕", headline: "New User Login",
        body: `<table style="width:100%;border-collapse:collapse;">${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}${infoRow("Time", new Date().toLocaleString())}</table>`,
      }), d.email);
      await sendEmail(d.email, "🎉 Welcome!", buildEmail({
        emoji: "🎉", headline: "Welcome!",
        body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
        <p style="color:#374151;font-size:16px;line-height:1.7;">Thanks for signing up! Explore:</p>
        <ul style="color:#374151;line-height:2;font-size:15px;"><li>🚀 Projects</li><li>📝 Blog</li><li>💼 Services</li><li>🎨 Gallery</li></ul>`,
        ctaUrl: SITE_URL, ctaLabel: "Visit Portfolio",
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

    let bodyRows = `${infoRow("Name", sN)}${infoRow("Email", `<a href="mailto:${sE}" style="color:#2563eb;">${sE}</a>`)}`;
    if (isService) {
      bodyRows += `${infoRow("Category", svcCat)}${infoRow("Service", svcType)}`;
      if (sBudget) bodyRows += infoRow("Budget", sBudget);
      if (sTimeline) bodyRows += infoRow("Timeline", sTimeline);
    } else {
      bodyRows += infoRow("Subject", sS);
    }

    const messageBlock = `<div style="background:#f8f9fa;border-left:4px solid #0a0a0a;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${isService && sReqs ? sReqs : sM}</p></div>`;

    // Admin notification
    await sendEmail(OWNER_EMAIL, isService ? `🚀 Service Request: ${svcType}` : `📬 Contact: ${sS}`, buildEmail({
      emoji: isService ? "🚀" : "📬", headline: isService ? "New Service Request" : "New Contact Message",
      body: `<table style="width:100%;border-collapse:collapse;">${bodyRows}</table>${messageBlock}`,
      footerText: `Reply directly to respond to ${sN}.`,
    }), d.email);

    // User confirmation
    await sendEmail(d.email, "✅ Message Received — ArtTech Engine", buildEmail({
      emoji: "✅", headline: "Thank You for Reaching Out!",
      body: `<h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Hi ${sN}! 👋</h2>
      <p style="color:#374151;font-size:16px;line-height:1.7;">I've received your message and will respond within <strong>24 hours</strong>.</p>
      <div style="background:#ecfdf5;padding:20px;border-radius:8px;margin:16px 0;">
        <h3 style="color:#059669;margin:0 0 8px;">What's Next?</h3>
        <ul style="color:#374151;line-height:1.8;margin:0;"><li>I'll review your message</li><li>Personalized response within 24h</li><li>We can schedule a call if needed</li></ul>
      </div>
      <div style="background:#f8f9fa;border-left:4px solid #10b981;padding:16px;margin:16px 0;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:12px;">Your message:</p>
        <p style="margin:0;color:#374151;font-size:14px;">${sM.substring(0, 200)}${sM.length > 200 ? '...' : ''}</p>
      </div>`,
      ctaUrl: SITE_URL, ctaLabel: "Visit Portfolio",
      footerText: "📧 tharaneetharanss@gmail.com | 📱 +91 8870086023",
    }));

    return new Response(JSON.stringify({ success: true, emailSent: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("send-contact-email error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
