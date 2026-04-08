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

    // ── check-ip: no auth needed ──
    if (action === "check-ip") {
      try {
        const { data: blockedIp } = await adminClient
          .from("blocked_ips")
          .select("ip,reason")
          .eq("ip", requestIp)
          .maybeSingle();

        return new Response(JSON.stringify({ blocked: !!blockedIp, ip: requestIp, reason: blockedIp?.reason || null }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch {
        return new Response(JSON.stringify({ blocked: false, ip: requestIp }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // ── track-ip: requires auth ──
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
        // Update last_ip on profiles
        const { error } = await adminClient
          .from("profiles")
          .update({ last_ip: requestIp })
          .eq("user_id", user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, ip: requestIp }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // ── All remaining actions require admin auth ──
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

    // ── list ──
    if (action === "list") {
      const { data: profiles, error } = await adminClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: roles } = await adminClient.from("user_roles").select("*");
      const { data: activities } = await adminClient
        .from("user_activity")
        .select("*")
        .order("created_at", { ascending: false });

      const enriched = (profiles || []).map((p: Record<string, unknown>) => {
        const userRoles = (roles || []).filter((r: Record<string, unknown>) => r.user_id === p.user_id);
        const userActivity = (activities || []).filter((a: Record<string, unknown>) => a.user_id === p.user_id);
        const lastLogin = userActivity.find((a: Record<string, unknown>) => a.action === "login");
        const lastLogout = userActivity.find((a: Record<string, unknown>) => a.action === "logout");

        return {
          ...p,
          roles: userRoles.map((r: Record<string, unknown>) => r.role),
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

    // Helper to resolve userId
    const getUserId = async (userId?: string, email?: string): Promise<string> => {
      if (userId) return userId;
      if (email) {
        const { data: users } = await adminClient.auth.admin.listUsers();
        const found = users.users.find((u: { email?: string }) => u.email === email);
        if (!found) throw new Error("User not found");
        return found.id;
      }
      throw new Error("Missing targetUserId or targetEmail");
    };

    // ── update-status ──
    if (action === "update-status") {
      if (!status) {
        return new Response(JSON.stringify({ error: "Missing status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const validStatuses = ["pending", "approved", "restricted", "temporary_locked", "blocked", "rejected"];
      if (!validStatuses.includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid status" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const resolvedUserId = await getUserId(targetUserId, targetEmail);

        // If blocking, add IP to blocked_ips
        if (status === "blocked") {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("last_ip")
            .eq("user_id", resolvedUserId)
            .maybeSingle();

          const targetIp = profile?.last_ip;
          if (targetIp) {
            // Use insert with select-first approach to avoid type issues
            const { data: existing } = await adminClient
              .from("blocked_ips")
              .select("id")
              .eq("ip", targetIp)
              .maybeSingle();

            if (!existing) {
              await adminClient
                .from("blocked_ips")
                .insert({ ip: targetIp, user_id: resolvedUserId, reason: "blocked by admin" });
            }
          }
        }

        // If unblocking (going back to pending/approved), remove from blocked_ips
        if (status === "pending" || status === "approved") {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("last_ip")
            .eq("user_id", resolvedUserId)
            .maybeSingle();

          if (profile?.last_ip) {
            await adminClient.from("blocked_ips").delete().eq("ip", profile.last_ip);
          }
          // Also delete by user_id
          await adminClient.from("blocked_ips").delete().eq("user_id", resolvedUserId);
        }

        const { error: updateError } = await adminClient
          .from("profiles")
          .update({ status })
          .eq("user_id", resolvedUserId);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(JSON.stringify({ error: message }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // ── delete ──
    if (action === "delete") {
      try {
        const resolvedUserId = await getUserId(targetUserId, targetEmail);

        // Clean up all related data
        await adminClient.from("blocked_ips").delete().eq("user_id", resolvedUserId);
        await adminClient.from("profiles").delete().eq("user_id", resolvedUserId);
        await adminClient.from("user_roles").delete().eq("user_id", resolvedUserId);
        await adminClient.from("user_activity").delete().eq("user_id", resolvedUserId);

        const { error } = await adminClient.auth.admin.deleteUser(resolvedUserId);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(JSON.stringify({ error: message }), {
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
