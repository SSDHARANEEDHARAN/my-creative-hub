import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAllProjects, Project } from "@/data/projectsData";
import { blogPosts, BlogPost } from "@/data/blogPostsData";

export type ContentKind = "project" | "blog";

// Snapshot of the original static data so overrides can be reset.
const originals = new Map<string, any>();
const key = (k: ContentKind, id: string | number) => `${k}:${id}`;
getAllProjects().forEach((p) => originals.set(key("project", p.id), JSON.parse(JSON.stringify(p))));
blogPosts.forEach((b) => originals.set(key("blog", b.id), JSON.parse(JSON.stringify(b))));

let version = 0;
const listeners = new Set<() => void>();
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

const targetFor = (kind: ContentKind, id: string): any =>
  kind === "project"
    ? getAllProjects().find((p) => String(p.id) === id)
    : blogPosts.find((b) => b.id === id);

const EDITABLE: Record<ContentKind, string[]> = {
  project: ["title", "description", "images", "tags", "articleUrl", "githubUrl", "liveUrl", "videoUrl", "featured"],
  blog: ["title", "excerpt", "content", "image", "date", "readTime", "category"],
};

const applyRow = (kind: ContentKind, id: string, data: Record<string, any> | null) => {
  const target = targetFor(kind, id);
  if (!target) return;
  const orig = originals.get(key(kind, id));
  for (const f of EDITABLE[kind]) {
    if (data && f in data && data[f] !== undefined && data[f] !== null) target[f] = data[f];
    else if (orig) target[f] = orig[f];
  }
};

export const loadContentOverrides = async () => {
  try {
    const { data } = await supabase.from("content_overrides").select("kind,item_id,data");
    (data || []).forEach((r: any) => applyRow(r.kind, r.item_id, r.data));
    emit();
  } catch (e) {
    console.error("Failed to load content overrides", e);
  }
};

let subscribed = false;
export const subscribeContentOverrides = () => {
  if (subscribed) return;
  subscribed = true;
  supabase
    .channel("content-overrides")
    .on("postgres_changes", { event: "*", schema: "public", table: "content_overrides" }, (payload: any) => {
      const row = payload.new && payload.new.item_id ? payload.new : payload.old;
      if (!row?.item_id) return;
      applyRow(row.kind, row.item_id, payload.eventType === "DELETE" ? null : payload.new.data);
      emit();
    })
    .subscribe();
};

export const useContentVersion = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => version,
  );

export const pickEditable = (kind: ContentKind, item: any) => {
  const out: Record<string, any> = {};
  EDITABLE[kind].forEach((f) => (out[f] = item[f] ?? null));
  return out;
};

export const saveContentOverride = async (kind: ContentKind, id: string, data: Record<string, any>) => {
  const { data: u } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("content_overrides")
    .upsert({ kind, item_id: id, data, updated_by: u.user?.id ?? null }, { onConflict: "kind,item_id" });
  if (!error) {
    applyRow(kind, id, data);
    emit();
  }
  return error;
};

export const resetContentOverride = async (kind: ContentKind, id: string) => {
  const { error } = await supabase.from("content_overrides").delete().eq("kind", kind).eq("item_id", id);
  if (!error) {
    applyRow(kind, id, null);
    emit();
  }
  return error;
};

/** Copy every original project + blog post 1:1 into the backend (keeps existing edits). */
export const syncAllOriginals = async () => {
  const { data: existing } = await supabase.from("content_overrides").select("kind,item_id");
  const have = new Set((existing || []).map((r: any) => key(r.kind, r.item_id)));
  const { data: u } = await supabase.auth.getUser();
  const rows: any[] = [];
  getAllProjects().forEach((p) => {
    if (!have.has(key("project", p.id)))
      rows.push({ kind: "project", item_id: String(p.id), data: pickEditable("project", p), updated_by: u.user?.id ?? null });
  });
  blogPosts.forEach((b) => {
    if (!have.has(key("blog", b.id)))
      rows.push({ kind: "blog", item_id: b.id, data: pickEditable("blog", b), updated_by: u.user?.id ?? null });
  });
  if (rows.length === 0) return { error: null, added: 0 };
  const { error } = await supabase.from("content_overrides").insert(rows);
  return { error, added: rows.length };
};

export type { Project, BlogPost };
