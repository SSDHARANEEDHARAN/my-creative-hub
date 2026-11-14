import { expect, test } from "bun:test";
import { hasPurchaseAccess } from "../supabase/functions/_shared/purchaseAccess";

test("only an admin-enabled profile receives purchase access", () => {
  expect(hasPurchaseAccess({ purchase_access: true }, false)).toBe(true);
  expect(hasPurchaseAccess({ purchase_access: false }, false)).toBe(false);
  expect(hasPurchaseAccess(null, false)).toBe(false);
});

test("admins can always manage and preview purchases", () => {
  expect(hasPurchaseAccess({ purchase_access: false }, true)).toBe(true);
  expect(hasPurchaseAccess(null, true)).toBe(true);
});

test("industrial approval alone never reveals payment or purchase options", () => {
  expect(hasPurchaseAccess({ purchase_access: false, industrial_access: true }, false)).toBe(false);
  expect(hasPurchaseAccess({ purchase_access: true, industrial_access: true }, false)).toBe(true);
});
