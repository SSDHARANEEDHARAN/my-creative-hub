import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Hook for batch loading project counts across list page
export const useProjectListCounts = (projectIds: string[], userEmail: string | null) => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const viewsTracked = useRef<Set<string>>(new Set());

  const loadCounts = useCallback(async () => {
    if (!projectIds.length) return;
    try {
      const [likesRes, viewsRes] = await Promise.all([
        supabase.functions.invoke("manage-project-likes", {
          body: { action: "count", project_ids: projectIds },
        }),
        supabase.from("project_view_counts").select("*").in("project_id", projectIds),
      ]);

      if (likesRes.data?.counts) setLikeCounts(likesRes.data.counts);
      if (viewsRes.data) {
        const vc: Record<string, number> = {};
        viewsRes.data.forEach((v: { project_id: string; view_count: number }) => { vc[v.project_id] = v.view_count; });
        setViewCounts(vc);
      }
    } catch (error) {
      console.error("Failed to load project counts:", error);
    }
  }, [projectIds.join(",")]);

  const checkUserLikes = useCallback(async () => {
    if (!projectIds.length || !userEmail) { setUserLikes(new Set()); return; }
    try {
      const { data } = await supabase.functions.invoke("manage-project-likes", {
        body: { action: "check", project_ids: projectIds, email: userEmail },
      });
      if (data?.userLikedProjects) setUserLikes(new Set(data.userLikedProjects));
    } catch (error) {
      console.error("Failed to check user project likes:", error);
    }
  }, [projectIds.join(","), userEmail]);

  useEffect(() => { loadCounts(); }, [loadCounts]);
  useEffect(() => { checkUserLikes(); }, [checkUserLikes]);

  const trackView = useCallback(async (projectId: string, email: string | null, name: string | null) => {
    const viewKey = `project_viewed_${projectId}`;
    if (viewsTracked.current.has(projectId) || sessionStorage.getItem(viewKey)) return;
    viewsTracked.current.add(projectId);
    try {
      await supabase.from("project_views").insert({
        project_id: projectId,
        viewer_email: email,
        viewer_name: name,
      });
      sessionStorage.setItem(viewKey, "1");
      setViewCounts((prev) => ({ ...prev, [projectId]: (prev[projectId] || 0) + 1 }));
    } catch (e) {
      console.error("Failed to track project view:", e);
    }
  }, []);

  const handleLike = async (projectId: string, name: string, email: string) => {
    const hasLiked = userLikes.has(projectId);
    if (hasLiked) {
      const { error } = await supabase.functions.invoke("manage-project-likes", {
        body: { action: "remove", project_id: projectId, email },
      });
      if (!error) {
        setUserLikes((prev) => { const s = new Set(prev); s.delete(projectId); return s; });
        setLikeCounts((prev) => ({ ...prev, [projectId]: Math.max(0, (prev[projectId] || 0) - 1) }));
        toast({ description: "Removed from liked projects" });
      }
    } else {
      const { data, error } = await supabase.functions.invoke("manage-project-likes", {
        body: { action: "add", project_id: projectId, name, email },
      });
      if (!error && !data?.error) {
        setUserLikes((prev) => new Set([...prev, projectId]));
        setLikeCounts((prev) => ({ ...prev, [projectId]: (prev[projectId] || 0) + 1 }));
        toast({ description: "Added to liked projects!" });
      }
    }
  };

  return { likeCounts, viewCounts, userLikes, trackView, handleLike, refresh: loadCounts };
};
