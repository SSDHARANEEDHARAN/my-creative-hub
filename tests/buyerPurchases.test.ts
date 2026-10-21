import { expect, test } from "bun:test";
import { ownConfirmedPurchases } from "../src/lib/buyerPurchases";

test("buyer dashboard includes only the buyer's confirmed payments", () => {
  const rows = [
    { id: "own-paid", user_id: "buyer", status: "paid" },
    { id: "other-paid", user_id: "other", status: "paid" },
    { id: "pending", user_id: "buyer", status: "created" },
    { id: "refunded", user_id: "buyer", status: "refunded" },
  ];
  expect(ownConfirmedPurchases(rows, "buyer").map(row => row.id)).toEqual(["own-paid"]);
});