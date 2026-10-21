import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import RazorpayTestCheckout from "@/components/RazorpayTestCheckout";

export default function ExplorationOffers({ explorationId, preview = false }: { explorationId: string; preview?: boolean }) {
  const [offers, setOffers] = useState<Tables<"exploration_offers">[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from("exploration_offers").select("*").eq("exploration_id", explorationId).order("sort_order");
      if (active) { setOffers(data || []); setFailed(Boolean(error)); setLoading(false); }
    };
    void load();
    const channel = supabase.channel(`offers-${explorationId}-${preview}`).on("postgres_changes", { event: "*", schema: "public", table: "exploration_offers", filter: `exploration_id=eq.${explorationId}` }, () => void load()).subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, [explorationId, preview]);
  if (loading) return <p role="status">Loading purchase options…</p>;
  if (failed) return <p role="alert">Unable to load prices. Please refresh before purchasing.</p>;
  if (!offers.length) return <RazorpayTestCheckout explorationId={explorationId} preview={preview} />;
  return <div className="space-y-8">{["product", "design", "configuration"].map(kind => {
    const group = offers.filter(offer => offer.kind === kind);
    if (!group.length) return null;
    return <section key={kind} className="space-y-4">
      <h3 className="font-display text-xl font-semibold">{kind === "product" ? "Product variants" : kind === "design" ? "Design files" : "Configuration files"}</h3>
      <div className={kind === "product" ? "grid gap-4 md:grid-cols-3" : "grid gap-4"}>{group.map(offer => <article key={offer.id} className="min-w-0 border border-border p-4 flex flex-col gap-3 bg-card">
        <h4 className="font-semibold break-words">{offer.title}</h4>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{offer.description}</p>
        <p className="font-display text-2xl font-semibold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(offer.price_inr)}</p>
        <div className="mt-auto"><RazorpayTestCheckout explorationId={explorationId} offer={offer} preview={preview} /></div>
      </article>)}</div>
    </section>;
  })}</div>;
}