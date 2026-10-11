import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Eye, FileText, Loader2, Pencil } from "lucide-react";

type Draft = { id: string; title: string; slug: string; excerpt: string; content: string; cover_image: string | null; category: string; read_time: string | null; created_at: string };

const DraftApprovals = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("id,title,slug,excerpt,content,cover_image,category,read_time,created_at").eq("is_published", false).order("created_at", { ascending: false });
    setDrafts((data as Draft[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("draft-approvals").on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const approve = async (d: Draft) => {
    setBusy(d.id);
    const { error } = await supabase.from("blog_posts").update({ is_published: true, published_at: new Date().toISOString() }).eq("id", d.id);
    if (error) { setBusy(null); toast({ title: "Approve failed", description: error.message, variant: "destructive" }); return; }
    try {
      const { data } = await supabase.functions.invoke("notify-subscribers", { body: { type: "post", title: d.title, description: d.excerpt || "", slug: d.slug } });
      toast({ title: "Approved & live", description: `Subscribers notified: ${(data as any)?.sent ?? 0}/${(data as any)?.total ?? 0}` });
    } catch {
      toast({ title: "Approved & live", description: "Post is live; subscriber email failed (retry in Moderation → Notifications)." });
    }
    setBusy(null);
    load();
  };

  return (
    <div className="bg-card border border-border p-4 sm:p-6 mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="font-semibold mr-auto">Blog drafts awaiting approval ({drafts.length})</h2>
        <Button size="sm" variant="outline" asChild><Link to="/admin/moderation"><Pencil className="w-4 h-4 mr-1" />Submit a new draft</Link></Button>
      </div>
      {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : drafts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No drafts waiting. In Moderation → Blogs, write a post and press "Save as draft" — it appears here for preview and approval.</p>
      ) : (
        <ul className="space-y-3">
          {drafts.map((d) => (
            <li key={d.id} className="border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="mr-auto min-w-0">
                  <p className="font-medium truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.category} · {new Date(d.created_at).toLocaleString()}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setOpen(open === d.id ? null : d.id)}><Eye className="w-4 h-4 mr-1" />{open === d.id ? "Hide preview" : "Preview"}</Button>
                <Button size="sm" onClick={() => approve(d)} disabled={busy === d.id}>
                  {busy === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Approve & publish</>}
                </Button>
              </div>
              {open === d.id && (
                <article className="mt-4 border-t border-border pt-4 max-w-3xl mx-auto">
                  {d.cover_image && <img src={d.cover_image} alt={d.title} className="w-full max-h-80 object-cover mb-4" />}
                  <p className="text-xs uppercase tracking-wide text-primary">{d.category}{d.read_time ? ` · ${d.read_time}` : ""}</p>
                  <h3 className="font-display text-2xl font-bold mt-1 mb-2">{d.title}</h3>
                  {d.excerpt && <p className="text-muted-foreground mb-4">{d.excerpt}</p>}
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{d.content}</div>
                </article>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftApprovals;
