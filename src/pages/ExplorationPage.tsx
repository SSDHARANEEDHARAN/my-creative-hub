import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Exploration } from "@/components/ExplorationCard";
import ExplorationDetails from "@/components/ExplorationDetails";
import ImageLightbox from "@/components/ImageLightbox";
import { Button } from "@/components/ui/button";

const ExplorationPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [item, setItem] = useState<Exploration | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const [views, setViews] = useState(0);
  const recorded = useRef<string | null>(null);
  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from("explorations").select("*").eq("id", id).maybeSingle();
      if (!active) return;
      setItem(data); setFailed(Boolean(error)); setLoading(false);
      if (data && recorded.current !== id) {
        recorded.current = id;
        await supabase.rpc("record_exploration_view", { p_id: id });
      }
      if (isAdmin) {
        const result = await supabase.from("exploration_views").select("id", { count: "exact", head: true }).eq("exploration_id", id);
        if (active) setViews(result.count || 0);
      }
    };
    load();
    const channel = supabase.channel(`exploration-detail-${id}`).on("postgres_changes", { event: "*", schema: "public", table: "explorations", filter: `id=eq.${id}` }, load).subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [id, isAdmin]);
  return <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16 min-h-screen">
    <Helmet><title>{item?.title || "Exploration"} | ArtTech Engine</title><meta name="description" content={item?.description.slice(0, 160) || "Engineering exploration details"} /></Helmet>
    <Button asChild variant="ghost" className="mb-6"><Link to="/blog"><ArrowLeft size={16} className="mr-2" /> Back to explorations</Link></Button>
    {loading ? <p role="status">Loading exploration…</p> : !item ? <p role="alert">{failed ? "Unable to load this exploration. Please try again." : "Exploration not found."}</p> : <div className="max-w-5xl mx-auto">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-6 break-words">{item.title}</h1>
      {isAdmin && <p className="text-xs text-muted-foreground flex items-center gap-2 mb-4"><Eye size={14} /> {views} views</p>}
      {item.images?.[0] && <Button variant="ghost" className="p-0 h-auto w-full block mb-3" aria-label="View main photo" onClick={() => setImageIndex(0)}><img src={item.images[0]} alt={item.title} className="w-full max-h-[580px] object-contain bg-muted" /></Button>}
      <div className="flex gap-2 overflow-x-auto mb-8">{item.images?.map((src, index) => <Button key={`${src}-${index}`} variant="ghost" className="shrink-0 p-0 h-20 w-24" aria-label={`View photo ${index + 1}`} onClick={() => setImageIndex(index)}><img src={src} alt={`${item.title} photo ${index + 1}`} loading="lazy" className="h-full w-full object-cover border border-border" /></Button>)}</div>
      <ExplorationDetails item={item} />
      <ImageLightbox images={(item.images || []).map(src => ({ src, alt: item.title }))} initialIndex={imageIndex ?? 0} isOpen={imageIndex !== null} onClose={() => setImageIndex(null)} />
    </div>}
  </main>;
};
export default ExplorationPage;