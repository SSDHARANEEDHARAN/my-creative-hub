export const PAYMENT_TEST_AMOUNT_PAISE = 500;
export function isMatchingPayment(payment: { order_id: string; amount: number; currency: string; status: string }, orderId: string) {
  return payment.order_id === orderId && payment.amount === PAYMENT_TEST_AMOUNT_PAISE && payment.currency === "INR" && payment.status === "captured";
}