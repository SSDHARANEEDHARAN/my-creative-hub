import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useExplorationLike = (id: string, preview = false) => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    if (preview || !id) return;
    const { data } = await supabase.rpc("exploration_like_count", { p_id: id });
    setCount(Number(data || 0));
    if (!user) { setLiked(false); return; }
    const result = await supabase.from("exploration_likes").select("user_id").eq("exploration_id", id).eq("user_id", user.id).maybeSingle();
    setLiked(Boolean(result.data));
  }, [id, preview, user?.id]);
  useEffect(() => {
    refresh();
    if (preview || !id) return;
    const channel = supabase.channel(`exploration-likes-${id}`).on("postgres_changes", { event: "*", schema: "public", table: "exploration_likes", filter: `exploration_id=eq.${id}` }, refresh).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);
  const toggle = async () => {
    if (!user || preview || busy) return;
    setBusy(true);
    const result = liked
      ? await supabase.from("exploration_likes").delete().eq("exploration_id", id).eq("user_id", user.id)
      : await supabase.from("exploration_likes").insert({ exploration_id: id, user_id: user.id });
    if (result.error) toast({ title: "Could not update like", description: result.error.message, variant: "destructive" });
    else await refresh();
    setBusy(false);
  };
  return { count, liked, busy, toggle, user };
};