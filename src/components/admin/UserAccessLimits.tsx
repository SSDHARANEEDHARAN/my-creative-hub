import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  can_download: boolean;
  daily_download_limit: number | null;
  access_expires_at: string | null;
};

const toLocal = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

const UserAccessLimits = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("user_id, email, display_name, can_download, daily_download_limit, access_expires_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast({ title: "Could not load users", description: error.message, variant: "destructive" });
        setRows((data ?? []) as Row[]);
        setLoading(false);
      });
  }, []);

  const patch = (id: string, p: Partial<Row>) => setRows((r) => r.map((x) => (x.user_id === id ? { ...x, ...p } : x)));

  const save = async (r: Row) => {
    setSaving(r.user_id);
    const { error } = await supabase
      .from("profiles")
      .update({ can_download: r.can_download, daily_download_limit: r.daily_download_limit, access_expires_at: r.access_expires_at })
      .eq("user_id", r.user_id);
    setSaving(null);
    toast(error ? { title: "Save failed", description: error.message, variant: "destructive" } : { description: `Limits saved for ${r.email ?? "user"}.` });
  };

  if (loading) return <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  const list = rows.filter((r) => (r.email ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Set per-user limits: turn downloads off, cap downloads per 24 hours (empty = no limit), or set a date when access ends (account becomes restricted).
      </p>
      <Input placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:max-w-xs" />
      <div className="border-2 border-border divide-y-2 divide-border">
        {list.map((r) => (
          <div key={r.user_id} className="p-3 grid gap-3 md:grid-cols-[1fr_auto_8rem_14rem_auto] md:items-center">
            <div className="min-w-0">
              <div className="font-medium truncate">{r.email ?? "—"}</div>
              {r.display_name && <div className="text-xs text-muted-foreground truncate">{r.display_name}</div>}
            </div>
            <label className="flex items-center gap-2 text-xs uppercase">
              <Switch checked={r.can_download} onCheckedChange={(v) => patch(r.user_id, { can_download: v })} /> Downloads
            </label>
            <Input
              type="number"
              min={0}
              placeholder="No limit"
              aria-label="Downloads per day"
              value={r.daily_download_limit ?? ""}
              onChange={(e) => patch(r.user_id, { daily_download_limit: e.target.value === "" ? null : Math.max(0, Number(e.target.value)) })}
            />
            <Input
              type="datetime-local"
              aria-label="Access ends"
              value={toLocal(r.access_expires_at)}
              onChange={(e) => patch(r.user_id, { access_expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
            <Button size="sm" onClick={() => save(r)} disabled={saving === r.user_id}>
              {saving === r.user_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-1">Save</span>
            </Button>
          </div>
        ))}
        {list.length === 0 && <div className="p-4 text-sm text-muted-foreground">No users found.</div>}
      </div>
    </div>
  );
};

export default UserAccessLimits;
