import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchDriveVideos, drivePreviewUrl, type DriveVideo } from "@/lib/siteOverrides";

const DriveVideoManager = () => {
  const [items, setItems] = useState<DriveVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", drive_url: "" });
  const [busy, setBusy] = useState(false);
  const load = () => fetchDriveVideos().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const preview = drivePreviewUrl(form.drive_url);

  const add = async () => {
    if (!form.title.trim() || !preview) return toast({ variant: "destructive", description: "Add a title and a valid Google Drive video link." });
    setBusy(true);
    const { error } = await supabase.from("gallery_drive_videos").insert({ title: form.title.trim(), description: form.description.trim() || null, drive_url: form.drive_url.trim(), sort_order: items.length });
    setBusy(false);
    if (error) return toast({ variant: "destructive", title: "Save failed", description: error.message });
    setForm({ title: "", description: "", drive_url: "" });
    toast({ description: "Video added to the Gallery." });
    load();
  };
  const update = async (v: DriveVideo, p: Partial<DriveVideo>) => {
    const { error } = await supabase.from("gallery_drive_videos").update(p).eq("id", v.id);
    if (error) return toast({ variant: "destructive", description: error.message });
    toast({ description: "Saved." });
    load();
  };
  const remove = async (v: DriveVideo) => {
    if (!confirm(`Delete "${v.title}"?`)) return;
    await supabase.from("gallery_drive_videos").delete().eq("id", v.id);
    load();
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold">Add gallery video from Google Drive</h2>
        <p className="text-sm text-muted-foreground">Paste a Drive share link. Set the file's sharing to "Anyone with the link" so visitors can play it.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 border-2 border-border p-3">
        <div className="space-y-2">
          <Input placeholder="https://drive.google.com/file/d/…/view" value={form.drive_url} onChange={(e) => setForm({ ...form, drive_url: e.target.value })} aria-label="Drive link" />
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} aria-label="Video title" />
          <Textarea rows={2} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button onClick={add} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}Add to Gallery</Button>
        </div>
        <div className="aspect-video bg-muted flex items-center justify-center text-sm text-muted-foreground">
          {preview ? <iframe src={preview} title="Preview" className="w-full h-full border-0" allow="autoplay; fullscreen" /> : form.drive_url ? "Not a valid Drive file link" : "Preview appears here"}
        </div>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v) => <Row key={v.id} v={v} onSave={update} onDelete={remove} />)}
        </div>
      )}
    </section>
  );
};

const Row = ({ v, onSave, onDelete }: { v: DriveVideo; onSave: (v: DriveVideo, p: Partial<DriveVideo>) => void; onDelete: (v: DriveVideo) => void }) => {
  const [t, setT] = useState(v.title);
  const [d, setD] = useState(v.description ?? "");
  const [o, setO] = useState(v.sort_order);
  const src = drivePreviewUrl(v.drive_url);
  return (
    <div className={`border-2 border-border p-3 space-y-2 ${v.hidden ? "opacity-50" : ""}`}>
      {src && <iframe src={src} title={v.title} className="w-full aspect-video border-0 bg-muted" />}
      <Input value={t} onChange={(e) => setT(e.target.value)} aria-label="Title" />
      <Textarea rows={2} value={d} onChange={(e) => setD(e.target.value)} aria-label="Description" />
      <div className="flex gap-2">
        <Input type="number" className="w-20" value={o} onChange={(e) => setO(Number(e.target.value))} aria-label="Order" />
        <Button size="sm" variant="outline" onClick={() => onSave(v, { hidden: !v.hidden })}>{v.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(v)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
        <Button size="sm" className="flex-1" onClick={() => onSave(v, { title: t, description: d || null, sort_order: o })}><Save className="h-4 w-4 mr-1" />Save</Button>
      </div>
    </div>
  );
};

export default DriveVideoManager;
