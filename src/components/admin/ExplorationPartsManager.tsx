import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Download, Loader2, Trash2, Upload } from "lucide-react";

export default function ExplorationPartsManager({ explorationId }: { explorationId: string }) {
  const [parts, setParts] = useState<Tables<"exploration_parts">[]>([]);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const { data, error } = await supabase.from("exploration_parts").select("*").eq("exploration_id", explorationId).order("created_at");
    if (error) toast({ title: "Could not load part files", description: error.message, variant: "destructive" });
    else setParts(data || []);
  };
  useEffect(() => { setParts([]); void load(); }, [explorationId]);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 50 * 1024 * 1024) throw new Error(`${file.name} exceeds 50 MB`);
        const path = `${explorationId}/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const result = await supabase.storage.from("exploration-parts").upload(path, file);
        if (result.error) throw result.error;
        const { error } = await supabase.from("exploration_parts").insert({ exploration_id: explorationId, file_name: file.name, storage_path: path, size_bytes: file.size });
        if (error) { await supabase.storage.from("exploration-parts").remove([path]); throw error; }
      }
      toast({ title: "Private part files added" });
    } catch (error) { toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again", variant: "destructive" }); }
    finally { setBusy(false); await load(); }
  };
  const update = async (part: Tables<"exploration_parts">, changes: { description?: string; enabled?: boolean }) => {
    const { error } = await supabase.from("exploration_parts").update(changes).eq("id", part.id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "File settings saved" }); await load(); }
  };
  const remove = async (part: Tables<"exploration_parts">) => {
    if (!confirm(`Permanently remove ${part.file_name}?`)) return;
    setBusy(true);
    const { error } = await supabase.storage.from("exploration-parts").remove([part.storage_path]);
    const result = error ? { error } : await supabase.from("exploration_parts").delete().eq("id", part.id);
    if (result.error) toast({ title: "Removal failed", description: result.error.message, variant: "destructive" });
    await load(); setBusy(false);
  };
  const preview = async (part: Tables<"exploration_parts">) => {
    const { data, error } = await supabase.storage.from("exploration-parts").createSignedUrl(part.storage_path, 60, { download: part.file_name });
    if (error) toast({ title: "Preview failed", description: error.message, variant: "destructive" });
    else if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };
  return <section className="space-y-3 border-y border-border py-4">
    <h4 className="font-semibold">Purchased part files</h4>
    <p className="text-sm text-muted-foreground">Private files · Buyer downloads locked until payment setup is complete</p>
    <label className="flex w-fit items-center gap-2 border border-border px-3 py-2 cursor-pointer">
      {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Add part files
      <input aria-label="Add exploration part files" type="file" multiple disabled={busy} className="hidden" onChange={e => { void upload(e.target.files); e.target.value = ""; }} />
    </label>
    {parts.map(part => <div key={part.id} className="space-y-2 border-b border-border pb-3">
      <p className="text-sm font-medium break-all">{part.file_name} <span className="text-muted-foreground">({(part.size_bytes / 1024).toFixed(1)} KB)</span></p>
      <Input aria-label={`Description for ${part.file_name}`} value={part.description} onChange={e => setParts(list => list.map(p => p.id === part.id ? { ...p, description: e.target.value } : p))} />
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" disabled={busy} onClick={() => update(part, { description: part.description })}>Save description</Button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={part.enabled} disabled={busy} onChange={e => update(part, { enabled: e.target.checked })} /> Include with purchase</label>
        <Button size="icon" variant="outline" aria-label={`Preview ${part.file_name}`} disabled={busy} onClick={() => preview(part)}><Download size={16} /></Button>
        <Button size="icon" variant="outline" aria-label={`Remove ${part.file_name}`} disabled={busy} onClick={() => remove(part)}><Trash2 size={16} /></Button>
      </div>
    </div>)}
  </section>;
}