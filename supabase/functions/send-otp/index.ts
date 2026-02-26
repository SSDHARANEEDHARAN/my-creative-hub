import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({ email: z.string().email().max(255) });

// SVG AE Logo
const AE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#0a0a0a"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-size="22" font-weight="800" letter-spacing="-1" fill="#ffffff">AE</text></svg>`;

const AE_LOGO_HTML = `
<!--[if !mso]><!-->
<img src="data:image/svg+xml;base64,${btoa(AE_LOGO_SVG)}" alt="ArtTech Engine" width="48" height="48" style="display:block;margin:0 auto 14px;border:0;" />
<!--<![endif]-->`;

const buildEmailHtml = (opts: { emoji: string; headline: string; body: string }) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${opts.headline}</title>
</head>
<body style="margin:0;padding:0;background:#eaeaea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<div style="max-width:620px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="height:4px;background:linear-gradient(90deg,#0a0a0a 0%,#333333 50%,#0a0a0a 100%);"></div>
  <div style="padding:36px 32px 28px;text-align:center;border-bottom:1px solid #f0f0f0;">
    ${AE_LOGO_HTML}
    <p style="margin:0 0 6px;font-size:11px;color:#999;letter-spacing:3px;text-transform:uppercase;font-weight:600;">ArtTech Engine</p>
    <h1 style="margin:0;font-size:20px;color:#0a0a0a;font-weight:700;line-height:1.3;">${opts.emoji} ${opts.headline}</h1>
  </div>
  <div style="padding:28px 32px 32px;">
    ${opts.body}
  </div>
  <div style="padding:20px 32px;text-align:center;background:#fafafa;border-top:1px solid #f0f0f0;">
    <p style="margin:0 0 4px;font-size:11px;color:#aaa;letter-spacing:1px;">© ${new Date().getFullYear()} DHARANEEDHARAN SS · ArtTech Engine</p>
    <p style="margin:0;color:#999;font-size:11px;">This is an automated security email. Do not share this code.</p>
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
      <h2 style="color:#1a1a1a;margin:0 0 12px;font-size:20px;">Reset Your Passkey</h2>
      <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Use the code below to reset your passkey. This code expires in <strong>5 minutes</strong>.
      </p>
      <div style="background:#f8f9fa;padding:24px;text-align:center;border-radius:8px;margin:0 0 20px;border:1px solid #e5e7eb;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#0a0a0a;font-family:monospace;">${otp}</span>
      </div>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">
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
