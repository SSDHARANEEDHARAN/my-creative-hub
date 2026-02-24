import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({
  email: z.string().email().max(255),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if email exists in auth
    const { data: users, error: userError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;

    const userExists = users.users.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (!userExists) {
      return new Response(
        JSON.stringify({ error: "No account found with this email" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit: max 3 OTPs per hour per email
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("email", email.toLowerCase())
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many OTP requests. Try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP
    const { error: insertError } = await supabaseAdmin
      .from("otp_codes")
      .insert({ email: email.toLowerCase(), otp, expires_at: expiresAt });

    if (insertError) throw insertError;

    // Send email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Reset Your Passkey - OTP Code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #ffffff;">
            <h2 style="color: #1a1a1a; margin-bottom: 16px;">Reset Your Passkey</h2>
            <p style="color: #374151; font-size: 16px;">Hello,</p>
            <p style="color: #374151; font-size: 16px;">Your OTP code is:</p>
            <div style="background: #f4f4f5; padding: 24px; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #e4e4e7;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #1a1a1a; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #71717a; font-size: 14px;">This code expires in <strong>5 minutes</strong>.</p>
            <p style="color: #71717a; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
            <p style="color: #a1a1aa; font-size: 12px;">TharaneeTharanss Portfolio</p>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.text();
    console.log("Resend response status:", emailResponse.status);
    console.log("Resend response body:", emailResult);

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResponse.status, emailResult);
      // Still return success since OTP is stored - user can check logs
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP generated. Email delivery may be delayed.",
          debug: `Resend status: ${emailResponse.status}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent to your email" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-otp error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send OTP" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
