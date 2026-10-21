import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { offerAmountPaise, matchesPurchase } from "./rules.ts";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), offerId: z.string().uuid() }),
  z.object({ action: z.literal("sync"), offerId: z.string().uuid() }),
  z.object({ action: z.literal("files"), offerId: z.string().uuid() }),
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
      const host = new URL(origin).hostname;
      const extra = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map(s => s.trim());
      if (!(host === "localhost" || host === "127.0.0.1" || host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com") || host.endsWith(".vercel.app") || origin === Deno.env.get("SITE_URL") || extra.includes(origin))) return reply({ error: "Origin not allowed" }, 403);
    } catch { return reply({ error: "Invalid origin" }, 403); }
  }
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return reply({ error: "Sign in to purchase" }, 401);
    const { data: auth, error: authError } = await db.auth.getUser(token);
    if (authError || !auth.user) return reply({ error: "Sign in to purchase" }, 401);
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return reply({ error: "Invalid purchase request" }, 400);
    const keyId = Deno.env.get("RAZORPAY_KEY_ID"), secret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !secret) return reply({ error: "Payment setup is not complete" }, 503);
    const api = async (path: string, body?: unknown) => {
      const response = await fetch(`https://api.razorpay.com/v1/${path}`, { method: body ? "POST" : "GET", headers: { Authorization: `Basic ${btoa(`${keyId}:${secret}`)}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
      if (!response.ok) throw new Error("Razorpay could not process this request. Please retry verification before paying again.");
      return response.json();
    };
    const savePaid = async (row: { id: string; order_id: string; amount_paise: number; paid_at?: string | null }, payment: { id: string; order_id: string; amount: number; currency: string; status: string }) => {
      if (payment.status === "authorized" && payment.order_id === row.order_id && payment.amount === row.amount_paise && payment.currency === "INR") payment = await api(`payments/${payment.id}/capture`, { amount: row.amount_paise, currency: "INR" });
      if (!matchesPurchase(payment, row.order_id, row.amount_paise)) return false;
      const { error } = await db.from("exploration_purchases").update({ status: "paid", payment_id: payment.id, paid_at: row.paid_at || new Date().toISOString() }).eq("id", row.id);
      if (error) throw new Error("Payment received but confirmation was not saved. Retry verification; do not pay again.");
      return true;
    };
    const input = parsed.data;
    if (input.action === "verify") {
      const { data: row, error } = await db.from("exploration_purchases").select("*").eq("order_id", input.razorpay_order_id).eq("user_id", auth.user.id).single();
      if (error || !row) return reply({ error: "Purchase order not found" }, 404);
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
      const signature = Uint8Array.from(input.razorpay_signature.match(/.{2}/g) || [], b => parseInt(b, 16));
      if (!await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(`${row.order_id}|${input.razorpay_payment_id}`))) return reply({ error: "Payment signature did not match" }, 400);
      if (row.status === "refunded") return reply({ error: "This purchase was refunded" }, 409);
      const payment = await api(`payments/${input.razorpay_payment_id}`);
      if (!await savePaid(row, payment)) return reply({ error: "Payment is not captured yet. Retry verification; do not pay again." }, 409);
      return reply({ success: true, amount: row.amount_paise, offer_id: row.offer_id });
    }
    const { data: offer, error: offerError } = await db.from("exploration_offers").select("*").eq("id", input.offerId).single();
    if (offerError || !offer) return reply({ error: "Purchase option not found" }, 404);
    if (input.action === "sync") {
      const { data: open, error } = await db.from("exploration_purchases").select("*").eq("user_id", auth.user.id).eq("offer_id", offer.id).eq("status", "created").gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()).order("created_at", { ascending: false }).limit(10);
      if (error) throw new Error("Could not check purchase status");
      for (const row of open || []) {
        const response = await api(`orders/${row.order_id}/payments`);
        for (const payment of response.items || []) { if (await savePaid(row, payment)) break; }
      }
    }
    const { data: paidRows, error: paidError } = await db.from("exploration_purchases").select("*").eq("user_id", auth.user.id).eq("offer_id", offer.id).eq("status", "paid");
    if (paidError) throw new Error("Could not read purchase status");
    // Re-check captured payment and refunds before granting downloads, including existing purchases.
    let paid = false;
    for (const row of paidRows || []) {
      const payment = await api(`payments/${row.payment_id}`);
      if (matchesPurchase(payment, row.order_id, row.amount_paise) && !(payment.amount_refunded > 0)) paid = true;
      else if (payment.amount_refunded > 0 || payment.status === "refunded") {
        const { error } = await db.from("exploration_purchases").update({ status: "refunded" }).eq("id", row.id);
        if (error) throw new Error("Could not update refund status");
      }
    }
    if (input.action === "sync") return reply({ paid });
    if (input.action === "files") {
      if (!paid) return reply({ error: "Purchase this option to download its files" }, 403);
      const { data: parts, error } = await db.from("exploration_parts").select("file_name,storage_path,description").eq("exploration_id", offer.exploration_id).eq("offer_id", offer.id).eq("enabled", true);
      if (error) throw new Error("Could not load purchased files");
      const files = [];
      for (const part of parts || []) {
        const { data, error } = await db.storage.from("exploration-parts").createSignedUrl(part.storage_path, 300, { download: part.file_name });
        if (error) throw new Error("Could not prepare download. Please retry.");
        if (data?.signedUrl) files.push({ name: part.file_name, description: part.description, url: data.signedUrl });
      }
      return reply({ files });
    }
    const { data: exploration } = await db.from("explorations").select("is_visible,paid_parts").eq("id", offer.exploration_id).single();
    if (!offer.enabled || !exploration?.is_visible || !exploration.paid_parts) return reply({ error: "This purchase is unavailable" }, 404);
    if (paid) return reply({ error: "Already purchased. Refresh payment status to download your files." }, 409);
    if (offer.kind !== "product") {
      const { count, error } = await db.from("exploration_parts").select("id", { count: "exact", head: true }).eq("offer_id", offer.id).eq("exploration_id", offer.exploration_id).eq("enabled", true);
      if (error) throw new Error("Could not check file availability");
      if (!count) return reply({ error: "These files have not been uploaded yet. No payment was taken." }, 409);
    }
    const { count, error: limitError } = await db.from("exploration_purchases").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).gte("created_at", new Date(Date.now() - 3600000).toISOString());
    if (limitError) throw new Error("Could not check payment availability");
    if ((count || 0) >= 10) return reply({ error: "Too many payment attempts. Try again later." }, 429);
    const amount = offerAmountPaise(Number(offer.price_inr));
    const order = await api("orders", { amount, currency: "INR", receipt: crypto.randomUUID(), notes: { offer_id: offer.id, exploration_id: offer.exploration_id } });
    if (typeof order.id !== "string" || !/^order_[A-Za-z0-9]+$/.test(order.id) || order.amount !== amount || order.currency !== "INR") throw new Error("Unexpected payment order");
    const { error } = await db.from("exploration_purchases").insert({ user_id: auth.user.id, exploration_id: offer.exploration_id, offer_id: offer.id, offer_title: offer.title, order_id: order.id, amount_paise: amount });
    if (error) throw new Error("Could not save purchase order. No payment was taken.");
    return reply({ key_id: keyId, order_id: order.id, amount, currency: "INR", title: offer.title });
  } catch (error) { return reply({ error: error instanceof Error ? error.message : "Purchase failed" }, 500); }
});