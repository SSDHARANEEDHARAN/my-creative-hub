import { useEffect, useState } from "react";
import { CreditCard, Download, Loader2, RefreshCw } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LoginPopupModal from "@/components/LoginPopupModal";
import type { Tables } from "@/integrations/supabase/types";
import GlassFolder from "@/components/ui/glass-folder-cards";

type PaymentResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type Checkout = { open: () => void; on: (event: string, handler: () => void) => void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => Checkout } }
let scriptPromise: Promise<void> | undefined;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); scriptPromise = undefined; reject(new Error("Could not load checkout. Please try again.")); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}
export default function RazorpayTestCheckout({ explorationId, offer, preview = false }: { explorationId: string; offer?: Tables<"exploration_offers">; preview?: boolean }) {
  const target = offer ? { offerId: offer.id } : { explorationId };
  const priceLabel = offer ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(offer.price_inr) : "₹5";
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<PaymentResult | null>(null);
  const [paid, setPaid] = useState(false);
  // Preload checkout so phones open it immediately after the tap (slow mobile networks otherwise feel unresponsive).
  useEffect(() => { if (!preview) void loadCheckout().catch(() => undefined); }, [preview]);
  const [files, setFiles] = useState<{ name: string; url: string; description?: string | null }[] | null>(null);
  const sync = async () => {
    try { const data = await invoke({ action: "sync", ...target }); setPaid(Boolean(data?.paid)); if (data?.paid) { setPending(null); setBusy(false); setMessage("Payment confirmed."); } } catch (error) { setMessage(error instanceof Error ? error.message : "Could not check payment status"); }
  };
  useEffect(() => {
    setPaid(false); setMessage(""); setPending(null); setFiles(null);
    if (!user || preview) return;
    void sync();
    // Returning from a UPI app on a phone: re-check with Razorpay.
    const onVisible = () => { if (document.visibilityState === "visible") void sync(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => { document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("focus", onVisible); };
  }, [user?.id, explorationId, offer?.id, preview]);
  const loadFiles = async () => {
    setBusy(true);
    try { const data = await invoke({ action: "files", ...target }); setFiles(data.files || []); if (!data.files?.length) setMessage("Payment confirmed. Files will appear here once the seller uploads them."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not load files"); }
    finally { setBusy(false); }
  };
  async function invoke(body: Record<string, unknown>) {
    const { data, error } = await supabase.functions.invoke(offer ? "exploration-checkout" : "razorpay-checkout", { body });
    if (error) {
      let text = "Payment request failed. Please try again.";
      if (error instanceof FunctionsHttpError) { const details = await error.context.json().catch(() => null); if (typeof details?.error === "string") text = details.error; }
      throw new Error(text);
    }
    return data;
  };
  const verify = async (result: PaymentResult) => {
    setBusy(true); setPending(result);
    try { const data = await invoke({ action: "verify", ...result }); if (!data?.success) throw new Error("Payment could not be verified"); setPaid(true); setPending(null); setMessage("Payment confirmed."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Verification failed. Do not pay again."); }
    finally { setBusy(false); }
  };
  const start = async () => {
    if (!user) { setLoginOpen(true); return; }
    setBusy(true); setMessage("");
    try {
      await loadCheckout();
      const order = await invoke({ action: "create", ...target });
      const Constructor = window.Razorpay;
      if (!Constructor) throw new Error("Checkout could not load");
      const checkout = new Constructor({ key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id, name: "Tharanee", description: order.title || "₹5 checkout", prefill: { email: user.email }, handler: (result: PaymentResult) => { void verify(result); }, modal: { ondismiss: () => { setBusy(false); setMessage("Checking payment status…"); void sync(); } } });
      checkout.on("payment.failed", () => { setBusy(false); setMessage("Payment failed. Please check with your bank before trying again."); void sync(); });
      checkout.open();
    } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : "Could not open checkout"); }
  };
  return <div className="space-y-3 pt-3">
    {pending ? <Button variant="outline" className="h-auto min-h-10 whitespace-normal" disabled={busy || preview} onClick={() => void verify(pending)}><RefreshCw size={16} className="mr-2 shrink-0" />Retry verification</Button> : paid ? <Button className="h-auto min-h-10 whitespace-normal" disabled={busy || preview} onClick={() => void loadFiles()}>{busy ? <Loader2 size={16} className="mr-2 animate-spin shrink-0" /> : <Download size={16} className="mr-2 shrink-0" />}Get purchased files</Button> : <Button className="h-auto min-h-10 whitespace-normal" disabled={busy || preview || offer?.enabled === false} onClick={() => void start()}>{busy ? <Loader2 size={16} className="mr-2 animate-spin shrink-0" /> : <CreditCard size={16} className="mr-2 shrink-0" />}{offer?.enabled === false ? "Unavailable" : `Buy · ${priceLabel}`}</Button>}
    {paid && <p className="text-sm font-medium">Purchase confirmed</p>}
    {user && !preview && <Button size="sm" variant="ghost" disabled={busy} onClick={() => void sync()}><RefreshCw size={14} className="mr-2" />Check payment</Button>}
    {files && files.length > 0 && <GlassFolder label="Purchased files" files={files.map(f => ({ name: f.name, href: f.url, meta: f.description || undefined }))} />}
    {message && <p role="status" className="text-sm">{message}</p>}
    <LoginPopupModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
  </div>;
}