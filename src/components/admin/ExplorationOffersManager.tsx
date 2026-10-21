import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { parseExplorationPrice } from "@/lib/explorationPrice";
import { Plus, Save } from "lucide-react";

export default function ExplorationOffersManager({ explorationId }: { explorationId: string }) {
  const [offers, setOffers] = useState<Tables<"exploration_offers">[]>([]);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const { data, error } = await supabase.from("exploration_offers").select("*").eq("exploration_id", explorationId).order("sort_order");
    if (error) toast({ title: "Could not load purchase options", variant: "destructive" });
    else setOffers(data || []);
  };
  useEffect(() => { void load(); }, [explorationId]);
  const save = async (offer: Tables<"exploration_offers">) => {
    try {
      const price = parseExplorationPrice(String(offer.price_inr));
      if (!offer.title.trim() || price == null || price <= 0 || price > 1000000) throw new Error("Enter a title and a price above zero, up to ₹10,00,000.");
      setBusy(true);
      const { error } = await supabase.from("exploration_offers").update({ title: offer.title.trim(), description: offer.description, price_inr: price, kind: offer.kind, enabled: offer.enabled, sort_order: offer.sort_order }).eq("id", offer.id);
      if (error) throw error;
      toast({ title: "Purchase option saved" });
    } catch (error) { toast({ title: "Could not save option", description: error instanceof Error ? error.message : "Please retry", variant: "destructive" }); }
    finally { setBusy(false); }
  };
  const add = async () => {
    setBusy(true);
    const { error } = await supabase.from("exploration_offers").insert({ exploration_id: explorationId, title: "New purchase option", kind: "product", price_inr: 1, enabled: false, sort_order: offers.length });
    if (error) toast({ title: "Could not add option", variant: "destructive" });
    else await load();
    setBusy(false);
  };
  const change = (id: string, values: Partial<Tables<"exploration_offers">>) => setOffers(list => list.map(o => o.id === id ? { ...o, ...values } : o));
  return <section className="space-y-4 border-y border-border py-4">
    <h4 className="font-semibold">Product variants & file prices</h4>
    {offers.map(offer => <div key={offer.id} className="space-y-2 border-b border-border pb-4">
      <Input aria-label={`Purchase title ${offer.id}`} value={offer.title} onChange={e => change(offer.id, { title: e.target.value })} />
      <Textarea aria-label={`Purchase description ${offer.id}`} value={offer.description} onChange={e => change(offer.id, { description: e.target.value })} />
      <div className="grid gap-2 sm:grid-cols-3">
        <select aria-label={`Purchase type ${offer.id}`} className="h-10 border border-input bg-background px-3 text-sm" value={offer.kind} onChange={e => change(offer.id, { kind: e.target.value })}><option value="product">Product</option><option value="design">Design files</option><option value="configuration">Configuration files</option></select>
        <Input aria-label={`Price INR ${offer.title}`} type="number" min="0.01" max="1000000" step="0.01" value={offer.price_inr} onChange={e => change(offer.id, { price_inr: Number(e.target.value) })} />
        <Input aria-label={`Order ${offer.title}`} type="number" value={offer.sort_order} onChange={e => change(offer.id, { sort_order: Number(e.target.value) })} />
      </div>
      <div className="flex flex-wrap gap-3 items-center"><label className="text-sm flex gap-2 items-center"><input type="checkbox" checked={offer.enabled} onChange={e => change(offer.id, { enabled: e.target.checked })} /> Available to buy</label><Button size="sm" disabled={busy} onClick={() => void save(offer)}><Save size={16} className="mr-2" />Save option</Button></div>
    </div>)}
    <Button variant="outline" disabled={busy} onClick={() => void add()}><Plus size={16} className="mr-2" />Add purchase option</Button>
  </section>;
}