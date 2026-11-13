import { toast } from "@/hooks/use-toast";
import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotchedProjectCover from "@/components/NotchedProjectCover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ConnectorFileRow,
  fetchVisibleConnectorFiles,
  signedConnectorUrl,
  formatBytes,
  logConnectorDownload,
  checkDownloadAllowed,
} from "@/lib/connectorFiles";

interface ConnectorFile {
  name: string;
  src: string;
  extension: string;
  storagePath?: string;
  id?: string;
  description?: string | null;
  tags?: string[];
  downloadable: boolean;
  isVideo: boolean;
  size?: number;
}

interface ConnectorDownloadGroup {
  name: string;
  description: string;
  link?: string | null;
  files: ConnectorFile[];
}

const connectorModules = import.meta.glob(
  "../assets/gallery/CONNECTORS/**/*.{evd,fsm,pdf,exe,mp4,webm,mov}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const fileName = (path: string) => decodeURIComponent(path.split("/").pop() ?? path);

const bundledGroups: ConnectorDownloadGroup[] = [
  {
    name: "Eduvolt",
    description: "Electrical and PLC trainer source files",
    files: [],
  },
  {
    name: "Flexsim",
    description: "Warehouse process simulation source file",
    files: [],
  },
  {
    name: "cadabra.ai",
    description: "AI CAD guides, references, and bundle",
    files: [],
  },
].map((group) => ({
  ...group,
  files: Object.entries(connectorModules)
    .filter(([path]) => path.toLowerCase().includes(`/connectors/${group.name.toLowerCase()}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([path, src]) => {
      const name = fileName(path);
      const extension = name.split(".").pop()?.toUpperCase() ?? "FILE";
      return {
        name,
        src,
        extension,
        downloadable: true,
        isVideo: ["MP4", "WEBM", "MOV"].includes(extension),
      };
    }),
}));

const downloadName = (name: string) => name.replace(/[<>:"/\\|?*]+/g, "-");

const GalleryConnectorDownloads = () => {
  const [selected, setSelected] = useState<ConnectorDownloadGroup | null>(null);
  const [cloudRows, setCloudRows] = useState<ConnectorFileRow[]>([]);
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    fetchVisibleConnectorFiles()
      .then(setCloudRows)
      .catch(() => setCloudRows([]));
  }, []);

  const cloudGroups = useMemo<ConnectorDownloadGroup[]>(() => {
    const map = new Map<string, ConnectorDownloadGroup>();
    cloudRows.forEach((row) => {
      const group = map.get(row.group_name) ?? {
        name: row.group_name,
        description: row.group_description ?? "Cloud hosted source files",
        link: row.group_link,
        files: [],
      };
      group.files.push({
        name: row.file_name,
        src: "",
        extension: row.extension,
        storagePath: row.storage_path,
        id: row.id,
        description: row.description,
        tags: row.tags,
        downloadable: row.downloadable,
        isVideo: row.kind === "video",
        size: row.size_bytes,
      });
      map.set(row.group_name, group);
    });
    return Array.from(map.values());
  }, [cloudRows]);

  const availableGroups = useMemo(
    () => [...cloudGroups, ...bundledGroups].filter((group) => group.files.length > 0),
    [cloudGroups]
  );

  const openFile = async (file: ConnectorFile, asDownload: boolean) => {
    if (asDownload) {
      const blocked = await checkDownloadAllowed().catch(() => null);
      if (blocked) {
        toast({ description: blocked, variant: "destructive" });
        return;
      }
      logConnectorDownload(file.id ?? null, file.name, selected?.name ?? "").catch(() => {});
    }
    let url = file.src;
    if (file.storagePath) {
      url =
        (await signedConnectorUrl(
          file.storagePath,
          asDownload ? downloadName(file.name) : undefined
        )) ?? "";
    }
    if (!url) return;
    if (asDownload) {
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName(file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }
    setPreview({ name: file.name, url });
  };

  return (
    <section id="connector-downloads" className="gallery-connectors border-t-2 border-border bg-background scroll-mt-24">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-primary text-xs font-medium uppercase tracking-widest sm:text-sm">
            Source Files
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Connector Downloads
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Open a connector folder to browse and download its project files.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {availableGroups.map((group, index) => {
            const extensions = Array.from(new Set(group.files.map((f) => f.extension)));
            const unit = `U-${String(index + 1).padStart(2, "0")}`;
            return (
              <article
                key={group.name}
                className="group/project-card relative bg-background transition-all duration-300 select-none flex flex-col h-full min-w-0 break-words"
              >
                <NotchedProjectCover
                  onOpen={() => setSelected(group)}
                  badge={unit}
                  label={`Open ${group.name} files`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/15 to-accent/15 p-6">
                    <span className="font-display text-5xl font-bold text-foreground">{group.files.length}</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {group.files.length === 1 ? "file" : "files"}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {extensions.map((ext) => (
                        <span key={ext} className="border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
                          .{ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </NotchedProjectCover>

                <div className="p-6 flex flex-col flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-3 group-hover/project-card:text-primary transition-colors break-words">
                    {group.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{group.description}</p>
                  <div className="mb-3 text-xs md:text-sm text-muted-foreground">
                    {extensions.map((ext) => `.${ext.toLowerCase()}`).join(" · ")}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelected(group)}>
                      Open module <Download size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name} files</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
            {selected?.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4"
              >
                <ExternalLink className="h-4 w-4" />
                Get the {selected.name} app
              </a>
            )}
          </DialogHeader>
          <div className="space-y-2">
            {selected?.files.map((file) => (
              <div
                key={file.storagePath ?? file.src}
                className="flex items-center gap-3 border border-border bg-card p-3 sm:p-4"
              >
                <span className="shrink-0 border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground">
                  {file.extension}
                </span>
                <span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">
                  {file.name}
                  {file.size ? (
                    <span className="block text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                  ) : null}
                  {file.description ? (
                    <span className="mt-1 block text-xs text-muted-foreground">{file.description}</span>
                  ) : null}
                  {file.tags && file.tags.length > 0 ? (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {file.tags.map((t) => (
                        <span key={t} className="border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
                {file.isVideo && (
                  <button
                    type="button"
                    onClick={() => openFile(file, false)}
                    className="shrink-0 border border-border p-2 text-foreground transition-colors hover:bg-secondary"
                    aria-label={`Play ${file.name}`}
                    title={`Play ${file.name}`}
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                {file.downloadable ? (
                  <button
                    type="button"
                    onClick={() => openFile(file, true)}
                    className="shrink-0 border border-border p-2 text-foreground transition-colors hover:bg-secondary"
                    aria-label={`Download ${file.name}`}
                    title={`Download ${file.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="shrink-0 border border-border px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    View only
                  </span>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <video src={preview.url} controls autoPlay className="w-full border border-border" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GalleryConnectorDownloads;
