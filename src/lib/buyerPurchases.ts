export const CARTIZION_ID = "021741c0-d1c7-48a8-b1f4-925745699652";

export function ownConfirmedPurchases<T extends { user_id: string; status: string }>(rows: T[], userId: string): T[] {
  return rows.filter(row => row.user_id === userId && row.status === "paid");
}