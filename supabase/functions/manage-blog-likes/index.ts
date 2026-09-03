import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (per instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_WRITE = 10; // max write ops per window
const RATE_LIMIT_MAX_READ = 30; // max read ops per window

function isRateLimited(ip: string, isWrite: boolean): boolean {
  const now = Date.now();
  const key = `${ip}:${isWrite ? "w" : "r"}`;
  const entry = rateLimitMap.get(key);
  const max = isWrite ? RATE_LIMIT_MAX_WRITE : RATE_LIMIT_MAX_READ;
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

const AddLikeSchema = z.object({
  action: z.literal("add"),
  post_id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
});

const RemoveLikeSchema = z.object({
  action: z.literal("remove"),
  post_id: z.string().min(1).max(100),
  email: z.string().trim().email().max(255),
});

const CheckLikeSchema = z.object({
  action: z.literal("check"),
  post_ids: z.array(z.string().min(1).max(100)).max(50),
  email: z.string().trim().email().max(255).optional(),
});

const CountLikeSchema = z.object({
  action: z.literal("count"),
  post_ids: z.array(z.string().min(1).max(100)).max(50),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await req.json();
    const action = body?.action;
    const isWrite = action === "add" || action === "remove";

    if (isRateLimited(clientIp, isWrite)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "add") {
      const parsed = AddLikeSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { post_id, name, email } = parsed.data;

      // Check for existing like
      const { data: existing } = await supabase
        .from("blog_likes")
        .select("id")
        .eq("post_id", post_id)
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "Already liked" }), {
          status: 409, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { error } = await supabase.from("blog_likes").insert({ post_id, name, email });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (action === "remove") {
      const parsed = RemoveLikeSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { post_id, email } = parsed.data;

      const { error } = await supabase
        .from("blog_likes")
        .delete()
        .eq("post_id", post_id)
        .eq("email", email);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (action === "check") {
      const parsed = CheckLikeSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { post_ids, email } = parsed.data;

      // Get counts per post
      const { data: allLikes, error } = await supabase
        .from("blog_likes")
        .select("post_id")
        .in("post_id", post_ids);

      if (error) throw error;

      const counts: Record<string, number> = {};
      (allLikes || []).forEach((l: { post_id: string }) => {
        counts[l.post_id] = (counts[l.post_id] || 0) + 1;
      });

      let userLikedPosts: string[] = [];
      if (email) {
        const { data: userLikes } = await supabase
          .from("blog_likes")
          .select("post_id")
          .in("post_id", post_ids)
          .eq("email", email);

        userLikedPosts = (userLikes || []).map((l: { post_id: string }) => l.post_id);
      }

      return new Response(JSON.stringify({ counts, userLikedPosts }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (action === "count") {
      const parsed = CountLikeSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid input" }), {
          status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      const { post_ids } = parsed.data;

      const { data: allLikes, error } = await supabase
        .from("blog_likes")
        .select("post_id")
        .in("post_id", post_ids);

      if (error) throw error;

      const counts: Record<string, number> = {};
      (allLikes || []).forEach((l: { post_id: string }) => {
        counts[l.post_id] = (counts[l.post_id] || 0) + 1;
      });

      return new Response(JSON.stringify({ counts }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("manage-blog-likes error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
