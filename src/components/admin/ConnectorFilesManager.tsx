import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload, Eye, EyeOff, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ConnectorFileRow,
  fetchAllConnectorFiles,
  updateConnectorFile,
  deleteConnectorFile,
  addConnectorFile,
  formatBytes,
} from "@/lib/connectorFiles";

const ConnectorFilesManager = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ConnectorFileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState("Leo AI");
  const [groupDescription, setGroupDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchAllConnectorFiles());
      setError(null);
    } catch {
      setError("Couldn't load the connector files list. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Pick a file first", variant: "destructive" });
      return;
    }
    if (!groupName.trim()) {
      toast({ title: "Enter a folder name", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      await addConnectorFile(file, groupName, groupDescription, rows.length);
      toast({ title: "File added to the connector folder" });
      setFile(null);
      setGroupDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await load();
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const patch = async (row: ConnectorFileRow, next: Partial<ConnectorFileRow>) => {
    setBusyId(row.id);
    try {
      await updateConnectorFile(row.id, next);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...next } : r)));
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: ConnectorFileRow) => {
    if (!window.confirm(`Delete "${row.file_name}" permanently?`)) return;
    setBusyId(row.id);
    try {
      await deleteConnectorFile(row);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast({ title: "Deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Connector Source Files</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Files stored in the cloud and shown in the Gallery &rarr; Connector Downloads folders. Use
          the switches to control whether visitors can see a file and whether they can download it.
        </p>
      </div>

      <form onSubmit={handleAdd} className="border-2 border-border bg-card p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Upload size={18} /> Add file to a folder
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="connector-file">File</Label>
            <Input
              id="connector-file"
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="connector-group">Folder name</Label>
            <Input
              id="connector-group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Leo AI"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="connector-desc">Folder description (optional)</Label>
          <Input
            id="connector-desc"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Short note shown on the folder card…"
          />
        </div>
        <Button type="submit" disabled={uploading} variant="hero">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> Upload file
            </>
          )}
        </Button>
      </form>

      {error ? (
        <div className="border-2 border-destructive/40 bg-destructive/5 p-4 flex items-start gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="border-2 border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No connector files uploaded yet.
        </div>
      ) : (
        <div className="border-2 border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folder</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead>Downloadable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className={row.enabled ? "" : "opacity-60"}>
                  <TableCell className="font-medium">{row.group_name}</TableCell>
                  <TableCell>
                    <div className="font-medium break-all">{row.file_name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {row.extension}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatBytes(row.size_bytes)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.enabled}
                        disabled={busyId === row.id}
                        onCheckedChange={() => patch(row, { enabled: !row.enabled })}
                        aria-label="Toggle visibility"
                      />
                      {row.enabled ? (
                        <Eye size={14} className="text-muted-foreground" />
                      ) : (
                        <EyeOff size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.downloadable}
                        disabled={busyId === row.id}
                        onCheckedChange={() => patch(row, { downloadable: !row.downloadable })}
                        aria-label="Toggle download"
                      />
                      <Download size={14} className="text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={busyId === row.id}
                      onClick={() => remove(row)}
                    >
                      {busyId === row.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ConnectorFilesManager;
