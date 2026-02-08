import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = "https://id-preview--874a86dd-9d1d-452a-9c07-33267b933151.lovable.app";

const getAllowedOrigin = (req: Request): string => {
  const origin = req.headers.get("origin") || "";
  const allowedPatterns = [
    SITE_URL,
    "https://story-and-more.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ].filter(Boolean);
  
  if (allowedPatterns.includes(origin) || origin.endsWith(".lovable.app")) {
    return origin;
  }
  return SITE_URL;
};

const getCorsHeaders = (req: Request) => ({
  "Access-Control-Allow-Origin": getAllowedOrigin(req),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Credentials": "true",
});

const NotifySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  type: z.enum(["post", "project"]),
  url: z.string().url().optional(),
});

const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match] || match);
};

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify admin authentication
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  // Get user from token
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const userId = user.id;

  // Check admin role using service role client
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: roleData, error: roleError } = await adminSupabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !roleData) {
    return new Response(
      JSON.stringify({ error: "Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const rawBody = await req.json();
    const parseResult = NotifySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { title, description, type, url } = parseResult.data;
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);

    // Fetch all active subscribers
    const { data: subscribers, error: subError } = await adminSupabase
      .from("newsletter_subscribers")
      .select("email, unsubscribe_token")
      .eq("is_active", true);

    if (subError || !subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active subscribers found", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const typeLabel = type === "post" ? "Blog Post" : "Project";
    const emoji = type === "post" ? "📝" : "🚀";
    let successCount = 0;
    const errors: string[] = [];

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.unsubscribe_token}`;
      
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #000000, #333333); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${emoji} New ${typeLabel} Alert!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0; font-size: 22px;">${safeTitle}</h2>
            <p style="color: #555; line-height: 1.8; font-size: 16px;">${safeDescription}</p>
            
            ${url ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${url}" style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View ${typeLabel}
              </a>
            </div>
            ` : ''}
          </div>
          
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Tharaneetharan SS - TTS.dev</p>
            <p style="margin: 0;">
              <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;

      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "TTS.dev Updates <onboarding@resend.dev>",
            to: [subscriber.email],
            subject: `${emoji} New ${typeLabel}: ${safeTitle}`,
            html: emailHtml,
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          const errorText = await response.text();
          errors.push(`${subscriber.email}: ${errorText}`);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${subscriber.email}: ${errorMessage}`);
      }
    }

    console.log(`Sent notifications to ${successCount}/${subscribers.length} subscribers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount, 
        total: subscribers.length,
        errors: errors.length > 0 ? errors : undefined 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notifications" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
