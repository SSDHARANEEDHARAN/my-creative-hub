import { useEffect, useState } from "react";
import { Loader2, Save, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { BUNDLED_MEDIA } from "@/lib/galleryMedia";
import { connectors } from "@/components/ConnectorSkills";
import {
  fetchGalleryOverrides,
  saveGalleryOverride,
  fetchToolchainOverrides,
  saveToolchainOverride,
  uploadLogo,
  type GalleryOverride,
  type ToolchainOverride,
} from "@/lib/siteOverrides";

export const GalleryEditor = () => {
  const [ov, setOv] = useState<Record<string, GalleryOverride>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryOverrides().then(setOv).finally(() => setLoading(false));
  }, []);

  const get = (base: string, i: number): GalleryOverride =>
    ov[base] ?? { base, title: null, description: null, hidden: false, sort_order: i };
  const patch = (base: string, i: number, p: Partial<GalleryOverride>) =>
    setOv((o) => ({ ...o, [base]: { ...get(base, i), ...p } }));
  const save = async (o: GalleryOverride) => {
    setSaving(o.base);
    const err = await saveGalleryOverride(o);
    setSaving(null);
    toast(err ? { title: "Save failed", description: err.message, variant: "destructive" } : { description: "Gallery updated." });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold">Gallery photos &amp; videos</h2>
        <p className="text-sm text-muted-foreground">Edit the title and description, change the order, or hide items. Changes appear on the Gallery page.</p>
      </div>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLED_MEDIA.map((m, i) => {
            const o = get(m.base, i);
            return (
              <div key={m.base} className={`border-2 border-border p-3 space-y-2 ${o.hidden ? "opacity-50" : ""}`}>
                {m.type === "video" ? (
                  <video src={m.src} className="w-full aspect-video object-cover bg-muted" muted preload="metadata" />
                ) : (
                  <img src={m.src} alt={m.title} loading="lazy" className="w-full aspect-video object-cover bg-muted" />
                )}
                <Input placeholder={m.title} value={o.title ?? ""} onChange={(e) => patch(m.base, i, { title: e.target.value || null })} aria-label="Title" />
                <Textarea rows={2} placeholder={m.description ?? "Description"} value={o.description ?? ""} onChange={(e) => patch(m.base, i, { description: e.target.value || null })} aria-label="Description" />
                <div className="flex gap-2 items-center">
                  <Input type="number" className="w-20" aria-label="Order" value={o.sort_order ?? i} onChange={(e) => patch(m.base, i, { sort_order: Number(e.target.value) })} />
                  <Button size="sm" variant="outline" onClick={() => patch(m.base, i, { hidden: !o.hidden })} aria-label={o.hidden ? "Show" : "Hide"}>
                    {o.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => save(get(m.base, i))} disabled={saving === m.base}>
                    {saving === m.base ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export const ToolchainEditor = () => {
  const [ov, setOv] = useState<Record<string, ToolchainOverride>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchToolchainOverrides().then(setOv).finally(() => setLoading(false));
  }, []);

  const get = (name: string): ToolchainOverride => ov[name] ?? { name, logo_url: null, description: null, url: null, hidden: false };
  const patch = (name: string, p: Partial<ToolchainOverride>) => setOv((o) => ({ ...o, [name]: { ...get(name), ...p } }));
  const save = async (o: ToolchainOverride) => {
    setBusy(o.name);
    const err = await saveToolchainOverride(o);
    setBusy(null);
    toast(err ? { title: "Save failed", description: err.message, variant: "destructive" } : { description: `${o.name} updated.` });
  };
  const upload = async (name: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ description: "Please choose an image.", variant: "destructive" });
    setBusy(name);
    try {
      const url = await uploadLogo(file);
      patch(name, { logo_url: url });
      toast({ description: "Logo uploaded — press Save to apply." });
    } catch (e) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    }
    setBusy(null);
  };

  const list = connectors.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold">Toolchain logos</h2>
        <p className="text-sm text-muted-foreground">Upload or paste a logo, change the text or link, or hide a tile.</p>
      </div>
      <Input placeholder="Search tools…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:max-w-xs" />
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className="border-2 border-border divide-y-2 divide-border">
          {list.map((c) => {
            const o = get(c.name);
            return (
              <div key={c.name} className={`p-3 grid gap-2 md:grid-cols-[3rem_10rem_1fr_auto] md:items-center ${o.hidden ? "opacity-50" : ""}`}>
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center bg-background">
                  {o.logo_url ? <img src={o.logo_url} alt={`${c.name} logo`} className="w-7 h-7 object-contain" /> : <span className="text-[10px] text-muted-foreground">auto</span>}
                </div>
                <div className="font-medium text-sm">{c.name}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Logo URL (empty = automatic)" value={o.logo_url ?? ""} onChange={(e) => patch(c.name, { logo_url: e.target.value || null })} />
                  <Input placeholder={c.url} value={o.url ?? ""} onChange={(e) => patch(c.name, { url: e.target.value || null })} />
                  <Input className="sm:col-span-2" placeholder={c.description} value={o.description ?? ""} onChange={(e) => patch(c.name, { description: e.target.value || null })} />
                </div>
                <div className="flex gap-2">
                  <label className="inline-flex items-center justify-center h-9 px-3 border-2 border-border cursor-pointer hover:bg-secondary" aria-label="Upload logo">
                    <Upload className="h-4 w-4" />
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => { upload(c.name, e.target.files?.[0]); e.target.value = ""; }} />
                  </label>
                  <Button size="sm" variant="outline" onClick={() => patch(c.name, { hidden: !o.hidden })} aria-label={o.hidden ? "Show" : "Hide"}>
                    {o.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" onClick={() => save(get(c.name))} disabled={busy === c.name}>
                    {busy === c.name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
