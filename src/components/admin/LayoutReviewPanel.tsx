import { useState } from "react";
import { Monitor, Tablet, Smartphone, ScanSearch, Loader2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Viewport = "desktop" | "tablet" | "mobile";
type Issue = { viewport: string; severity: "high" | "medium" | "low"; problem: string; fix: string };

const SLOTS: [Viewport, string, typeof Monitor][] = [
  ["desktop", "Desktop", Monitor],
  ["tablet", "Tablet", Tablet],
  ["mobile", "Mobile", Smartphone],
];

/** Downscale + re-encode to JPEG so uploads stay small. */
const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 1600 / img.width, 2400 / img.height);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Not a readable image")); };
    img.src = url;
  });

const LayoutReviewPanel = ({ page }: { page: string }) => {
  const [shots, setShots] = useState<Partial<Record<Viewport, string>>>({});
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ summary: string; issues: Issue[] } | null>(null);

  const pick = async (vp: Viewport, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ description: "Please choose an image file.", variant: "destructive" });
    try {
      const d = await toDataUrl(file);
      setShots((s) => ({ ...s, [vp]: d }));
    } catch (e) {
      toast({ description: (e as Error).message, variant: "destructive" });
    }
  };

  const run = async () => {
    const list = SLOTS.filter(([k]) => shots[k]).map(([k]) => ({ viewport: k, dataUrl: shots[k]! }));
    if (!list.length) return toast({ description: "Add at least one screenshot first." });
    setBusy(true);
    setResult(null);
    const { data, error } = await supabase.functions.invoke("analyze-layout", { body: { page, notes, shots: list } });
    setBusy(false);
    if (error || data?.error) {
      let msg = data?.error ?? error?.message ?? "AI request failed.";
      try { const b = await (error as any)?.context?.json?.(); if (b?.error) msg = b.error; } catch { /* ignore */ }
      return toast({ title: "Layout review failed", description: String(msg), variant: "destructive" });
    }
    setResult(data);
  };

  const sev = { high: "bg-destructive text-destructive-foreground", medium: "bg-foreground text-background", low: "bg-muted text-foreground" };

  return (
    <div className="border-2 border-border p-3 space-y-2">
      <Label className="text-xs uppercase tracking-wide flex items-center gap-1"><ScanSearch className="h-3.5 w-3.5" />Responsive layout check</Label>
      <p className="text-xs text-muted-foreground">Add screenshots of this page at each size. The AI points out layout problems and how to fix them.</p>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(([k, l, I]) => (
          <div key={k} className="relative">
            <label className="flex flex-col items-center justify-center gap-1 aspect-[3/4] border-2 border-dashed border-border cursor-pointer hover:bg-secondary overflow-hidden text-[10px] uppercase text-muted-foreground">
              {shots[k] ? (
                <img src={shots[k]} alt={`${l} screenshot`} className="w-full h-full object-cover object-top" />
              ) : (
                <><I className="h-4 w-4" />{l}<Upload className="h-3 w-3" /></>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { pick(k, e.target.files?.[0]); e.target.value = ""; }} />
            </label>
            {shots[k] && (
              <button aria-label={`Remove ${l} screenshot`} onClick={() => setShots((s) => ({ ...s, [k]: undefined }))} className="absolute top-1 right-1 bg-background border border-border p-0.5">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      <Textarea rows={2} placeholder="Anything specific to check? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button size="sm" variant="outline" className="w-full" onClick={run} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ScanSearch className="h-4 w-4 mr-2" />}
        {busy ? "Reviewing screenshots…" : "Find layout issues"}
      </Button>
      {result && (
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">{result.summary}</p>
          {result.issues.length === 0 && <p>No layout issues found.</p>}
          {result.issues.map((it, i) => (
            <div key={i} className="border border-border p-2 space-y-1">
              <div className="flex gap-1 text-[10px] uppercase">
                <span className={`px-1.5 py-0.5 ${sev[it.severity] ?? sev.low}`}>{it.severity}</span>
                <span className="px-1.5 py-0.5 border border-border">{it.viewport}</span>
              </div>
              <p>{it.problem}</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Fix:</span> {it.fix}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayoutReviewPanel;
