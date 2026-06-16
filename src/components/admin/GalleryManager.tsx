import { useEffect, useState, useCallback, useRef } from "react";
import {
  Loader2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  DownloadCloud,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  GalleryItem,
  fetchAllGallery,
  galleryPublicUrl,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  importBundledGallery,
} from "@/lib/gallery";
import { BUNDLED_MEDIA } from "@/lib/galleryMedia";

const GalleryManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchAllGallery());
      setError(null);
    } catch (e) {
      setError(
        "Couldn't reach the gallery table. Make sure the gallery migration has been applied to your Supabase project."
      );
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
      toast({ title: "Pick an image or video first", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      await addGalleryItem(file, title, description, items.length);
      toast({ title: "Added to gallery" });
      setFile(null);
      setTitle("");
      setDescription("");
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

  const handleImport = async () => {
    setImporting(true);
    try {
      const n = await importBundledGallery();
      toast({ title: `Imported ${n} items into the database` });
      await load();
    } catch (err) {
      toast({
        title: "Import failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const toggleEnabled = async (item: GalleryItem) => {
    setBusyId(item.id);
    try {
      await updateGalleryItem(item.id, { enabled: !item.enabled });
      setItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, enabled: !x.enabled } : x))
      );
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: GalleryItem) => {
    if (!window.confirm(`Delete "${item.title || "this item"}" permanently?`)) return;
    setBusyId(item.id);
    try {
      await deleteGalleryItem(item);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
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
        <h2 className="font-display text-xl font-bold">Gallery Manager</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Add, hide or delete the photos &amp; videos shown on the public Gallery page. Media is
          stored in Supabase and visible to all users.
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="border-2 border-border bg-card p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Upload size={18} /> Add new item
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gallery-file">Image or video file</Label>
            <Input
              id="gallery-file"
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gallery-title">Title / name</Label>
            <Input
              id="gallery-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FANUC Robot Cell"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gallery-desc">Description / info (optional)</Label>
          <Textarea
            id="gallery-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short note shown under the title…"
            rows={2}
          />
        </div>
        <Button type="submit" disabled={uploading} variant="hero">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> Add to gallery
            </>
          )}
        </Button>
      </form>

      {/* List */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h3 className="font-semibold">
            Current items{" "}
            {!loading && !error && <span className="text-muted-foreground">({items.length})</span>}
          </h3>
        </div>

        {error ? (
          <div className="border-2 border-destructive/40 bg-destructive/5 p-4 flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
            <span>{error}</span>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="border-2 border-border bg-card p-6 text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              The database gallery is empty. Import the {BUNDLED_MEDIA.length} media files already
              in the site so you can manage them here, or add your own above.
            </p>
            <Button onClick={handleImport} disabled={importing} variant="outline">
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing… (uploading to Supabase)
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4 mr-2" /> Import current gallery (
                  {BUNDLED_MEDIA.length})
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="border-2 border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const url = galleryPublicUrl(item.media_path);
                  return (
                    <TableRow key={item.id} className={item.enabled ? "" : "opacity-60"}>
                      <TableCell>
                        <div className="w-16 h-12 bg-muted overflow-hidden border border-border flex items-center justify-center">
                          {item.media_type === "video" ? (
                            <video src={url} muted className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title || "—"}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground max-w-xs truncate">
                            {item.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          {item.media_type === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
                          {item.media_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.enabled}
                            disabled={busyId === item.id}
                            onCheckedChange={() => toggleEnabled(item)}
                            aria-label="Toggle visibility"
                          />
                          {item.enabled ? (
                            <Eye size={14} className="text-muted-foreground" />
                          ) : (
                            <EyeOff size={14} className="text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={busyId === item.id}
                          onClick={() => remove(item)}
                        >
                          {busyId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
