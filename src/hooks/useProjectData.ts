import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const getProjectLikeStorageKey = (projectId: string, email: string | null) =>
  `project_like_${projectId}_${email ?? "anonymous"}`;

const getProjectReadStorageKey = (projectId: string, email: string | null) =>
  `project_read_${projectId}_${email ?? "anonymous"}`;

export const useProjectViewLikes = (projectId: string, userEmail: string | null, userName: string | null) => {
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const viewTracked = useRef(false);
  const readTracked = useRef(false);

  const loadCounts = useCallback(async () => {
    if (!projectId) return;

    const [{ data: viewData }, { data: likeData }] = await Promise.all([
      supabase
        .from("project_view_counts")
        .select("view_count")
        .eq("project_id", projectId)
        .maybeSingle(),
      supabase
        .from("project_likes_public")
        .select("id")
        .eq("project_id", projectId),
    ]);

    const nextViewCount = Number(viewData?.view_count) || 0;
    setViewCount(nextViewCount);
    setReadCount(nextViewCount);
    setLikeCount(likeData?.length || 0);
    setHasLiked(Boolean(userEmail && localStorage.getItem(getProjectLikeStorageKey(projectId, userEmail)) === "1"));
    setHasRead(sessionStorage.getItem(getProjectReadStorageKey(projectId, userEmail)) === "1");
  }, [projectId, userEmail]);

  useEffect(() => {
    viewTracked.current = false;
    readTracked.current = false;
  }, [projectId, userEmail]);

  useEffect(() => {
    if (!projectId || viewTracked.current) return;

    const trackView = async () => {
      const key = `project_viewed_${projectId}`;
      if (sessionStorage.getItem(key)) {
        viewTracked.current = true;
        await loadCounts();
        return;
      }
      sessionStorage.setItem(key, "1");
      viewTracked.current = true;

      const { error } = await supabase.from("project_views").insert({
        project_id: projectId,
        viewer_email: userEmail,
        viewer_name: userName,
      });

      if (error) {
        console.error("Failed to track project view:", error);
      }

      await loadCounts();
    };

    trackView();
  }, [projectId, userEmail, userName, loadCounts]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  // Realtime subscription for live count updates
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`project-counts-${projectId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_views', filter: `project_id=eq.${projectId}` }, () => loadCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_likes', filter: `project_id=eq.${projectId}` }, () => loadCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_comments', filter: `project_id=eq.${projectId}` }, () => loadCounts())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_reads', filter: `project_id=eq.${projectId}` }, () => loadCounts())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, loadCounts]);

  const toggleLike = useCallback(async (name: string, email: string) => {
    if (!projectId) return;

    const likeStorageKey = getProjectLikeStorageKey(projectId, email);
    if (hasLiked || localStorage.getItem(likeStorageKey) === "1") {
      setHasLiked(true);
      await loadCounts();
      return;
    }

    const previousLikeCount = likeCount;
    setHasLiked(true);
    setLikeCount((count) => count + 1);
    localStorage.setItem(likeStorageKey, "1");

    const { error } = await supabase.from("project_likes").insert({
      project_id: projectId,
      name,
      email,
    });

    if (error) {
      if (error.code === "23505") {
        setHasLiked(true);
        localStorage.setItem(likeStorageKey, "1");
        await loadCounts();
        return;
      }

      console.error("Failed to like project:", error);
      localStorage.removeItem(likeStorageKey);
      setHasLiked(false);
      setLikeCount(previousLikeCount);
      return;
    }

    await loadCounts();
  }, [projectId, hasLiked, likeCount, loadCounts]);

  const trackRead = useCallback(async () => {
    if (!projectId || readTracked.current) return;

    const readStorageKey = getProjectReadStorageKey(projectId, userEmail);
    if (sessionStorage.getItem(readStorageKey)) {
      readTracked.current = true;
      setHasRead(true);
      return;
    }

    sessionStorage.setItem(readStorageKey, "1");
    readTracked.current = true;
    setHasRead(true);
    setReadCount((current) => Math.max(current, viewCount));
  }, [projectId, userEmail, viewCount]);

  return { viewCount, likeCount, readCount, hasLiked, hasRead, toggleLike, trackRead, refresh: loadCounts };
};

export const useProjectListCounts = (projectIds: string[]) => {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [readCounts, setReadCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const fetchAllCounts = useCallback(async () => {
    if (projectIds.length === 0) return;

    const ids = projectIds.map(String);
    const [viewsResult, likesResult, commentsResult, readsResult] = await Promise.all([
      supabase
        .from("project_view_counts")
        .select("project_id, view_count")
        .in("project_id", ids),
      supabase
        .from("project_likes_public")
        .select("project_id")
        .in("project_id", ids),
      supabase
        .from("project_comments_public")
        .select("project_id")
        .eq("is_approved", true)
        .in("project_id", ids),
      supabase
        .from("project_read_counts")
        .select("project_id, read_count")
        .in("project_id", ids),
    ]);

    const nextViewCounts: Record<string, number> = {};
    const nextLikeCounts: Record<string, number> = {};
    const nextCommentCounts: Record<string, number> = {};
    const nextReadCounts: Record<string, number> = {};

    viewsResult.data?.forEach((item) => {
      if (item.project_id) {
        nextViewCounts[item.project_id] = Number(item.view_count) || 0;
      }
    });

    likesResult.data?.forEach((item) => {
      if (item.project_id) {
        nextLikeCounts[item.project_id] = (nextLikeCounts[item.project_id] || 0) + 1;
      }
    });

    commentsResult.data?.forEach((item) => {
      if (item.project_id) {
        nextCommentCounts[item.project_id] = (nextCommentCounts[item.project_id] || 0) + 1;
      }
    });

    readsResult.data?.forEach((item) => {
      if (item.project_id) {
        nextReadCounts[item.project_id] = Number(item.read_count) || 0;
      }
    });

    setViewCounts(nextViewCounts);
    setReadCounts(nextReadCounts);
    setLikeCounts(nextLikeCounts);
    setCommentCounts(nextCommentCounts);
  }, [projectIds]);

  useEffect(() => {
    fetchAllCounts();
  }, [fetchAllCounts]);

  // Realtime subscription for list-level count updates
  useEffect(() => {
    if (projectIds.length === 0) return;

    const channel = supabase
      .channel('project-list-counts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_views' }, () => fetchAllCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_likes' }, () => fetchAllCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_comments' }, () => fetchAllCounts())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_reads' }, () => fetchAllCounts())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectIds, fetchAllCounts]);

  return { viewCounts, likeCounts, readCounts, commentCounts, refresh: fetchAllCounts };
};
