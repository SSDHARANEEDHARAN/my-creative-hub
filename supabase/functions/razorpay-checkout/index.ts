import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { PAYMENT_TEST_AMOUNT_PAISE, isMatchingPayment } from "./rules.ts";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), explorationId: z.string().uuid() }),
  z.object({ action: z.literal("sync"), explorationId: z.string().uuid() }),
  z.object({ action: z.literal("files"), explorationId: z.string().uuid() }),
  z.object({ action: z.literal("verify"), razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]+$/), razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]+$/), razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/i) }),
]);
Deno.serve(async req => {
  const headers = { ...corsHeaders, "Content-Type": "application/json" };
  const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      const extra = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);
      const h = url.hostname;
      const allowed = h === "localhost" || h === "127.0.0.1" || h.endsWith(".lovable.app") || h.endsWith(".lovableproject.com") || h.endsWith(".vercel.app") || origin === Deno.env.get("SITE_URL") || extra.includes(origin);
      if (!allowed) { console.warn("Blocked origin", origin); return reply({ error: "Origin not allowed" }, 403); }
    } catch { return reply({ error: "Invalid origin" }, 403); }
  }
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return reply({ error: "Sign in to make a payment" }, 401);
    const { data: auth, error: authError } = await db.auth.getUser(token);
    if (authError || !auth.user) return reply({ error: "Sign in to make a payment" }, 401);
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return reply({ error: "Invalid payment request" }, 400);
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !secret) return reply({ error: "Payment setup is not complete" }, 503);
    const api = async (path: string, body?: unknown) => {
      const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
        method: body ? "POST" : "GET",
        headers: { Authorization: `Basic ${btoa(`${keyId}:${secret}`)}`, "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (!response.ok) throw new Error("Razorpay could not process this request. Please try again or check your payment account.");
      return response.json();
    };
    const input = parsed.data;
    if (input.action === "create") {
      const { data: exploration, error } = await db.from("explorations").select("id,is_visible,paid_parts").eq("id", input.explorationId).single();
      if (error || !exploration?.is_visible || !exploration.paid_parts) return reply({ error: "Payment unavailable for this exploration" }, 404);
      const { count: offers, error: offersError } = await db.from("exploration_offers").select("id", { count: "exact", head: true }).eq("exploration_id", input.explorationId);
      if (offersError) throw new Error("Could not check purchase options");
      if (offers) return reply({ error: "Choose a product or file purchase option on this page instead of the legacy ₹5 trial." }, 409);
      const { count, error: limitError } = await db.from("razorpay_payment_tests").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).gte("created_at", new Date(Date.now() - 3600000).toISOString());
      if (limitError) throw new Error("Could not check payment availability");
      if ((count || 0) >= 10) return reply({ error: "Too many payment attempts. Try again later." }, 429);
      const order = await api("orders", { amount: PAYMENT_TEST_AMOUNT_PAISE, currency: "INR", receipt: crypto.randomUUID(), notes: { purpose: "checkout_test_no_file_entitlement" } });
      if (typeof order.id !== "string" || order.amount !== PAYMENT_TEST_AMOUNT_PAISE || order.currency !== "INR") throw new Error("Unexpected payment order");
      const { error: saveError } = await db.from("razorpay_payment_tests").insert({ user_id: auth.user.id, exploration_id: exploration.id, order_id: order.id, amount_paise: PAYMENT_TEST_AMOUNT_PAISE, currency: "INR" });
      if (saveError) throw new Error("Could not save the payment order. No payment was taken.");
      return reply({ order_id: order.id, amount: order.amount, currency: order.currency, key_id: keyId });
    }
    if (input.action === "sync") {
      // UPI app switches on phones often lose the browser callback; ask Razorpay directly about this buyer's open orders.
      const { data: open } = await db.from("razorpay_payment_tests").select("id,order_id").eq("user_id", auth.user.id).eq("exploration_id", input.explorationId).neq("status", "paid").gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
      for (const row of open || []) {
        const items = ((await api(`orders/${row.order_id}/payments`)).items || []) as any[];
        let hit = items.find(p => isMatchingPayment(p, row.order_id));
        const authorized = items.find(p => p.status === "authorized" && p.amount === PAYMENT_TEST_AMOUNT_PAISE);
        if (!hit && authorized) { const cap = await api(`payments/${authorized.id}/capture`, { amount: PAYMENT_TEST_AMOUNT_PAISE, currency: "INR" }); if (isMatchingPayment(cap, row.order_id)) hit = cap; }
        if (hit) await db.from("razorpay_payment_tests").update({ status: "paid", payment_id: hit.id, paid_at: new Date().toISOString() }).eq("id", row.id);
      }
      const { count } = await db.from("razorpay_payment_tests").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).eq("exploration_id", input.explorationId).eq("status", "paid");
      return reply({ paid: (count || 0) > 0 });
    }
    if (input.action === "files") {
      const { count: offers, error: offersError } = await db.from("exploration_offers").select("id", { count: "exact", head: true }).eq("exploration_id", input.explorationId);
      if (offersError) throw new Error("Could not check purchase options");
      if (offers) return reply({ error: "Legacy ₹5 trials do not unlock these product or file purchases." }, 403);
      const { count } = await db.from("razorpay_payment_tests").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).eq("exploration_id", input.explorationId).eq("status", "paid");
      if (!count) return reply({ error: "Payment required to download files" }, 403);
      const { data: parts } = await db.from("exploration_parts").select("file_name,storage_path,description").eq("exploration_id", input.explorationId).eq("enabled", true).is("offer_id", null);
      const files = [];
      for (const p of parts || []) {
        const { data: signed } = await db.storage.from("exploration-parts").createSignedUrl(p.storage_path, 300, { download: p.file_name });
        if (signed?.signedUrl) files.push({ name: p.file_name, description: p.description, url: signed.signedUrl });
      }
      return reply({ files });
    }
    const { data: order } = await db.from("razorpay_payment_tests").select("*").eq("order_id", input.razorpay_order_id).eq("user_id", auth.user.id).single();
    if (!order) return reply({ error: "Payment order not found" }, 404);
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const signature = Uint8Array.from(input.razorpay_signature.match(/.{2}/g) || [], byte => parseInt(byte, 16));
    const valid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(`${order.order_id}|${input.razorpay_payment_id}`));
    if (!valid) return reply({ error: "Payment signature did not match" }, 400);
    let payment = await api(`payments/${input.razorpay_payment_id}`);
    if (payment.order_id !== order.order_id || payment.amount !== PAYMENT_TEST_AMOUNT_PAISE || payment.currency !== "INR") return reply({ error: "Payment does not match this order" }, 400);
    if (payment.status === "authorized") payment = await api(`payments/${input.razorpay_payment_id}/capture`, { amount: PAYMENT_TEST_AMOUNT_PAISE, currency: "INR" });
    if (!isMatchingPayment(payment, order.order_id)) return reply({ error: "Payment has not been captured yet. Retry verification shortly." }, 409);
    const { error: saveError } = await db.from("razorpay_payment_tests").update({ status: "paid", payment_id: input.razorpay_payment_id, paid_at: order.paid_at || new Date().toISOString() }).eq("id", order.id);
    if (saveError) throw new Error("Payment received, but confirmation could not be saved. Retry verification; do not pay again.");
    return reply({ success: true, amount: PAYMENT_TEST_AMOUNT_PAISE, file_access: false });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Payment request failed" }, 500);
  }
});