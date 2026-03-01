import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({ email: z.string().email().max(255) });

// ─── Shuttle SVG Background ───
const SVG_BG = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="120" viewBox="0 0 620 120" fill="none"><defs><linearGradient id="g1" x1="0" y1="0" x2="620" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0a0a0a" stop-opacity="0.95"/><stop offset="50%" stop-color="#1a1a2e" stop-opacity="0.9"/><stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.95"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/></pattern></defs><rect width="620" height="120" fill="url(#g1)"/><rect width="620" height="120" fill="url(#grid)"/><circle cx="520" cy="30" r="60" fill="rgba(255,255,255,0.015)"/><circle cx="80" cy="90" r="45" fill="rgba(255,255,255,0.01)"/></svg>`;
const SVG_BG_B64 = btoa(SVG_BG.replace(/\n\s*/g, ''));

const AE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="1" y="1" width="50" height="50" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_B64 = btoa(AE_LOGO_SVG.replace(/\n\s*/g, ''));

const AE_LOGO_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="0.5" y="0.5" width="35" height="35" rx="8" fill="#0a0a0a" stroke="#1a1a1a" stroke-width="0.5"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="-0.5" fill="#ffffff">AE</text></svg>`;
const AE_LOGO_DARK_B64 = btoa(AE_LOGO_DARK_SVG.replace(/\n\s*/g, ''));

const buildEmailHtml = (opts: { emoji: string; headline: string; body: string }) => `
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
    </div>
  </div>

  <div style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 36px;text-align:center;">
    <img src="data:image/svg+xml;base64,${AE_LOGO_DARK_B64}" alt="AE" width="24" height="24" style="display:block;margin:0 auto 10px;border:0;opacity:0.6;" />
    <p style="margin:0 0 4px;font-size:11px;color:#b0b0b0;letter-spacing:0.5px;">© ${new Date().getFullYear()} Dharaneedharan SS · ArtTech Engine</p>
    <p style="margin:0;color:#9ca3af;font-size:11px;">This is an automated security email. Do not share this code.</p>
  </div>

</div>

</body></html>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;

    const userExists = users.users.some((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!userExists) {
      return new Response(JSON.stringify({ error: "No account found with this email" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin.from("otp_codes").select("*", { count: "exact", head: true }).eq("email", email.toLowerCase()).gte("created_at", oneHourAgo);
    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: "Too many OTP requests. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: insertError } = await supabaseAdmin.from("otp_codes").insert({ email: email.toLowerCase(), otp, expires_at: expiresAt });
    if (insertError) throw insertError;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("Email service not configured");

    const otpBody = `
      <p style="color:#1a1a1a;margin:0 0 6px;font-size:18px;font-weight:700;">Reset Your Passkey</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0 0 24px;">
        Use the code below to reset your passkey. This code expires in <strong style="color:#0a0a0a;">5 minutes</strong>.
      </p>
      <div style="background:linear-gradient(135deg,#f8f9fa 0%,#ffffff 50%,#f8f9fa 100%);border:1px solid #e8e8ec;border-radius:14px;padding:28px;text-align:center;margin:0 0 24px;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <span style="font-size:38px;font-weight:800;letter-spacing:12px;color:#0a0a0a;font-family:'Courier New',Courier,monospace;">${otp}</span>
      </div>
      <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
        If you didn't request this, you can safely ignore this email.
      </p>`;

    const emailHtml = buildEmailHtml({ emoji: "🔐", headline: "Passkey Reset Code", body: otpBody });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "ArtTech Engine <onboarding@resend.dev>",
        to: [email],
        subject: "🔐 Your Passkey Reset Code — ArtTech Engine",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.text();
    console.log("Resend response:", emailResponse.status, emailResult);

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "OTP generated. Email delivery may be delayed.", debug: `Resend status: ${emailResponse.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, message: "OTP sent to your email" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("send-otp error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send OTP" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
