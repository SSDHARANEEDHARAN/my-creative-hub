import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OWNER_EMAIL = "tharaneetharanss@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema for contact form
const ContactEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long").trim(),
  message: z.string().min(1, "Message is required").max(5000, "Message too long").trim(),
  // Optional service request fields
  serviceType: z.string().optional(),
  serviceCategory: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional(),
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

    const { name, email, subject, message, serviceType, serviceCategory, budget, timeline, requirements }: ContactEmailRequest = parseResult.data;

    // Escape all user input for HTML safety
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeServiceType = serviceType ? escapeHtml(serviceType) : null;
    const safeServiceCategory = serviceCategory ? escapeHtml(serviceCategory) : null;
    const safeBudget = budget ? escapeHtml(budget) : null;
    const safeTimeline = timeline ? escapeHtml(timeline) : null;
    const safeRequirements = requirements ? escapeHtml(requirements) : null;

    console.log(`Processing contact form from: ${safeName} (${safeEmail})`);

    // Build email content based on whether it's a service request or general contact
    const isServiceRequest = safeServiceType && safeServiceCategory;
    
    let emailSubject = isServiceRequest 
      ? `Service Request: ${safeServiceType} - ${safeServiceCategory}`
      : `Portfolio Contact: ${safeSubject}`;
    
    let emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #000000, #333333); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
            ${isServiceRequest ? '🚀 New Service Request' : '📬 New Contact Message'}
          </h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Contact Information
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; color: #333;">
                <a href="mailto:${safeEmail}" style="color: #0066cc;">${safeEmail}</a>
              </td>
            </tr>
          </table>
    `;

    if (isServiceRequest) {
      emailHtml += `
          <h2 style="color: #333; margin-top: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Service Details
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Category:</td>
              <td style="padding: 10px 0; color: #333;">${safeServiceCategory}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold;">Service:</td>
              <td style="padding: 10px 0; color: #333;">${safeServiceType}</td>
            </tr>
            ${safeBudget ? `
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold;">Budget:</td>
              <td style="padding: 10px 0; color: #333;">${safeBudget}</td>
            </tr>
            ` : ''}
            ${safeTimeline ? `
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold;">Timeline:</td>
              <td style="padding: 10px 0; color: #333;">${safeTimeline}</td>
            </tr>
            ` : ''}
          </table>
          
          ${safeRequirements ? `
          <h2 style="color: #333; margin-top: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Project Requirements
          </h2>
          <div style="background: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeRequirements}</p>
          </div>
          ` : ''}
      `;
    } else {
      emailHtml += `
          <h2 style="color: #333; margin-top: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Message Details
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Subject:</td>
              <td style="padding: 10px 0; color: #333;">${safeSubject}</td>
            </tr>
          </table>
          <div style="background: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 4px; margin-top: 15px;">
            <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
      `;
    }

    emailHtml += `
        </div>
        
        <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
          <p style="margin: 0;">This email was sent from your portfolio website contact form.</p>
          <p style="margin: 5px 0 0 0;">Reply directly to this email to respond to ${safeName}.</p>
        </div>
      </div>
    `;

    // Send notification email to owner
    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!notificationResponse.ok) {
      const error = await notificationResponse.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email. Please try again later.");
    }

    const result = await notificationResponse.json();
    console.log("Email sent successfully to owner:", result);

    return new Response(
      JSON.stringify({ success: true, message: "Your message has been sent successfully!" }),
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
