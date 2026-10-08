import { supabase } from "@/integrations/supabase/client";

export type GalleryOverride = { base: string; title: string | null; description: string | null; hidden: boolean; sort_order: number | null };
export type ToolchainOverride = { name: string; logo_url: string | null; description: string | null; url: string | null; hidden: boolean };

export async function fetchGalleryOverrides(): Promise<Record<string, GalleryOverride>> {
  const { data } = await supabase.from("gallery_overrides").select("base, title, description, hidden, sort_order");
  return Object.fromEntries((data ?? []).map((r) => [r.base, r as GalleryOverride]));
}

export async function saveGalleryOverride(o: GalleryOverride) {
  const { error } = await supabase.from("gallery_overrides").upsert({ ...o, updated_at: new Date().toISOString() });
  return error;
}

export async function fetchToolchainOverrides(): Promise<Record<string, ToolchainOverride>> {
  const { data } = await supabase.from("toolchain_overrides").select("name, logo_url, description, url, hidden");
  return Object.fromEntries((data ?? []).map((r) => [r.name, r as ToolchainOverride]));
}

export async function saveToolchainOverride(o: ToolchainOverride) {
  const { error } = await supabase.from("toolchain_overrides").upsert({ ...o, updated_at: new Date().toISOString() });
  return error;
}

/** Uploads a logo image to the public content bucket and returns its URL. */
export async function uploadLogo(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
  const path = `toolchain-logos/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("content").upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  return supabase.storage.from("content").getPublicUrl(path).data.publicUrl;
}
