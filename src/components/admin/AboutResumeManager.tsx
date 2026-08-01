import { useEffect, useState } from "react";
import { Loader2, Save, Upload, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeMeta {
  url: string;
  filename: string;
  updated_at: string;
}

const AboutResumeManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [about, setAbout] = useState({ title: "", paragraph1: "", paragraph2: "" });
  const [resume, setResume] = useState<ResumeMeta | null>(null);

  const load = async () => {
    const { data } = await supabase.from("about_content").select("*");
    const intro = (data || []).find((r) => r.section_key === "intro");
    const res = (data || []).find((r) => r.section_key === "resume");
    if (intro?.content) setAbout(intro.content as unknown as typeof about);
    if (res?.content) setResume(res.content as unknown as ResumeMeta);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upsertSection = async (section_key: string, content: unknown) => {
    const { data: existing } = await supabase
      .from("about_content").select("id").eq("section_key", section_key).maybeSingle();
    if (existing) {
      return supabase.from("about_content")
        .update({ content: content as never }).eq("section_key", section_key);
    }
    return supabase.from("about_content")
      .insert({ section_key, content: content as never });
  };

  const saveAbout = async () => {
    setSaving(true);
    const { error } = await upsertSection("intro", about);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "About content updated", description: "Changes are now live on the About page." });
  };

  const handleResumeUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({ title: "PDF only", description: "Please attach a PDF file.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const path = `resumes/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("content").upload(path, file, {
        cacheControl: "3600", upsert: true, contentType: "application/pdf",
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("content").getPublicUrl(path);
      const meta: ResumeMeta = {
        url: pub.publicUrl,
        filename: file.name,
        updated_at: new Date().toISOString(),
      };
      const { error } = await upsertSection("resume", meta);
      if (error) throw error;
      setResume(meta);
      toast({ title: "Resume saved", description: "Every visitor now downloads this latest resume." });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">About Page Description</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Section title"
            value={about.title}
            onChange={(e) => setAbout((p) => ({ ...p, title: e.target.value }))}
          />
          <Textarea
            placeholder="First paragraph"
            rows={4}
            value={about.paragraph1}
            onChange={(e) => setAbout((p) => ({ ...p, paragraph1: e.target.value }))}
          />
          <Textarea
            placeholder="Second paragraph"
            rows={4}
            value={about.paragraph2}
            onChange={(e) => setAbout((p) => ({ ...p, paragraph2: e.target.value }))}
          />
          <Button onClick={saveAbout} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save About Content
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Resume (PDF)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Attach and save a PDF — the last saved resume is what every visitor previews and downloads.
          </p>

          {resume ? (
            <div className="border border-border p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <FileText className="w-4 h-4 text-primary" />
                <span className="truncate">{resume.filename}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Last saved {new Date(resume.updated_at).toLocaleString()}
              </p>
              <Button asChild size="sm" variant="outline">
                <a href={resume.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" /> Preview current resume
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No resume uploaded yet — the built-in default is served.</p>
          )}

          <label className="inline-flex">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); e.target.value = ""; }}
            />
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {resume ? "Replace Resume PDF" : "Attach Resume PDF"}
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutResumeManager;
