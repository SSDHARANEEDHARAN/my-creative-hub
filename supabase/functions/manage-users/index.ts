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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const getRequestIp = (request: Request) => {
      const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const realIp = request.headers.get("x-real-ip")?.trim();
      const cfIp = request.headers.get("cf-connecting-ip")?.trim();
      return forwarded || realIp || cfIp || "unknown";
    };

    const requestIp = getRequestIp(req);
    const body = await req.json();
    const { action, targetUserId, targetEmail, status } = body;

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    if (action === "check-ip") {
      try {
        const { data: blockedIp, error } = await adminClient
          .from("blocked_ips")
          .select("ip,reason")
          .eq("ip", requestIp)
          .maybeSingle();

        if (error) throw error;

        return new Response(JSON.stringify({ blocked: !!blockedIp, ip: requestIp, reason: blockedIp?.reason || null }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        console.error("check-ip error:", error);
        return new Response(JSON.stringify({ blocked: false, ip: requestIp }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    if (action === "track-ip") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

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

      try {
        const { error } = await adminClient
          .from("profiles")
          .upsert({ user_id: user.id, last_ip: requestIp }, { onConflict: ["user_id"] });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, ip: requestIp }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

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

    // Helper function to get userId from email or use provided userId
    const getUserId = async (userId: string | undefined, email: string | undefined) => {
      if (userId) return userId;
      if (email) {
        const { data: users } = await adminClient.auth.admin.listUsers();
        const user = users.users.find(u => u.email === email);
        if (!user) throw new Error("User not found");
        return user.id;
      }
      throw new Error("Missing targetUserId or targetEmail");
    };

    if (action === "update-status") {
      if (!status) {
        return new Response(JSON.stringify({ error: "Missing status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (!["pending", "approved", "restricted", "temporary_locked", "blocked", "rejected"].includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const userId = await getUserId(targetUserId, targetEmail);

        if (status === "blocked") {
          const { data: profile, error: profileError } = await adminClient
            .from("profiles")
            .select("last_ip")
            .eq("user_id", userId)
            .maybeSingle();

          if (profileError) throw profileError;
          const targetIp = profile?.last_ip;

          if (targetIp) {
            const { error: blockError } = await adminClient
              .from("blocked_ips")
              .upsert(
                { ip: targetIp, user_id: userId, reason: "blocked by admin" },
                { onConflict: ["ip"] }
              );
            if (blockError) throw blockError;
          }
        }

        const { error } = await adminClient
          .from("profiles")
          .update({ status })
          .eq("user_id", userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    if (action === "delete") {
      try {
        const userId = await getUserId(targetUserId, targetEmail);

        // Delete from related tables
        await adminClient.from("profiles").delete().eq("user_id", userId);
        await adminClient.from("user_roles").delete().eq("user_id", userId);
        await adminClient.from("user_activity").delete().eq("user_id", userId);

        // Delete from auth
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
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
