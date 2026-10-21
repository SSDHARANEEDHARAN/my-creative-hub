import { test, expect } from "bun:test";
import { offerAmountPaise, matchesPurchase, canAccessOffer } from "../supabase/functions/exploration-checkout/rules";
for (const [price, paise] of [[89000,8900000],[12500,1250000],[29000,2900000],[10000,1000000],[7000,700000]]) {
  test(`server order for ₹${price}`, () => expect(offerAmountPaise(price)).toBe(paise));
}
test("invalid price rejected", () => { expect(() => offerAmountPaise(0)).toThrow(); expect(() => offerAmountPaise(NaN)).toThrow(); expect(() => offerAmountPaise(0.001)).toThrow(); });
const payment = { order_id: "order_1", amount: 1000000, currency: "INR", status: "captured" };
test("captured order and exact amount match", () => expect(matchesPurchase(payment,"order_1",1000000)).toBe(true));
test("₹5 trial does not satisfy design purchase", () => expect(matchesPurchase({ ...payment, amount:500 },"order_1",1000000)).toBe(false));
test("wrong order rejected", () => expect(matchesPurchase(payment,"order_2",1000000)).toBe(false));
test("uncaptured rejected", () => expect(matchesPurchase({ ...payment,status:"authorized" },"order_1",1000000)).toBe(false));
test("wrong currency rejected", () => expect(matchesPurchase({ ...payment,currency:"USD" },"order_1",1000000)).toBe(false));
test("only buyer and purchased offer unlock files", () => {
  const p = { user_id:"buyer",offer_id:"design",status:"paid" };
  expect(canAccessOffer(p,"buyer","design")).toBe(true);
  expect(canAccessOffer(p,"other","design")).toBe(false);
  expect(canAccessOffer(p,"buyer","configuration")).toBe(false);
  expect(canAccessOffer({ ...p,status:"created" },"buyer","design")).toBe(false);
});