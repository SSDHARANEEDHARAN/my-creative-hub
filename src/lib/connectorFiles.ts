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
  description: string | null;
  tags: string[];
  blocked_until: string | null;
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
  return ((data ?? []) as ConnectorFileRow[]).filter((r) => !isBlocked(r));
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
  patch: Partial<Pick<ConnectorFileRow, "enabled" | "downloadable" | "file_name" | "group_description" | "sort_order" | "description" | "tags" | "blocked_until">>
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

export const isBlocked = (row: Pick<ConnectorFileRow, "blocked_until">) =>
  !!row.blocked_until && new Date(row.blocked_until).getTime() > Date.now();

export interface ConnectorDownloadRow {
  id: string;
  file_id: string | null;
  file_name: string;
  group_name: string;
  user_email: string | null;
  user_name: string | null;
  created_at: string;
}

/** Per-user admin limits: returns an error message when the signed-in user may not download. */
export async function checkDownloadAllowed(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return null;
  const { data: prof } = await db
    .from("profiles")
    .select("can_download, daily_download_limit, access_expires_at")
    .eq("user_id", u.id)
    .maybeSingle();
  if (!prof) return null;
  if (prof.access_expires_at && new Date(prof.access_expires_at) < new Date())
    return "Your access period has ended. Contact the administrator.";
  if (prof.can_download === false) return "Downloads are turned off for your account.";
  if (prof.daily_download_limit != null) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await db
      .from("connector_file_downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", u.id)
      .gte("created_at", since);
    if ((count ?? 0) >= prof.daily_download_limit)
      return `Daily download limit reached (${prof.daily_download_limit} per 24 hours).`;
  }
  return null;
}

export async function logConnectorDownload(fileId: string | null, fileName: string, groupName: string) {
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  await db.from("connector_file_downloads").insert({
    file_id: fileId,
    file_name: fileName,
    group_name: groupName,
    user_id: u?.id ?? null,
    user_email: u?.email ?? null,
    user_name: (u?.user_metadata?.display_name as string | undefined) ?? null,
  });
}

export async function fetchConnectorDownloads(): Promise<ConnectorDownloadRow[]> {
  const { data, error } = await db
    .from("connector_file_downloads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as ConnectorDownloadRow[];
}

export async function generateConnectorMetadata(input: {
  fileName: string;
  folder: string;
  extension: string;
  details: string;
}): Promise<{ description: string; tags: string[] }> {
  const { data, error } = await supabase.functions.invoke("describe-connector-file", { body: input });
  if (error) {
    let msg = error.message;
    try {
      const body = await (error as { context?: Response }).context?.json();
      if (body?.error) msg = typeof body.error === "string" ? body.error : JSON.stringify(body.error);
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}
