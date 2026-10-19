export function parseExplorationPrice(value: string): number | null {
  if (!value.trim()) return null;
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0 || Math.round(price * 100) !== price * 100) {
    throw new Error("Enter a non-negative INR price with at most two decimal places");
  }
  return price;
}