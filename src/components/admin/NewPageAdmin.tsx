import { useEffect, useState } from "react";
import { Bell, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NEW_NOTICE_KEY, useNewPageNotice } from "@/hooks/useNewPageNotice";
import { NewNoticeContent } from "@/components/NewPageHero";

type Msg = { id: string; name: string; email: string; message: string; created_at: string };

const NewPageAdmin = () => {
  const notice = useNewPageNotice();
  const [title, setTitle] = useState(notice.title);
  const [message, setMessage] = useState(notice.message);
  const [saving, setSaving] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);

  useEffect(() => { setTitle(notice.title); setMessage(notice.message); }, [notice.title, notice.message]);

  const loadMsgs = async () => {
    const { data } = await supabase.from("mind_messages").select("*").order("created_at", { ascending: false }).limit(100);
    setMsgs((data as Msg[]) || []);
  };
  useEffect(() => { loadMsgs(); }, []);

  const save = async () => {
    setSaving(true);
    const content = { title: title.trim(), message: message.trim() };
    const { data: existing } = await supabase.from("about_content").select("id").eq("section_key", NEW_NOTICE_KEY).maybeSingle();
    const { error } = existing
      ? await supabase.from("about_content").update({ content, updated_at: new Date().toISOString() }).eq("id", existing.id)
      : await supabase.from("about_content").insert({ section_key: NEW_NOTICE_KEY, content });
    setSaving(false);
    toast(error ? { variant: "destructive", description: error.message } : { description: "Notice saved — live on the New page." });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("mind_messages").delete().eq("id", id);
    if (!error) setMsgs((m) => m.filter((x) => x.id !== id));
  };

  return (
    <section className="mb-8 border-2 border-foreground p-5 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold flex items-center gap-2"><Bell className="w-5 h-5" /> New page</h2>
        <Button variant="outline" size="sm" asChild><a href="/new" target="_blank" rel="noreferrer"><Eye className="w-4 h-4 mr-1" />Open page</a></Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-medium">Notice text</p>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice heading" maxLength={150} />
          <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notice message" maxLength={1000} />
          <Button onClick={save} disabled={saving || !title.trim()}>{saving ? "Saving…" : "Save notice"}</Button>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Preview</p>
          <div className="overflow-hidden border-2 border-foreground bg-[hsl(var(--sky-dark))]">
            <NewNoticeContent title={title || "—"} message={message} headingAs="p" compact />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">"What's on your mind" messages ({msgs.length})</p>
        {msgs.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> : (
          <ul className="divide-y divide-border border border-border max-h-96 overflow-auto">
            {msgs.map((m) => (
              <li key={m.id} className="p-3 flex gap-3 justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a></p>
                  <p className="text-sm text-muted-foreground break-words">{m.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <Button variant="ghost" size="icon" aria-label="Delete message" onClick={() => remove(m.id)}><Trash2 className="w-4 h-4" /></Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
export default NewPageAdmin;
