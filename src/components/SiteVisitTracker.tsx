import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Logs every route change as a site_visits row in the database.
 * IP is captured server-side via ipify (best-effort) so admins can see
 * a per-visitor breakdown on the admin page.
 */
const SiteVisitTracker = () => {
  const location = useLocation();
  const { user } = useAuth();
  const ipRef = useRef<string | null>(null);
  const lastLoggedRef = useRef<string>("");

  // Fetch the visitor IP once per session (best-effort, never blocks UI).
  useEffect(() => {
    if (ipRef.current) return;
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => { ipRef.current = d?.ip || null; })
      .catch(() => { ipRef.current = null; });
  }, []);

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    // Avoid duplicate inserts for the same render of the same path
    if (lastLoggedRef.current === key) return;
    lastLoggedRef.current = key;

    const insert = async () => {
      try {
        await supabase.from("site_visits").insert({
          path: key,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          ip: ipRef.current,
          user_id: user?.id ?? null,
          user_email: user?.email ?? null,
        });
      } catch {
        /* swallow */
      }
    };
    // Small delay so the IP fetch has a chance to resolve
    const t = window.setTimeout(insert, 400);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search, user?.id, user?.email]);

  return null;
};

export default SiteVisitTracker;
