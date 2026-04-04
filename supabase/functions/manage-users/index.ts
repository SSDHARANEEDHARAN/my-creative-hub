import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await authClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Check if caller is admin
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin only" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json();
    const { action, targetUserId, status } = body;

    if (action === "list") {
      // Get all profiles with their roles and activity
      const { data: profiles, error } = await adminClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get roles for all users
      const { data: roles } = await adminClient.from("user_roles").select("*");

      // Get activity for all users
      const { data: activities } = await adminClient
        .from("user_activity")
        .select("*")
        .order("created_at", { ascending: false });

      // Get view counts and share counts from various tables
      const enriched = profiles?.map((p: any) => {
        const userRoles = roles?.filter((r: any) => r.user_id === p.user_id) || [];
        const userActivity = activities?.filter((a: any) => a.user_id === p.user_id) || [];
        const lastLogin = userActivity.find((a: any) => a.action === "login");
        const lastLogout = userActivity.find((a: any) => a.action === "logout");

        return {
          ...p,
          roles: userRoles.map((r: any) => r.role),
          lastLogin: lastLogin?.created_at || null,
          lastLogout: lastLogout?.created_at || null,
          activityCount: userActivity.length,
        };
      });

      return new Response(JSON.stringify({ users: enriched }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (action === "update-status") {
      if (!targetUserId || !status) {
        return new Response(JSON.stringify({ error: "Missing targetUserId or status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (!["pending", "approved", "restricted"].includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const { error } = await adminClient
        .from("profiles")
        .update({ status })
        .eq("user_id", targetUserId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("manage-users error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
