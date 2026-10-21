export function offerAmountPaise(price: number): number {
  const amount = Math.round(price * 100);
  if (!Number.isFinite(price) || price <= 0 || price > 1000000 || Math.abs(amount / 100 - price) > 0.000001) throw new Error("Invalid purchase price");
  return amount;
}
export function matchesPurchase(payment: { order_id: string; amount: number; currency: string; status: string }, orderId: string, amount: number) {
  return payment.order_id === orderId && payment.amount === amount && payment.currency === "INR" && payment.status === "captured";
}
export function canAccessOffer(purchase: { user_id: string; offer_id: string; status: string }, userId: string, offerId: string) {
  return purchase.user_id === userId && purchase.offer_id === offerId && purchase.status === "paid";
}