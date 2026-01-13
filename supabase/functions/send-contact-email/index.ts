import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const ContactEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long").trim(),
  message: z.string().min(1, "Message is required").max(5000, "Message too long").trim(),
});

type ContactEmailRequest = z.infer<typeof ContactEmailSchema>;

// In-memory rate limiting store (per IP, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max emails per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// HTML escape function to prevent XSS
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

// Rate limiting check
const checkRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired - reset
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(ip, record);
  return { allowed: true };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-contact-email function");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  // Check rate limit
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ 
        error: "Too many requests. Please try again later.",
        retryAfter: rateLimit.retryAfter 
      }),
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Retry-After": String(rateLimit.retryAfter),
          ...corsHeaders 
        },
      }
    );
  }

  try {
    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = ContactEmailSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(e => e.message).join(", ");
      console.log(`Validation failed: ${errors}`);
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, subject, message }: ContactEmailRequest = parseResult.data;

    // Escape all user input for HTML safety
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    console.log(`Processing contact form from: ${safeName} (${safeEmail})`);

    // Send notification email
    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [email], // Use original email for delivery (validated)
        subject: `New Contact: ${safeSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Subject:</strong> ${safeSubject}</p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <h3 style="color: #334155; margin-top: 0;">Message:</h3>
              <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!notificationResponse.ok) {
      const error = await notificationResponse.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email. Please try again later.");
    }

    const result = await notificationResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    // Return generic error message to avoid leaking internal details
    return new Response(
      JSON.stringify({ error: "Failed to send message. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
