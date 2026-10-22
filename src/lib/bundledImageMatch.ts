// Compare against the complete original filename before removing a build hash.
// Vite hashes are eight characters and may include '-' or '_'.
export function matchBundledImage(stored: string, candidates: string[]): string | undefined {
  const filename = (url: string) => url.split(/[?#]/)[0].split("/").pop() || "";
  const saved = filename(stored);
  const exact = candidates.find(candidate => filename(candidate) === saved);
  if (exact) return exact;
  if (!stored.startsWith("/assets/") && !stored.startsWith("/src/assets/")) return undefined;
  return candidates.find(candidate => {
    const original = filename(candidate);
    const dot = original.lastIndexOf(".");
    if (dot < 0) return false;
    const stem = original.slice(0, dot), extension = original.slice(dot);
    if (!saved.startsWith(`${stem}-`) || !saved.endsWith(extension)) return false;
    const hash = saved.slice(stem.length + 1, -extension.length);
    return /^[A-Za-z0-9_-]{8}$/.test(hash);
  });
}