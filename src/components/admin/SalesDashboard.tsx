import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IndianRupee, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Sale { id: string; user_id: string; offer_title: string; order_id: string; payment_id: string | null; amount_paise: number; paid_at: string | null; created_at: string }

const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const SalesDashboard = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("exploration_purchases").select("id,user_id,offer_title,order_id,payment_id,amount_paise,paid_at,created_at").eq("status", "paid").order("paid_at", { ascending: false });
    const rows = (data ?? []) as Sale[];
    setSales(rows);
    const ids = Array.from(new Set(rows.map((r) => r.user_id)));
    if (ids.length) {
      const { data: profiles } = await supabase.from("profiles").select("user_id,email,display_name").in("user_id", ids);
      setEmails(Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p.email || p.display_name || p.user_id])));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("sales-dashboard").on("postgres_changes", { event: "*", schema: "public", table: "exploration_purchases" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const buyers = useMemo(() => {
    const map = new Map<string, { total: number; sales: Sale[] }>();
    sales.forEach((s) => { const b = map.get(s.user_id) ?? { total: 0, sales: [] }; b.total += s.amount_paise; b.sales.push(s); map.set(s.user_id, b); });
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [sales]);
  const total = sales.reduce((n, s) => n + s.amount_paise, 0);

  return (
    <section className="mb-8 border-2 border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground"><IndianRupee className="h-5 w-5" /> Sales</h2>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[["Total revenue", inr(total)], ["Confirmed payments", String(sales.length)], ["Buyers", String(buyers.length)]].map(([label, value]) => (
          <div key={label} className="border border-border p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold text-foreground">{value}</p></div>
        ))}
      </div>
      {!loading && buyers.length === 0 && <p className="text-sm text-muted-foreground">No confirmed payments yet.</p>}
      <div className="space-y-4">
        {buyers.map(([userId, b]) => (
          <div key={userId} className="border border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted px-4 py-2">
              <span className="break-all text-sm font-semibold text-foreground">{emails[userId] ?? userId}</span>
              <span className="text-sm font-bold text-foreground">{inr(b.total)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-2">Item</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Paid on</th><th className="px-4 py-2">Payment ID</th></tr></thead>
                <tbody>
                  {b.sales.map((s) => (
                    <tr key={s.id} className="border-t border-border text-foreground">
                      <td className="px-4 py-2">{s.offer_title}</td>
                      <td className="px-4 py-2">{inr(s.amount_paise)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(s.paid_at ?? s.created_at).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2 font-mono text-xs">{s.payment_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SalesDashboard;
