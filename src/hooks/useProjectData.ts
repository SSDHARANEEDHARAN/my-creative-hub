import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProjectViewLikes = (projectId: string, userEmail: string | null, userName: string | null) => {
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const viewTracked = useRef(false);

  const loadCounts = useCallback(async () => {
    if (!projectId) return;

    // View count
    const { data: viewData } = await supabase
      .from("project_view_counts")
      .select("view_count")
      .eq("project_id", projectId)
      .maybeSingle();
    if (viewData) setViewCount(Number(viewData.view_count) || 0);

    // Like count
    const { data: likeData } = await supabase
      .from("project_likes_public")
      .select("id")
      .eq("project_id", projectId);
    setLikeCount(likeData?.length || 0);
  }, [projectId]);

  const checkUserLike = useCallback(async () => {
    if (!userEmail || !projectId) return;
    const { data } = await supabase
      .from("project_likes")
      .select("id")
      .eq("project_id", projectId)
      .eq("email", userEmail)
      .maybeSingle();
    setHasLiked(!!data);
  }, [userEmail, projectId]);

  // Track view once per user (by email) or once per session (anonymous)
  useEffect(() => {
    if (!projectId || viewTracked.current) return;
    
    const trackView = async () => {
      // For logged-in users, check if they already have a view record
      if (userEmail) {
        const { data: existingView } = await supabase
          .from("project_views")
          .select("id")
          .eq("project_id", projectId)
          .eq("viewer_email", userEmail)
          .maybeSingle();
        
        if (existingView) {
          viewTracked.current = true;
          return; // Already viewed by this user
        }
      } else {
        // For anonymous users, use sessionStorage
        const key = `project_viewed_${projectId}`;
        if (sessionStorage.getItem(key)) {
          viewTracked.current = true;
          return;
        }
        sessionStorage.setItem(key, "1");
      }
      
      viewTracked.current = true;
      await supabase.from("project_views").insert({
        project_id: projectId,
        viewer_email: userEmail,
        viewer_name: userName,
      });
      loadCounts();
    };
    
    trackView();
  }, [projectId, userEmail, userName, loadCounts]);

  useEffect(() => { loadCounts(); }, [loadCounts]);
  useEffect(() => { if (userEmail) checkUserLike(); }, [userEmail, checkUserLike]);

  const toggleLike = useCallback(async (name: string, email: string) => {
    if (!projectId) return;
    if (hasLiked) {
      // Unlike - need admin, so just toggle local state
      setHasLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase.from("project_likes").insert({
        project_id: projectId,
        name,
        email,
      });
      if (!error) {
        setHasLiked(true);
        setLikeCount((c) => c + 1);
      }
    }
  }, [projectId, hasLiked]);

  return { viewCount, likeCount, hasLiked, toggleLike, refresh: loadCounts };
};

// Batch hook for listing page - fetches all counts at once
export const useProjectListCounts = (projectIds: string[]) => {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (projectIds.length === 0) return;
    const ids = projectIds.map(String);

    // Fetch view counts
    supabase
      .from("project_view_counts")
      .select("project_id, view_count")
      .in("project_id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, number> = {};
          data.forEach((d) => { if (d.project_id) map[d.project_id] = Number(d.view_count) || 0; });
          setViewCounts(map);
        }
      });

    // Fetch like counts
    supabase
      .from("project_likes_public")
      .select("project_id")
      .in("project_id", ids)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, number> = {};
          data.forEach((d) => { if (d.project_id) map[d.project_id] = (map[d.project_id] || 0) + 1; });
          setLikeCounts(map);
        }
      });
  }, [projectIds.join(",")]);

  return { viewCounts, likeCounts };
};
