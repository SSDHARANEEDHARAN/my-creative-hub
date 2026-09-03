import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDownloadCount = (contentType: "blog" | "project", contentId: string) => {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!contentId) return;
    const { count: total } = await supabase
      .from("download_tracking")
      .select("*", { count: "exact", head: true })
      .eq("content_type", contentType)
      .eq("content_id", contentId);
    setCount(total || 0);
  }, [contentType, contentId]);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  return { count, refresh: fetchCount };
};

export const useDownloadCounts = (contentType: "blog" | "project", contentIds: string[]) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!contentIds.length) return;
    const fetchCounts = async () => {
      const { data } = await supabase
        .from("download_tracking")
        .select("content_id")
        .eq("content_type", contentType)
        .in("content_id", contentIds);
      
      const map: Record<string, number> = {};
      contentIds.forEach(id => { map[id] = 0; });
      data?.forEach(row => { map[row.content_id] = (map[row.content_id] || 0) + 1; });
      setCounts(map);
    };
    fetchCounts();
  }, [contentType, contentIds.join(",")]);

  return counts;
};
