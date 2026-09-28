import { supabase } from "@/integrations/supabase/client";

export interface ConnectorFileRow {
  id: string;
  group_name: string;
  group_description: string | null;
  group_link: string | null;
  file_name: string;
  storage_path: string;
  extension: string;
  size_bytes: number;
  kind: "file" | "video";
  enabled: boolean;
  downloadable: boolean;
  sort_order: number;
  created_at: string;
}

export const CONNECTOR_BUCKET = "connector-files";

// The generated Supabase types don't include connector_files yet; cast for these calls.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function fetchVisibleConnectorFiles(): Promise<ConnectorFileRow[]> {
  const { data, error } = await db
    .from("connector_files")
    .select("*")
    .eq("enabled", true)
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ConnectorFileRow[];
}

export async function fetchAllConnectorFiles(): Promise<ConnectorFileRow[]> {
  const { data, error } = await db
    .from("connector_files")
    .select("*")
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ConnectorFileRow[];
}

export async function signedConnectorUrl(path: string, download?: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(CONNECTOR_BUCKET)
    .createSignedUrl(path, 60 * 60, download ? { download } : undefined);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export async function updateConnectorFile(
  id: string,
  patch: Partial<Pick<ConnectorFileRow, "enabled" | "downloadable" | "file_name" | "group_description" | "sort_order">>
): Promise<void> {
  const { error } = await db.from("connector_files").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteConnectorFile(row: ConnectorFileRow): Promise<void> {
  await supabase.storage.from(CONNECTOR_BUCKET).remove([row.storage_path]);
  const { error } = await db.from("connector_files").delete().eq("id", row.id);
  if (error) throw error;
}

export async function addConnectorFile(
  file: File,
  groupName: string,
  groupDescription: string,
  sortOrder = 0
): Promise<void> {
  const ext = (file.name.split(".").pop() ?? "bin").toUpperCase();
  const folder = groupName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;

  const { error: upErr } = await supabase.storage
    .from(CONNECTOR_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw upErr;

  const { data: userData } = await supabase.auth.getUser();
  const { error: insErr } = await db.from("connector_files").insert({
    group_name: groupName.trim(),
    group_description: groupDescription.trim() || null,
    file_name: file.name,
    storage_path: path,
    extension: ext,
    size_bytes: file.size,
    kind: ["MP4", "WEBM", "MOV"].includes(ext) ? "video" : "file",
    sort_order: sortOrder,
    created_by: userData.user?.id ?? null,
  });
  if (insErr) {
    await supabase.storage.from(CONNECTOR_BUCKET).remove([path]);
    throw insErr;
  }
}

export const formatBytes = (bytes: number) => {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};
