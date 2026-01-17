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
  // Blog notification fields
  type: z.enum(["contact", "service", "blog_like", "blog_comment", "newsletter", "comment_reply"]).optional(),
  blogTitle: z.string().optional(),
  blogUrl: z.string().optional(),
  comment: z.string().optional(),
  // Comment reply fields
  originalComment: z.string().optional(),
  replyContent: z.string().optional(),
});

type ContactEmailRequest = z.infer<typeof ContactEmailSchema>;

// In-memory rate limiting store (per IP, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max emails per window
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
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  rateLimitStore.set(ip, record);
  return { allowed: true };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-contact-email function");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

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

    const data: ContactEmailRequest = parseResult.data;
    const { name, email, subject, message, serviceType, serviceCategory, budget, timeline, requirements, type, blogTitle, blogUrl, comment, originalComment, replyContent } = data;

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeServiceType = serviceType ? escapeHtml(serviceType) : null;
    const safeServiceCategory = serviceCategory ? escapeHtml(serviceCategory) : null;
    const safeBudget = budget ? escapeHtml(budget) : null;
    const safeTimeline = timeline ? escapeHtml(timeline) : null;
    const safeRequirements = requirements ? escapeHtml(requirements) : null;
    const safeBlogTitle = blogTitle ? escapeHtml(blogTitle) : null;
    const safeBlogUrl = blogUrl ? escapeHtml(blogUrl) : null;
    const safeComment = comment ? escapeHtml(comment) : null;
    const safeOriginalComment = originalComment ? escapeHtml(originalComment) : null;
    const safeReplyContent = replyContent ? escapeHtml(replyContent) : null;

    console.log(`Processing ${type || 'contact'} form from: ${safeName} (${safeEmail})`);

    // Handle newsletter subscription
    if (type === "newsletter") {
      const newsletterHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #ff9800, #ff5722); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📰 New Newsletter Subscriber!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Subscription</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #333;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${safeEmail}" style="color: #0066cc;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Subscribed:</td>
                <td style="padding: 10px 0; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0;">This subscriber signed up through your portfolio website.</p>
          </div>
        </div>
      `;

      // Try to send notification email to owner (non-blocking)
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Portfolio Newsletter <onboarding@resend.dev>",
            to: [OWNER_EMAIL],
            reply_to: email,
            subject: `📰 New Newsletter Subscriber: ${safeName}`,
            html: newsletterHtml,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.warn("Resend API warning (notification):", error);
          // Don't throw - continue with subscription flow
        }
      } catch (emailError) {
        console.warn("Email notification failed (non-critical):", emailError);
        // Don't throw - continue with subscription flow
      }

      // Generate unsubscribe token and update subscriber
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const SITE_URL = "https://id-preview--874a86dd-9d1d-452a-9c07-33267b933151.lovable.app";
      
      // Fetch the unsubscribe token for this subscriber
      let unsubscribeToken = "";
      try {
        const tokenResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}&select=unsubscribe_token`,
          {
            headers: {
              "apikey": SUPABASE_SERVICE_ROLE_KEY!,
              "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );
        const tokenData = await tokenResponse.json();
        if (tokenData && tokenData[0]) {
          unsubscribeToken = tokenData[0].unsubscribe_token;
        }
      } catch (e) {
        console.error("Failed to fetch unsubscribe token:", e);
      }

      const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;
      const blogUrl = `${SITE_URL}/#blog`;

      // Send welcome email to subscriber
      const welcomeHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #000000, #333333); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Welcome to TTS.dev Newsletter!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Hi ${safeName}! 👋</h2>
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              Thank you for subscribing to my newsletter! You'll now receive updates about:
            </p>
            <ul style="color: #555; line-height: 1.8;">
              <li>🚀 New projects and case studies</li>
              <li>📝 Latest blog posts and tutorials</li>
              <li>💡 Industry insights and tips</li>
              <li>🎯 Exclusive content and early access</li>
            </ul>
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              Stay tuned for exciting updates!
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <h3 style="color: #333; margin-bottom: 15px;">Quick Links</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 10px 0;">
                    <a href="${blogUrl}" style="display: inline-block; background: linear-gradient(135deg, #000000, #333333); color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">📖 Read Our Blog</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <a href="${SITE_URL}" style="display: inline-block; background: #0066cc; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">🏠 Visit Website</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Tharaneetharan SS - TTS.dev</p>
            <p style="margin: 0;">
              <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe from this newsletter</a>
            </p>
          </div>
        </div>
      `;

      // Try to send welcome email to subscriber (non-blocking)
      try {
        const welcomeResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "TTS.dev Newsletter <onboarding@resend.dev>",
            to: [email],
            subject: `🎉 Welcome to TTS.dev Newsletter!`,
            html: welcomeHtml,
          }),
        });

        if (!welcomeResponse.ok) {
          const error = await welcomeResponse.text();
          console.warn("Resend API warning (welcome email):", error);
          // Don't throw - subscription was still successful
        }
      } catch (emailError) {
        console.warn("Welcome email failed (non-critical):", emailError);
        // Don't throw - subscription was still successful
      }

      return new Response(
        JSON.stringify({ success: true, message: "Successfully subscribed to newsletter!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle blog like notification
    if (type === "blog_like") {
      const likeHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #e91e63, #9c27b0); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">❤️ Someone Liked Your Blog Post!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Like Notification</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">From:</td>
                <td style="padding: 10px 0; color: #333;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${safeEmail}" style="color: #0066cc;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Article:</td>
                <td style="padding: 10px 0; color: #333;">${safeBlogTitle}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Link:</td>
                <td style="padding: 10px 0; color: #333;"><a href="${safeBlogUrl}" style="color: #0066cc;">View Article</a></td>
              </tr>
            </table>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0;">This notification was sent from your portfolio website.</p>
          </div>
        </div>
      `;

      // Try to send like notification (non-blocking)
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Portfolio Blog <onboarding@resend.dev>",
            to: [OWNER_EMAIL],
            reply_to: email,
            subject: `❤️ New Like: ${safeBlogTitle}`,
            html: likeHtml,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.warn("Resend API warning (like notification):", error);
        }
      } catch (emailError) {
        console.warn("Like notification failed (non-critical):", emailError);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Like recorded successfully!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle blog comment notification
    if (type === "blog_comment") {
      const commentHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #2196f3, #00bcd4); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💬 New Comment on Your Blog!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Comment Notification</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">From:</td>
                <td style="padding: 10px 0; color: #333;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${safeEmail}" style="color: #0066cc;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Article:</td>
                <td style="padding: 10px 0; color: #333;">${safeBlogTitle}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Link:</td>
                <td style="padding: 10px 0; color: #333;"><a href="${safeBlogUrl}" style="color: #0066cc;">View Article</a></td>
              </tr>
            </table>
            <h3 style="color: #333; margin-top: 20px;">Comment:</h3>
            <div style="background: #ffffff; padding: 15px; border-left: 4px solid #2196f3; margin-top: 10px;">
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeComment}</p>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0;">Reply directly to this email to respond to ${safeName}.</p>
          </div>
        </div>
      `;

      // Try to send comment notification (non-blocking)
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Portfolio Blog <onboarding@resend.dev>",
            to: [OWNER_EMAIL],
            reply_to: email,
            subject: `💬 New Comment: ${safeBlogTitle}`,
            html: commentHtml,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.warn("Resend API warning (comment notification):", error);
        }
      } catch (emailError) {
        console.warn("Comment notification failed (non-critical):", emailError);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Comment submitted successfully!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Handle comment reply notification (sent to the commenter)
    if (type === "comment_reply") {
      const SITE_URL = "https://id-preview--874a86dd-9d1d-452a-9c07-33267b933151.lovable.app";
      
      const replyHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">💬 You Got a Reply!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Hi ${safeName}! 👋</h2>
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              Tharaneetharan SS has replied to your comment on the blog post: <strong>${safeBlogTitle}</strong>
            </p>
            
            <div style="background: #ffffff; padding: 15px; border-left: 4px solid #ccc; margin: 20px 0;">
              <p style="color: #666; margin: 0 0 5px 0; font-size: 12px;">Your comment:</p>
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeOriginalComment}</p>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
              <p style="color: #2e7d32; margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">Reply from Tharaneetharan SS:</p>
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${safeReplyContent}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${SITE_URL}/#blog" style="display: inline-block; background: linear-gradient(135deg, #000000, #333333); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">📖 View Blog</a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
            <p style="margin: 0;">Thank you for engaging with our blog!</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Tharaneetharan SS - TTS.dev</p>
          </div>
        </div>
      `;

      // Send reply notification to commenter
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "TTS.dev Blog <onboarding@resend.dev>",
            to: [email],
            subject: `💬 Reply to your comment on: ${safeBlogTitle}`,
            html: replyHtml,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.warn("Resend API warning (reply notification):", error);
        } else {
          console.log("Reply notification sent to:", email);
        }
      } catch (emailError) {
        console.warn("Reply notification failed (non-critical):", emailError);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Reply notification sent!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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

    // Send notification email to owner (non-blocking for trial accounts)
    let emailSent = false;
    try {
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
        console.warn("Resend API warning (contact notification):", error);
      } else {
        const result = await notificationResponse.json();
        console.log("Email sent successfully to owner:", result);
        emailSent = true;
      }
    } catch (emailError) {
      console.warn("Contact notification failed (non-critical):", emailError);
    }

    // Send thank-you confirmation email to the user
    const thankYouHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Thank You for Reaching Out!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Hi ${safeName}! 👋</h2>
          
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            Thank you for contacting me through my portfolio website. I have received your message and will get back to you within <strong>24 hours</strong>.
          </p>
          
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>I'll review your message carefully</li>
              <li>You'll receive a personalized response within 24 hours</li>
              <li>We can schedule a call to discuss your project in detail</li>
            </ul>
          </div>
          
          <h3 style="color: #333; margin-top: 25px;">Your Message Summary:</h3>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
            <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${safeSubject}</p>
            <p style="color: #666; margin: 5px 0; white-space: pre-wrap;"><strong>Message:</strong> ${safeMessage.substring(0, 200)}${safeMessage.length > 200 ? '...' : ''}</p>
          </div>
          
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            In the meantime, feel free to explore my portfolio or connect with me on social media.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.linkedin.com/in/dharaneedharan-ss-70941a211/" style="display: inline-block; padding: 12px 25px; background: #0077b5; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">LinkedIn</a>
            <a href="https://github.com/SSDHARANEEDHARAN" style="display: inline-block; padding: 12px 25px; background: #333; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">GitHub</a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #333; color: #999; font-size: 12px;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0; color: #fff; font-weight: bold;">Tharaneetharan SS</p>
          <p style="margin: 5px 0;">Full Stack Developer & CAD Engineer</p>
          <p style="margin: 10px 0 0 0; color: #666;">📧 tharaneetharanss@gmail.com | 📱 +91 8870086023</p>
        </div>
      </div>
    `;

    // Send confirmation email to user (non-blocking)
    try {
      const confirmationResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Tharaneetharan SS <onboarding@resend.dev>",
          to: [email],
          subject: `Thank you for contacting me, ${safeName}! ✅`,
          html: thankYouHtml,
        }),
      });

      if (confirmationResponse.ok) {
        console.log("Confirmation email sent to user:", email);
      } else {
        const error = await confirmationResponse.text();
        console.warn("Resend API warning (confirmation email):", error);
      }
    } catch (emailError) {
      console.warn("Confirmation email failed (non-critical):", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Your message has been sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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