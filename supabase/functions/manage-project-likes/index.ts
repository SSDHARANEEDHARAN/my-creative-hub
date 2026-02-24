import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, isWrite: boolean): boolean {
  const now = Date.now();
  const key = `${ip}:${isWrite ? "w" : "r"}`;
  const entry = rateLimitMap.get(key);
  const max = isWrite ? 10 : 30;
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

const AddSchema = z.object({ action: z.literal("add"), project_id: z.string().min(1).max(100), name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(255) });
const RemoveSchema = z.object({ action: z.literal("remove"), project_id: z.string().min(1).max(100), email: z.string().trim().email().max(255) });
const CheckSchema = z.object({ action: z.literal("check"), project_ids: z.array(z.string().min(1).max(100)).max(50), email: z.string().trim().email().max(255).optional() });
const CountSchema = z.object({ action: z.literal("count"), project_ids: z.array(z.string().min(1).max(100)).max(50) });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await req.json();
    const action = body?.action;
    const isWrite = action === "add" || action === "remove";

    if (isRateLimited(clientIp, isWrite)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (action === "add") {
      const parsed = AddSchema.safeParse(body);
      if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      const { project_id, name, email } = parsed.data;

      const { data: existing } = await supabase.from("project_likes").select("id").eq("project_id", project_id).eq("email", email).maybeSingle();
      if (existing) return new Response(JSON.stringify({ error: "Already liked" }), { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } });

      const { error } = await supabase.from("project_likes").insert({ project_id, name, email });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (action === "remove") {
      const parsed = RemoveSchema.safeParse(body);
      if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      const { project_id, email } = parsed.data;
      const { error } = await supabase.from("project_likes").delete().eq("project_id", project_id).eq("email", email);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (action === "check") {
      const parsed = CheckSchema.safeParse(body);
      if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      const { project_ids, email } = parsed.data;

      const { data: allLikes, error } = await supabase.from("project_likes").select("project_id").in("project_id", project_ids);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (allLikes || []).forEach((l: { project_id: string }) => { counts[l.project_id] = (counts[l.project_id] || 0) + 1; });

      let userLikedProjects: string[] = [];
      if (email) {
        const { data: userLikes } = await supabase.from("project_likes").select("project_id").in("project_id", project_ids).eq("email", email);
        userLikedProjects = (userLikes || []).map((l: { project_id: string }) => l.project_id);
      }

      return new Response(JSON.stringify({ counts, userLikedProjects }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (action === "count") {
      const parsed = CountSchema.safeParse(body);
      if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
      const { project_ids } = parsed.data;
      const { data: allLikes, error } = await supabase.from("project_likes").select("project_id").in("project_id", project_ids);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (allLikes || []).forEach((l: { project_id: string }) => { counts[l.project_id] = (counts[l.project_id] || 0) + 1; });
      return new Response(JSON.stringify({ counts }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("manage-project-likes error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
