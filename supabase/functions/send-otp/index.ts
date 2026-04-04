import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({ email: z.string().email().max(255) });

const buildEmailHtml = (opts: { headline: string; preheader?: string; body: string }) => `
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
  </div>

  <!-- Footer -->
  <div style="background:#f8f9fa;border-top:1px solid #eee;padding:20px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;color:#999;letter-spacing:0.3px;">&copy; ${new Date().getFullYear()} Dharaneedharan SS &middot; ArtTech Engine</p>
    <p style="margin:0;font-size:11px;color:#bbb;">This is an automated security email. Do not share this code.</p>
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
      <p style="color:#111;margin:0 0 8px;font-size:16px;font-weight:600;">Passkey Reset</p>
      <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Use the verification code below to reset your passkey. This code expires in <strong style="color:#111;">5 minutes</strong>.
      </p>
      <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px;">
        <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#111;font-family:'SF Mono','Fira Code','Courier New',monospace;">${otp}</span>
      </div>
      <p style="color:#999;font-size:13px;line-height:1.6;margin:0;">
        If you didn't request this code, you can safely ignore this email. Your account remains secure.
      </p>`;

    const emailHtml = buildEmailHtml({ headline: "Passkey Reset Verification", preheader: `Your verification code is ${otp}`, body: otpBody });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "ArtTech Engine <onboarding@resend.dev>",
        to: [email],
        subject: "Passkey Reset Verification — ArtTech Engine",
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
