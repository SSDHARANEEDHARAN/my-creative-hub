import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, Download, RefreshCw, ArrowLeft } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CARTIZION_ID, ownConfirmedPurchases } from "@/lib/buyerPurchases";
import { LORA_KEYCHAIN_ID } from "@/data/loraBuildGuide";
import GlassFolder from "@/components/ui/glass-folder-cards";

type Purchase = Tables<"exploration_purchases">;
type FileLink = { name: string; url: string; description?: string };
async function request(body: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke("exploration-checkout", { body });
  if (error) {
    const details = error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null;
    throw new Error(details?.error || "Unable to check this purchase. Please try again.");
  }
  return data;
}
function PurchasedFiles({ offerId }: { offerId: string }) {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<FileLink[]>([]);
  const [message, setMessage] = useState("");
  const load = async () => {
    setBusy(true); setFiles([]); setMessage("");
    try {
      const result = await request({ action: "files", offerId });
      setFiles(result.files || []);
      setMessage(result.files?.length ? "Download links expire after five minutes. Refresh downloads for new links." : "No files have been uploaded for this purchase yet.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to prepare downloads."); }
    finally { setBusy(false); }
  };
  return <div className="space-y-3">
    <Button variant="outline" disabled={busy} onClick={() => void load()}><Download size={16} className="mr-2" />{busy ? "Preparing…" : files.length ? "Refresh downloads" : "Get purchased files"}</Button>
    {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
    {files.length > 0 && <GlassFolder label="Purchased files" files={files.map(file => ({ name: file.name, href: file.url, meta: file.description }))} />}
  </div>;
}
export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!user) return;
    const result = await supabase.from("exploration_purchases").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (result.error) { setError("Unable to load your purchases. Please try again."); setLoading(false); return; }
    setRows(result.data || []); setLoading(false);
  }, [user?.id]);
  useEffect(() => {
    void load();
    if (!user) return;
    const channel = supabase.channel(`buyer-purchases-${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "exploration_purchases", filter: `user_id=eq.${user.id}` }, () => void load()).subscribe();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => { void supabase.removeChannel(channel); window.removeEventListener("focus", onFocus); };
  }, [load, user?.id]);
  const refresh = async () => {
    setRefreshing(true); setError("");
    try { for (const offerId of new Set(rows.filter(row => row.status !== "refunded").map(row => row.offer_id))) await request({ action: "sync", offerId }); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to verify payment status."); }
    finally { await load(); setRefreshing(false); }
  };
  const confirmed = ownConfirmedPurchases(rows, user?.id || "");
  const other = rows.filter(row => row.status !== "paid");
  const amount = (row: Purchase) => new Intl.NumberFormat("en-IN", { style: "currency", currency: row.currency }).format(row.amount_paise / 100);
  return <main className="container mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-16 min-h-screen">
    <Helmet><title>My Purchases | Tharanee</title><meta name="description" content="Your confirmed payments and purchased exploration downloads." /></Helmet>
    <Button asChild variant="ghost" className="mb-6"><Link to="/blog"><ArrowLeft size={16} className="mr-2" />Back to explorations</Link></Button>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8"><h1 className="font-display text-3xl sm:text-4xl font-semibold">My purchases</h1><Button variant="outline" disabled={loading || refreshing} onClick={() => void refresh()}><RefreshCw size={16} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />{refreshing ? "Checking…" : "Refresh payment status"}</Button></div>
    {error && <p role="alert" className="text-destructive mb-6">{error}</p>}
    {loading ? <p role="status">Loading your purchases…</p> : <>
      <section className="space-y-4"><h2 className="font-display text-xl font-semibold">Confirmed payments · {confirmed.length}</h2>
        {!confirmed.length && <p className="text-muted-foreground py-6 border-y border-border">No confirmed purchases yet.</p>}
        {confirmed.map(row => <article key={row.id} className="border border-border bg-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap justify-between gap-3"><h3 className="font-display text-xl font-semibold break-words">{row.offer_title}</h3><span className="font-semibold">{amount(row)}</span></div>
          <p className="text-sm">Payment confirmed · {new Date(row.paid_at || row.created_at).toLocaleDateString("en-IN")}</p>
          <dl className="text-sm text-muted-foreground space-y-1 break-all"><div><dt className="inline font-medium">Order: </dt><dd className="inline">{row.order_id}</dd></div><div><dt className="inline font-medium">Payment: </dt><dd className="inline">{row.payment_id}</dd></div></dl>
          <PurchasedFiles key={row.offer_id} offerId={row.offer_id} />
          <div className="flex flex-wrap gap-3"><Button asChild variant="ghost"><Link to={`/explorations/${row.exploration_id}`}>Product details</Link></Button>{(row.exploration_id === CARTIZION_ID || row.exploration_id === LORA_KEYCHAIN_ID) && <Button asChild variant="outline"><Link to={row.exploration_id === CARTIZION_ID ? "/cartizion/build-guide" : "/lora-keychain/build-guide"}><BookOpen size={16} className="mr-2" />Assembly guide</Link></Button>}</div>
        </article>)}
      </section>
      {other.length > 0 && <section className="mt-10"><h2 className="font-display text-xl font-semibold mb-4">Other payment attempts</h2><div className="divide-y divide-border border-y border-border">{other.map(row => <div key={row.id} className="py-4 flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium break-words">{row.offer_title}</p><p className="text-xs text-muted-foreground break-all">{row.order_id}</p><p className="text-sm text-muted-foreground">{row.status === "refunded" ? "Refunded · Downloads locked" : "Awaiting payment confirmation"}</p></div><span>{amount(row)}</span></div>)}</div></section>}
    </>}
  </main>;
}