export function hasPurchaseAccess(
  profile: { purchase_access?: boolean | null } | null,
  isAdmin: boolean,
): boolean {
  return isAdmin || profile?.purchase_access === true;
}
