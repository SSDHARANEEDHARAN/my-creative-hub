import { describe, expect, test } from "bun:test";
import { PAYMENT_TEST_AMOUNT_PAISE, isMatchingPayment } from "../supabase/functions/razorpay-checkout/rules";
describe("₹5 checkout", () => {
  test("charges exactly 500 paise", () => { expect(PAYMENT_TEST_AMOUNT_PAISE).toBe(500); });
  const captured = { order_id: "order_example", amount: 500, currency: "INR", status: "captured" };
  test("accepts the captured matching order", () => { expect(isMatchingPayment(captured, "order_example")).toBe(true); });
  test("rejects another order", () => { expect(isMatchingPayment(captured, "order_other")).toBe(false); });
  test("rejects an uncaptured payment", () => { expect(isMatchingPayment({ ...captured, status: "authorized" }, "order_example")).toBe(false); });
  test("rejects a different amount", () => { expect(isMatchingPayment({ ...captured, amount: 100 }, "order_example")).toBe(false); });
  test("rejects another currency", () => { expect(isMatchingPayment({ ...captured, currency: "USD" }, "order_example")).toBe(false); });
});