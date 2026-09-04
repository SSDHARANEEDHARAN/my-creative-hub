import { useMemo, useState } from "react";
import { Download, FolderOpen, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConnectorFile {
  name: string;
  src: string;
  extension: string;
}

interface ConnectorDownloadGroup {
  name: string;
  description: string;
  files: ConnectorFile[];
}

const connectorModules = import.meta.glob(
  "../assets/gallery/CONNECTORS/**/*.{evd,fsm,pdf,exe,mp4,webm,mov}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const fileName = (path: string) => decodeURIComponent(path.split("/").pop() ?? path);

const connectorGroups: ConnectorDownloadGroup[] = [
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
      return {
        name,
        src,
        extension: name.split(".").pop()?.toUpperCase() ?? "FILE",
      };
    }),
}));

const downloadName = (name: string) => name.replace(/[<>:"/\\|?*]+/g, "-");

const GalleryConnectorDownloads = () => {
  const [selected, setSelected] = useState<ConnectorDownloadGroup | null>(null);
  const availableGroups = useMemo(() => connectorGroups.filter((group) => group.files.length > 0), []);

  return (
    <section className="gallery-connectors border-t-2 border-border bg-background">
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

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {availableGroups.map((group) => (
            <button
              key={group.name}
              type="button"
              onClick={() => setSelected(group)}
              className="gallery-connector-card group text-left"
              aria-label={`Open ${group.name} connector files`}
            >
              <span className="gallery-connector-card__icon" aria-hidden="true">
                <FolderOpen className="h-6 w-6" />
              </span>
              <span className="mt-5 block text-lg font-semibold text-foreground">{group.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{group.description}</span>
              <span className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Package className="h-4 w-4" />
                {group.files.length} {group.files.length === 1 ? "file" : "files"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name} files</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {selected?.files.map((file) => (
              <div
                key={file.src}
                className="flex items-center gap-3 border border-border bg-card p-3 sm:p-4"
              >
                <span className="shrink-0 border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground">
                  {file.extension}
                </span>
                <span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">
                  {file.name}
                </span>
                <a
                  href={file.src}
                  download={downloadName(file.name)}
                  className="shrink-0 rounded-sm border border-border p-2 text-foreground transition-colors hover:bg-secondary"
                  aria-label={`Download ${file.name}`}
                  title={`Download ${file.name}`}
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GalleryConnectorDownloads;
