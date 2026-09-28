import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload, Eye, EyeOff, Download, AlertTriangle, Pencil, Sparkles, Ban } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  isBlocked,
  generateConnectorMetadata,
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
  const [editing, setEditing] = useState<ConnectorFileRow | null>(null);
  const [details, setDetails] = useState("");
  const [desc, setDesc] = useState("");
  const [tagText, setTagText] = useState("");
  const [blockHours, setBlockHours] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const openEdit = (row: ConnectorFileRow) => {
    setEditing(row);
    setDetails("");
    setDesc(row.description ?? "");
    setTagText((row.tags ?? []).join(", "));
    setBlockHours("");
  };

  const runAi = async () => {
    if (!editing) return;
    setAiBusy(true);
    try {
      const r = await generateConnectorMetadata({
        fileName: editing.file_name,
        folder: editing.group_name,
        extension: editing.extension,
        details,
      });
      setDesc(r.description);
      setTagText(r.tags.join(", "));
    } catch (err) {
      toast({ title: "AI couldn't generate", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setAiBusy(false);
    }
  };

  const saveEdit = async (clearBlock = false) => {
    if (!editing) return;
    setSaving(true);
    const hours = Number(blockHours);
    const next: Partial<ConnectorFileRow> = {
      description: desc.trim() || null,
      tags: tagText.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    };
    if (clearBlock) next.blocked_until = null;
    else if (hours > 0) next.blocked_until = new Date(Date.now() + hours * 3600_000).toISOString();
    try {
      await updateConnectorFile(editing.id, next);
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...next } : r)));
      toast({ title: "Saved" });
      setEditing(null);
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

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
                    {isBlocked(row) && (
                      <Badge variant="destructive" className="mt-1 ml-1">
                        Blocked until {new Date(row.blocked_until!).toLocaleString()}
                      </Badge>
                    )}
                    {row.description && <p className="text-xs text-muted-foreground mt-1">{row.description}</p>}
                    {row.tags?.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1">{row.tags.map((t) => `#${t}`).join(" ")}</p>
                    )}
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
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)} aria-label="Edit details">
                      <Pencil className="w-4 h-4" />
                    </Button>
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

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="break-all">{editing?.file_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>File details for AI (what it is, software, purpose)</Label>
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} />
              <Button type="button" variant="outline" size="sm" onClick={runAi} disabled={aiBusy}>
                {aiBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate description & tags
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input value={tagText} onChange={(e) => setTagText(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Ban size={14} /> Temporarily block (hours)</Label>
              <Input type="number" min={0} value={blockHours} onChange={(e) => setBlockHours(e.target.value)} placeholder="e.g. 24" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            {editing && isBlocked(editing) && (
              <Button variant="outline" onClick={() => saveEdit(true)} disabled={saving}>Unblock</Button>
            )}
            <Button variant="hero" onClick={() => saveEdit(false)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectorFilesManager;
