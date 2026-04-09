import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

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
        // Check blocked IPs
        const { data: blockedIp } = await adminClient
          .from("blocked_ips")
          .select("ip,reason")
          .eq("ip", requestIp)
          .maybeSingle();

        if (blockedIp) {
          return jsonResponse({ blocked: true, temp_locked: false, locked_at: null, ip: requestIp, reason: blockedIp.reason });
        }

        // Check if any profile with this IP is temp_locked
        const { data: lockedProfile } = await adminClient
          .from("profiles")
          .select("status,locked_at,last_ip")
          .eq("last_ip", requestIp)
          .eq("status", "temporary_locked")
          .maybeSingle();

        if (lockedProfile) {
          const lockedAt = lockedProfile.locked_at;
          const isExpired = lockedAt && (Date.now() - new Date(lockedAt).getTime()) > 48 * 60 * 60 * 1000;

          if (isExpired) {
            // Auto-unlock after 48 hours
            await adminClient
              .from("profiles")
              .update({ status: "approved", locked_at: null })
              .eq("last_ip", requestIp)
              .eq("status", "temporary_locked");

            return jsonResponse({ blocked: false, temp_locked: false, locked_at: null, ip: requestIp });
          }

          return jsonResponse({ blocked: false, temp_locked: true, locked_at: lockedAt, ip: requestIp });
        }

        return jsonResponse({ blocked: false, temp_locked: false, locked_at: null, ip: requestIp });
      } catch {
        return jsonResponse({ blocked: false, temp_locked: false, locked_at: null, ip: requestIp });
      }
    }

    // ── track-ip: requires auth ──
    if (action === "track-ip") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: userError } = await authClient.auth.getUser();
      if (userError || !user) return jsonResponse({ error: "Unauthorized" }, 401);

      try {
        await adminClient
          .from("profiles")
          .update({ last_ip: requestIp })
          .eq("user_id", user.id);

        return jsonResponse({ success: true, ip: requestIp });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return jsonResponse({ error: message }, 500);
      }
    }

    // ── user-history: requires admin auth ──
    if (action === "user-history") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: userError } = await authClient.auth.getUser();
      if (userError || !user) return jsonResponse({ error: "Unauthorized" }, 401);

      const { data: roleData } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleData) return jsonResponse({ error: "Forbidden" }, 403);

      const uid = targetUserId;
      if (!uid) return jsonResponse({ error: "Missing targetUserId" }, 400);

      const { data: profile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("user_id", uid)
        .maybeSingle();

      const userEmail = profile?.email || "";

      const [viewsRes, readsRes, likesRes, commentsRes, downloadsRes, activityRes] = await Promise.all([
        adminClient.from("project_views").select("*").eq("viewer_email", userEmail),
        adminClient.from("project_reads").select("*").eq("reader_email", userEmail),
        adminClient.from("project_likes").select("*").eq("email", userEmail),
        adminClient.from("project_comments").select("*").eq("email", userEmail),
        adminClient.from("download_tracking").select("*").eq("downloader_email", userEmail),
        adminClient.from("user_activity").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(50),
      ]);

      return jsonResponse({
        views: viewsRes.data || [],
        reads: readsRes.data || [],
        likes: likesRes.data || [],
        comments: commentsRes.data || [],
        downloads: downloadsRes.data || [],
        activity: activityRes.data || [],
      });
    }

    // ── All remaining actions require admin auth ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await authClient.auth.getUser();
    if (userError || !user) return jsonResponse({ error: "Unauthorized" }, 401);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) return jsonResponse({ error: "Forbidden: Admin only" }, 403);

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

      return jsonResponse({ users: enriched });
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
      if (!status) return jsonResponse({ error: "Missing status" }, 400);

      const validStatuses = ["pending", "approved", "restricted", "temporary_locked", "blocked", "rejected"];
      if (!validStatuses.includes(status)) return jsonResponse({ error: "Invalid status" }, 400);

      try {
        const resolvedUserId = await getUserId(targetUserId, targetEmail);

        // Build update object
        const updateData: Record<string, unknown> = { status };

        // Handle BLOCK: add IP to blocklist
        if (status === "blocked") {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("last_ip")
            .eq("user_id", resolvedUserId)
            .maybeSingle();

          const targetIp = profile?.last_ip;
          if (targetIp) {
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
          updateData.locked_at = null;
        }

        // Handle TEMP LOCK: set locked_at timestamp
        if (status === "temporary_locked") {
          updateData.locked_at = new Date().toISOString();
        }

        // Handle UNBLOCK/APPROVE: remove from blocklist
        if (status === "pending" || status === "approved") {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("last_ip")
            .eq("user_id", resolvedUserId)
            .maybeSingle();

          if (profile?.last_ip) {
            await adminClient.from("blocked_ips").delete().eq("ip", profile.last_ip);
          }
          await adminClient.from("blocked_ips").delete().eq("user_id", resolvedUserId);
          updateData.locked_at = null;
        }

        const { error: updateError } = await adminClient
          .from("profiles")
          .update(updateData)
          .eq("user_id", resolvedUserId);

        if (updateError) throw updateError;

        return jsonResponse({ success: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return jsonResponse({ error: message }, 400);
      }
    }

    // ── delete ──
    if (action === "delete") {
      try {
        const resolvedUserId = await getUserId(targetUserId, targetEmail);

        // Get email for cleaning related tables
        const { data: profile } = await adminClient
          .from("profiles")
          .select("email,last_ip")
          .eq("user_id", resolvedUserId)
          .maybeSingle();

        const userEmail = profile?.email || "";

        // Clean all related data
        await Promise.all([
          adminClient.from("blocked_ips").delete().eq("user_id", resolvedUserId),
          profile?.last_ip ? adminClient.from("blocked_ips").delete().eq("ip", profile.last_ip) : Promise.resolve(),
          adminClient.from("user_roles").delete().eq("user_id", resolvedUserId),
          adminClient.from("user_activity").delete().eq("user_id", resolvedUserId),
          userEmail ? adminClient.from("project_comments").delete().eq("email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("project_likes").delete().eq("email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("project_views").delete().eq("viewer_email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("project_reads").delete().eq("reader_email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("blog_comments").delete().eq("email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("blog_likes").delete().eq("email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("blog_views").delete().eq("viewer_email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("download_tracking").delete().eq("downloader_email", userEmail) : Promise.resolve(),
          userEmail ? adminClient.from("guest_visitors").delete().eq("email", userEmail) : Promise.resolve(),
        ]);

        await adminClient.from("profiles").delete().eq("user_id", resolvedUserId);

        const { error } = await adminClient.auth.admin.deleteUser(resolvedUserId);
        if (error) throw error;

        return jsonResponse({ success: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return jsonResponse({ error: message }, 400);
      }
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("manage-users error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
