import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConnectorDownloadRow, fetchConnectorDownloads } from "@/lib/connectorFiles";

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

const ConnectorDownloadAnalytics = () => {
  const [rows, setRows] = useState<ConnectorDownloadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchConnectorDownloads());
      setError(null);
    } catch {
      setError("Couldn't load download stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const topFiles = useMemo(() => {
    const m = new Map<string, { name: string; group: string; count: number; last: string }>();
    rows.forEach((r) => {
      const k = r.file_id ?? `${r.group_name}/${r.file_name}`;
      const cur = m.get(k) ?? { name: r.file_name, group: r.group_name, count: 0, last: r.created_at };
      cur.count++;
      if (r.created_at > cur.last) cur.last = r.created_at;
      m.set(k, cur);
    });
    return [...m.values()].sort((a, b) => b.count - a.count);
  }, [rows]);

  const folders = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.group_name || "—", (m.get(r.group_name || "—") ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const daily = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const k = r.created_at.slice(0, 10);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    const out: { day: string; downloads: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dayKey(d);
      out.push({ day: k.slice(5), downloads: counts.get(k) ?? 0 });
    }
    return out;
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <BarChart3 size={20} /> Connector Download Stats
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{rows.length} downloads recorded in total.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <div className="border-2 border-border bg-card p-4">
            <h3 className="font-semibold text-sm mb-3">Downloads per day (last 30 days)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="downloads" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-border bg-card p-4">
              <h3 className="font-semibold text-sm mb-3">Per folder</h3>
              {folders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No downloads yet.</p>
              ) : (
                <ul className="space-y-1.5 text-sm">
                  {folders.map(([name, n]) => (
                    <li key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span className="font-semibold">{n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="md:col-span-2 border-2 border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Top files</TableHead>
                    <TableHead>Folder</TableHead>
                    <TableHead className="text-right">Downloads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFiles.slice(0, 15).map((f, i) => (
                    <TableRow key={`${f.group}-${f.name}`}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="break-all">{f.name}</TableCell>
                      <TableCell>{f.group}</TableCell>
                      <TableCell className="text-right font-semibold">{f.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="border-2 border-border overflow-x-auto max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Who</TableHead>
                  <TableHead>File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 100).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {r.user_email ? `${r.user_name ?? ""} ${r.user_email}`.trim() : "Guest"}
                    </TableCell>
                    <TableCell className="text-xs break-all">
                      {r.group_name} / {r.file_name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectorDownloadAnalytics;
