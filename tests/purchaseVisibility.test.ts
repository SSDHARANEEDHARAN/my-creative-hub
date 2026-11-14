import { expect, test } from "bun:test";
import { canShowPurchaseUi } from "../src/lib/purchaseVisibility";

test("payment UI is visible only with the explicit per-user grant", () => {
  expect(canShowPurchaseUi(true)).toBe(true);
  expect(canShowPurchaseUi(false)).toBe(false);
});

test("admin content previews can show payment UI without changing public access", () => {
  expect(canShowPurchaseUi(false, true)).toBe(true);
});
