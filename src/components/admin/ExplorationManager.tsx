import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ExplorationCard from "@/components/ExplorationCard";
import ExplorationDetails from "@/components/ExplorationDetails";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Eye, EyeOff, Loader2 } from "lucide-react";

interface Exploration {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[] | null;
  contact_note: string | null;
  is_visible: boolean;
  sort_order: number;
  images: string[] | null;
  created_at: string;
  technical_content: string;
  product_price_inr: number | null;
  paid_parts: boolean;
}

const empty = {
  technical_content: "",
  product_price_inr: "",
  paid_parts: false,
  title: "",
  description: "",
  status: "exploring",
  tags: "",
  contact_note: "",
  sort_order: 0,
  is_visible: true,
  images: [] as string[],
};

const ExplorationManager = () => {
  const [items, setItems] = useState<Exploration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [uploading, setUploading] = useState(false);
  const previewItem = {
    ...form,
    product_price_inr: form.product_price_inr ? Number(form.product_price_inr) : null,
    id: editingId || "preview",
    title: form.title.trim() || "Untitled exploration",
    description: form.description.trim(),
    status: form.status.trim() || "exploring",
    tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    contact_note: form.contact_note.trim() || null,
  };

  const uploadPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `explorations/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); continue; }
      urls.push(supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  };

  const load = async () => {
    const { data, error } = await supabase
      .from("explorations")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load explorations", description: error.message, variant: "destructive" });
    setItems((data as unknown as Exploration[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-explorations")
      .on("postgres_changes", { event: "*", schema: "public", table: "explorations" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const reset = () => { setForm({ ...empty }); setEditingId(null); };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Title and description are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status.trim() || "exploring",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      contact_note: form.contact_note.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
      images: form.images,
      technical_content: form.technical_content,
      paid_parts: form.paid_parts,
      product_price_inr: form.product_price_inr ? Number(form.product_price_inr) : null,
    };
    const { error } = editingId
      ? await supabase.from("explorations").update(payload).eq("id", editingId)
      : await supabase.from("explorations").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingId ? "Exploration updated" : "Exploration added" });
    reset();
    load();
  };

  const remove = async (item: Exploration) => {
    if (!confirm(`Delete "${item.title}"? This removes it from the blog page permanently.`)) return;
    const { error } = await supabase.from("explorations").delete().eq("id", item.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  const toggleVisible = async (item: Exploration) => {
    const { error } = await supabase.from("explorations").update({ is_visible: !item.is_visible }).eq("id", item.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  const edit = (item: Exploration) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      status: item.status,
      tags: (item.tags || []).join(", "),
      contact_note: item.contact_note || "",
      sort_order: item.sort_order,
      is_visible: item.is_visible,
      images: item.images || [],
      technical_content: item.technical_content || "",
      paid_parts: item.paid_parts || false,
      product_price_inr: item.product_price_inr != null ? String(item.product_price_inr) : "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <div className="min-w-0 space-y-3">
        <h3 className="font-semibold">{editingId ? "Edit exploration" : "Add new exploration"}</h3>
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Textarea rows={4} placeholder="What are you exploring right now?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Status (e.g. exploring)" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <Input placeholder="Contact note on detail page" value={form.contact_note} onChange={(e) => setForm({ ...form, contact_note: e.target.value })} />
        <label className="block text-sm font-medium">Specifications, dimensions & BOM</label>
        <Textarea aria-label="Specifications, dimensions and BOM" rows={12} placeholder="Full technical content (Markdown)" value={form.technical_content} onChange={e => setForm({ ...form, technical_content: e.target.value })} />
        <Input aria-label="Complete bot price in INR" type="number" min="0" placeholder="Complete bot price (INR)" value={form.product_price_inr} onChange={e => setForm({ ...form, product_price_inr: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.paid_parts} onChange={e => setForm({ ...form, paid_parts: e.target.checked })} /> Part files require payment</label>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer border border-border px-3 py-2 hover:bg-muted">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add photos
            <input type="file" aria-label="Add exploration photos" accept="image/*" multiple disabled={uploading || saving} className="hidden" onChange={(e) => { uploadPhotos(e.target.files); e.target.value = ""; }} />
          </label>
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {form.images.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="w-full aspect-square object-cover border border-border" />
                  <Button type="button" size="icon" variant="ghost" aria-label="Remove photo" disabled={saving || uploading} className="absolute top-1 right-1 bg-background/90 h-8 w-8" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }))}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
          Visible on the blog page
        </label>
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving || uploading}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Update" : "Add"}
          </Button>
          {editingId && <Button variant="outline" onClick={reset}>Cancel</Button>}
        </div>
      </div>
      <aside aria-label="Exploration card preview" className="min-w-0 self-start xl:sticky xl:top-24">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Eye className="w-4 h-4" /> Live preview</h3>
          <Badge variant={form.is_visible ? "outline" : "secondary"}>{form.is_visible ? "Visible after save" : "Hidden"}</Badge>
        </div>
        <ExplorationCard item={previewItem} preview />
        <details className="mt-4 border-t border-border pt-4"><summary className="cursor-pointer font-medium">Full detail preview</summary><div className="mt-4"><ExplorationDetails item={previewItem} preview /></div></details>
      </aside>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No explorations yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-border p-4 bg-card flex flex-col sm:flex-row sm:items-start gap-3">
              {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full sm:w-24 h-32 sm:h-24 object-cover border border-border" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium">{item.title}</span>
                  <Badge variant="outline">{item.status}</Badge>
                  {!item.is_visible && <Badge variant="secondary">Hidden</Badge>}
                  <span className="text-xs text-muted-foreground">#{item.sort_order}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 border border-border">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" aria-label={item.is_visible ? `Hide ${item.title}` : `Show ${item.title}`} onClick={() => toggleVisible(item)}>
                  {item.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" aria-label={`Edit ${item.title}`} onClick={() => edit(item)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="text-destructive" aria-label={`Delete ${item.title}`} onClick={() => remove(item)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorationManager;
