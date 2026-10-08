import { useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Eye, Heart, MessageCircle, BookOpen, RefreshCw, Save, RotateCcw, ExternalLink, Database, Monitor, Tablet, Smartphone, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { getAllProjects } from "@/data/projectsData";
import { blogPosts } from "@/data/blogPostsData";
import { useProjectListCounts } from "@/hooks/useProjectData";
import { useBlogListCounts } from "@/hooks/useBlogData";
import {
  ContentKind,
  pickEditable,
  resetContentOverride,
  saveContentOverride,
  syncAllOriginals,
  useContentVersion,
} from "@/lib/contentOverrides";

type Item = { kind: ContentKind; id: string; title: string; sub: string; image?: string; url: string; raw: any };

const LIST_FIELDS = ["images", "tags"];

const AdminContentPage = () => {
  const version = useContentVersion();
  const [tab, setTab] = useState<"all" | "project" | "blog">("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [draft, setDraft] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<{ titles: string[]; description: string; missing: string[] } | null>(null);

  const projects = getAllProjects();
  const projectIds = useMemo(() => projects.map((p) => String(p.id)), [projects.length]);
  const blogIds = useMemo(() => blogPosts.map((b) => b.id), []);
  const pc = useProjectListCounts(projectIds);
  const bc = useBlogListCounts(blogIds, null);

  const items: Item[] = useMemo(() => {
    const p: Item[] = projects.map((x) => ({
      kind: "project",
      id: String(x.id),
      title: x.title,
      sub: `Project · ${x.category}`,
      image: x.images?.[0],
      url: x.articleUrl || (x.category === "industrial" ? "/industrial-projects" : "/projects"),
      raw: x,
    }));
    const b: Item[] = blogPosts.map((x) => ({
      kind: "blog",
      id: x.id,
      title: x.title,
      sub: `Blog · ${x.category}`,
      image: x.image,
      url: `/blog/${x.id}`,
      raw: x,
    }));
    return [...p, ...b];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const counts = (it: Item) =>
    it.kind === "project"
      ? { views: pc.viewCounts[it.id] || 0, likes: pc.likeCounts[it.id] || 0, comments: pc.commentCounts[it.id] || 0, reads: pc.readCounts[it.id] || 0 }
      : { views: bc.viewCounts[it.id] || 0, likes: bc.likeCounts[it.id] || 0, comments: bc.commentCounts[it.id] || 0, reads: null };

  const filtered = items.filter(
    (i) => (tab === "all" || i.kind === tab) && i.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totals = filtered.reduce(
    (a, i) => {
      const c = counts(i);
      return { views: a.views + c.views, likes: a.likes + c.likes, comments: a.comments + c.comments };
    },
    { views: 0, likes: 0, comments: 0 },
  );

  const open = (it: Item) => {
    const data = pickEditable(it.kind, it.raw);
    LIST_FIELDS.forEach((f) => {
      if (Array.isArray(data[f])) data[f] = data[f].join(f === "images" ? "\n" : ", ");
    });
    setForm(data);
    setEditing(it);
  };

  const buildPayload = () => {
    const out = { ...form };
    if (typeof out.images === "string") out.images = out.images.split("\n").map((s: string) => s.trim()).filter(Boolean);
    if (typeof out.tags === "string") out.tags = out.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
    Object.keys(out).forEach((k) => out[k] === "" && (out[k] = null));
    return out;
  };

  const suggest = async () => {
    if (!editing) return;
    setSuggesting(true);
    setSuggestions(null);
    const { data, error } = await supabase.functions.invoke("suggest-content", {
      body: {
        kind: editing.kind,
        title: String(form.title ?? ""),
        description: String((editing.kind === "project" ? form.description : form.excerpt) ?? ""),
        draft: draft || String(form.content ?? "").slice(0, 8000),
      },
    });
    setSuggesting(false);
    if (error || data?.error) {
      let msg = data?.error ?? error?.message ?? "AI request failed.";
      try { const b = await (error as any)?.context?.json?.(); if (b?.error) msg = b.error; } catch { /* ignore */ }
      return toast({ title: "AI suggestions failed", description: String(msg), variant: "destructive" });
    }
    setSuggestions(data);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const err = await saveContentOverride(editing.kind, editing.id, buildPayload());
    setSaving(false);
    if (err) return toast({ title: "Save failed", description: err.message, variant: "destructive" });
    toast({ description: "Saved — the live site is updated." });
    iframeRef.current?.contentWindow?.location.reload();
  };

  const reset = async () => {
    if (!editing) return;
    const err = await resetContentOverride(editing.kind, editing.id);
    if (err) return toast({ title: "Reset failed", description: err.message, variant: "destructive" });
    toast({ description: "Restored the original content." });
    open(editing);
    iframeRef.current?.contentWindow?.location.reload();
  };

  const sync = async () => {
    setSyncing(true);
    const { error, added } = await syncAllOriginals();
    setSyncing(false);
    if (error) return toast({ title: "Copy failed", description: error.message, variant: "destructive" });
    toast({ description: added ? `Copied ${added} items to the backend.` : "All items are already in the backend." });
  };

  const field = (name: string, label: string, kind: "input" | "textarea" | "switch" = "input", rows = 3) => (
    <div className="space-y-1.5" key={name}>
      <Label className="text-xs uppercase tracking-wide">{label}</Label>
      {kind === "switch" ? (
        <Switch checked={!!form[name]} onCheckedChange={(v) => setForm((f) => ({ ...f, [name]: v }))} />
      ) : kind === "textarea" ? (
        <Textarea rows={rows} value={form[name] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))} />
      ) : (
        <Input value={form[name] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Content Admin | SS. Tharan</title>
      </Helmet>
      <main className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Projects &amp; Blog Content</h1>
            <p className="text-sm text-muted-foreground">Click any item to preview and edit it. Saving updates the live site.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { pc.refresh(); bc.refresh(); }}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh counts
            </Button>
            <Button onClick={sync} disabled={syncing}>
              <Database className="h-4 w-4 mr-2" /> {syncing ? "Copying…" : "Copy all originals to backend"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[["Views", totals.views, Eye], ["Likes", totals.likes, Heart], ["Comments", totals.comments, MessageCircle]].map(([l, v, I]: any) => (
            <div key={l} className="border-2 border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground"><I className="h-4 w-4" />{l}</div>
              <div className="text-2xl font-bold mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({items.length})</TabsTrigger>
              <TabsTrigger value="project">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="blog">Blog ({blogPosts.length})</TabsTrigger>
            </TabsList>
          </Tabs>
          <Input placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:max-w-xs" />
        </div>

        <div className="border-2 border-border divide-y-2 divide-border">
          {filtered.map((it) => {
            const c = counts(it);
            return (
              <button key={`${it.kind}-${it.id}`} onClick={() => open(it)} className="w-full flex items-center gap-4 p-3 text-left hover:bg-secondary transition-colors">
                {it.image ? <img src={it.image} alt="" className="w-16 h-12 object-cover border border-border shrink-0" /> : <div className="w-16 h-12 bg-muted shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{it.sub}</div>
                </div>
                <div className="hidden sm:flex gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{c.views}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{c.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{c.comments}</span>
                  {c.reads !== null && <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{c.reads}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent
          className="max-w-[95vw] w-[95vw] h-[90vh] flex flex-col p-4"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Edit: {editing?.title}
              {editing && (
                <a href={editing.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  open <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="flex-1 grid lg:grid-cols-[1fr_380px] gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
              <div className="flex flex-col min-h-[60vh] lg:min-h-0 gap-2">
                <div className="flex flex-wrap gap-1">
                  {([["desktop", "Desktop", Monitor], ["tablet", "Tablet", Tablet], ["mobile", "Mobile", Smartphone]] as const).map(([k, l, I]) => (
                    <Button key={k} size="sm" variant={device === k ? "default" : "outline"} onClick={() => setDevice(k)}>
                      <I className="h-4 w-4 mr-1" />{l}
                    </Button>
                  ))}
                </div>
                <div className="flex-1 min-h-0 bg-muted flex justify-center overflow-auto">
                  <iframe
                    ref={iframeRef}
                    src={editing.url}
                    title="Live preview"
                    style={{ width: device === "desktop" ? "100%" : device === "tablet" ? 768 : 390, maxWidth: device === "desktop" ? "100%" : undefined }}
                    className="h-full shrink-0 border-2 border-border bg-background"
                  />
                </div>
              </div>
              <div className="lg:overflow-y-auto space-y-3 pr-1">
                <div className="border-2 border-border p-3 space-y-2">
                  <Label className="text-xs uppercase tracking-wide flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" />AI suggestions</Label>
                  <Textarea rows={3} placeholder="Paste a draft or notes (optional)…" value={draft} onChange={(e) => setDraft(e.target.value)} />
                  <Button size="sm" variant="outline" className="w-full" onClick={suggest} disabled={suggesting}>
                    {suggesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {suggesting ? "Thinking…" : "Suggest improvements"}
                  </Button>
                  {suggestions && (
                    <div className="space-y-2 text-sm">
                      <div className="text-xs text-muted-foreground">Titles — click to use</div>
                      {suggestions.titles.map((t) => (
                        <button key={t} onClick={() => setForm((f) => ({ ...f, title: t }))} className="block w-full text-left border border-border p-2 hover:bg-secondary">{t}</button>
                      ))}
                      <div className="text-xs text-muted-foreground">Description</div>
                      <p className="border border-border p-2">{suggestions.description}</p>
                      <Button size="sm" variant="secondary" onClick={() => setForm((f) => ({ ...f, [editing.kind === "project" ? "description" : "excerpt"]: suggestions.description }))}>Use description</Button>
                      {suggestions.missing.length > 0 && (
                        <>
                          <div className="text-xs text-muted-foreground">Missing details to add</div>
                          <ul className="list-disc pl-5 space-y-1">{suggestions.missing.map((m) => <li key={m}>{m}</li>)}</ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editing.kind === "project" ? (
                  <>
                    {field("title", "Title")}
                    {field("description", "Description", "textarea", 5)}
                    {field("tags", "Tags (comma separated)")}
                    {field("images", "Image URLs (one per line)", "textarea", 4)}
                    {field("liveUrl", "Live demo link")}
                    {field("githubUrl", "GitHub link")}
                    {field("videoUrl", "Video link")}
                    {field("articleUrl", "Case study link")}
                    {field("featured", "Featured", "switch")}
                  </>
                ) : (
                  <>
                    {field("title", "Title")}
                    {field("excerpt", "Excerpt", "textarea", 3)}
                    {field("category", "Category")}
                    {field("date", "Date")}
                    {field("readTime", "Read time")}
                    {field("image", "Cover image URL")}
                    {field("content", "Content (markdown)", "textarea", 14)}
                  </>
                )}
                <div className="flex gap-2 pt-2 sticky bottom-0 bg-background py-2">
                  <Button onClick={save} disabled={saving} className="flex-1"><Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save"}</Button>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-2" />Original</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminContentPage;
