import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import RazorpayTestCheckout from "@/components/RazorpayTestCheckout";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(price);

export default function ExplorationOffers({ explorationId, preview = false }: { explorationId: string; preview?: boolean }) {
  const [offers, setOffers] = useState<Tables<"exploration_offers">[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState("");
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
  const selected = offers.find(offer => offer.id === selectedId) || offers.find(offer => offer.enabled) || offers[0];
  if (!selected) return null;
  return <article aria-label="Purchase options" className="min-w-0 border border-border bg-card p-4 sm:p-6 space-y-5">
    <div className="space-y-2">
      <label htmlFor={`purchase-option-${explorationId}`} className="text-sm font-medium">Select a purchase option</label>
      <Select value={selected.id} onValueChange={setSelectedId}>
        <SelectTrigger id={`purchase-option-${explorationId}`} className="h-auto min-h-12 gap-3 text-left [&>span]:line-clamp-none [&>span]:whitespace-normal [&>span]:break-words">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
          {["product", "design", "configuration"].map(kind => {
            const group = offers.filter(offer => offer.kind === kind);
            return group.length > 0 && <SelectGroup key={kind}>
              <SelectLabel>{kind === "product" ? "Products" : "Files"}</SelectLabel>
              {group.map(offer => <SelectItem key={offer.id} value={offer.id} className="min-h-11 whitespace-normal break-words">
                {offer.title} · {formatPrice(offer.price_inr)}{!offer.enabled ? " · Unavailable" : ""}
              </SelectItem>)}
            </SelectGroup>;
          })}
        </SelectContent>
      </Select>
    </div>
    <div className="border-t border-border pt-5 space-y-2">
      <h3 className="font-display text-xl font-semibold break-words">{selected.title}</h3>
      {selected.description && <p className="text-sm text-muted-foreground whitespace-pre-line">{selected.description}</p>}
      <p className="font-display text-3xl font-semibold">{formatPrice(selected.price_inr)}</p>
      <RazorpayTestCheckout key={`${explorationId}-${selected.id}`} explorationId={explorationId} offer={selected} preview={preview} />
    </div>
  </article>;
}