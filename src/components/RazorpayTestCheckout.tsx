import { useEffect, useState } from "react";
import { CreditCard, Loader2, RefreshCw } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LoginPopupModal from "@/components/LoginPopupModal";

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
export default function RazorpayTestCheckout({ explorationId, preview = false }: { explorationId: string; preview?: boolean }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<PaymentResult | null>(null);
  const [paid, setPaid] = useState(false);
  // Preload checkout so phones open it immediately after the tap (slow mobile networks otherwise feel unresponsive).
  useEffect(() => { if (!preview) void loadCheckout().catch(() => undefined); }, [preview]);
  useEffect(() => {
    setPaid(false); setMessage(""); setPending(null);
    if (!user || preview) return;
    let active = true;
    void supabase.from("razorpay_payment_tests").select("id").eq("user_id", user.id).eq("exploration_id", explorationId).eq("status", "paid").limit(1).then(({ data }) => { if (active) setPaid(Boolean(data?.length)); });
    return () => { active = false; };
  }, [user?.id, explorationId, preview]);
  const invoke = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("razorpay-checkout", { body });
    if (error) {
      let text = "Payment request failed. Please try again.";
      if (error instanceof FunctionsHttpError) { const details = await error.context.json().catch(() => null); if (typeof details?.error === "string") text = details.error; }
      throw new Error(text);
    }
    return data;
  };
  const verify = async (result: PaymentResult) => {
    setBusy(true); setPending(result);
    try { const data = await invoke({ action: "verify", ...result }); if (!data?.success) throw new Error("Payment could not be verified"); setPaid(true); setPending(null); setMessage("₹5 payment confirmed. This does not include the bot or part files."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Verification failed. Do not pay again."); }
    finally { setBusy(false); }
  };
  const start = async () => {
    if (!user) { setLoginOpen(true); return; }
    setBusy(true); setMessage("");
    try {
      await loadCheckout();
      const order = await invoke({ action: "create", explorationId });
      const Constructor = window.Razorpay;
      if (!Constructor) throw new Error("Checkout could not load");
      const checkout = new Constructor({ key: order.key_id, amount: order.amount, currency: order.currency, order_id: order.order_id, name: "Tharanee", description: "₹5 checkout trial — no bot or files included", handler: (result: PaymentResult) => { void verify(result); }, modal: { ondismiss: () => { setBusy(false); setMessage("Checkout closed. No purchase was confirmed."); } } });
      checkout.on("payment.failed", () => { setBusy(false); setMessage("Payment failed. Please check with your bank before trying again."); });
      checkout.open();
    } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : "Could not open checkout"); }
  };
  return <div className="space-y-3 pt-3">
    <p className="text-sm text-muted-foreground">₹5 checkout trial · Not a bot purchase and does not unlock files. Your Razorpay account determines whether money is charged.</p>
    {pending ? <Button variant="outline" disabled={busy || preview} onClick={() => void verify(pending)}><RefreshCw size={16} className="mr-2" />Retry payment verification</Button> : <Button disabled={busy || preview || paid} onClick={() => void start()}>{busy ? <Loader2 size={16} className="mr-2 animate-spin" /> : <CreditCard size={16} className="mr-2" />}{paid ? "₹5 payment confirmed" : "Pay ₹5"}</Button>}
    {message && <p role="status" className="text-sm">{message}</p>}
    <LoginPopupModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
  </div>;
}