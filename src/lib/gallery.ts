import { supabase } from "@/integrations/supabase/client";
import { BUNDLED_MEDIA } from "./galleryMedia";

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_path: string;
  media_type: "image" | "video";
  enabled: boolean;
  sort_order: number;
  created_at: string;
}

const BUCKET = "gallery";
const VIDEO_EXTS = ["mp4", "webm", "mov"];

// The generated Supabase types don't yet include gallery_items; cast for these calls.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export const galleryPublicUrl = (path: string) =>
  supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

export async function fetchPublicGallery(): Promise<GalleryItem[]> {
  const { data, error } = await db
    .from("gallery_items")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GalleryItem[];
}

export async function fetchAllGallery(): Promise<GalleryItem[]> {
  const { data, error } = await db
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GalleryItem[];
}

export async function addGalleryItem(
  file: File,
  title: string,
  description: string,
  sortOrder = 0
): Promise<void> {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const isVideo = VIDEO_EXTS.includes(ext);
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw upErr;

  const { data: userData } = await supabase.auth.getUser();
  const { error: insErr } = await db.from("gallery_items").insert({
    title: title.trim(),
    description: description.trim() || null,
    media_path: path,
    media_type: isVideo ? "video" : "image",
    sort_order: sortOrder,
    created_by: userData.user?.id ?? null,
  });
  if (insErr) {
    // Roll back the orphaned upload if the row insert fails
    await supabase.storage.from(BUCKET).remove([path]);
    throw insErr;
  }
}

export async function updateGalleryItem(
  id: string,
  patch: Partial<Pick<GalleryItem, "title" | "description" | "enabled" | "sort_order">>
): Promise<void> {
  const { error } = await db.from("gallery_items").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryItem(item: GalleryItem): Promise<void> {
  await supabase.storage.from(BUCKET).remove([item.media_path]);
  const { error } = await db.from("gallery_items").delete().eq("id", item.id);
  if (error) throw error;
}

/**
 * One-time import of the bundled gallery media (the files committed in the repo)
 * into Supabase storage + the gallery_items table, so they become editable in the
 * admin manager. Returns the number of items imported.
 */
export async function importBundledGallery(): Promise<number> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;
  let added = 0;

  for (let i = 0; i < BUNDLED_MEDIA.length; i++) {
    const m = BUNDLED_MEDIA[i];
    const blob = await (await fetch(m.src)).blob();
    const path = `${crypto.randomUUID()}.${m.ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: blob.type || undefined });
    if (upErr) throw upErr;

    const { error: insErr } = await db.from("gallery_items").insert({
      title: m.title,
      description: m.description ?? null,
      media_path: path,
      media_type: m.type,
      sort_order: i,
      created_by: userId,
    });
    if (insErr) {
      await supabase.storage.from(BUCKET).remove([path]);
      throw insErr;
    }
    added++;
  }
  return added;
}
