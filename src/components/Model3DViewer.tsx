import { Component, ReactNode, useEffect, useRef, useState, ComponentType } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Box,
  Download,
  Hand,
  Loader2,
  MousePointer2,
  RotateCcw,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Layers,
  WifiOff,
} from "lucide-react";
import type { ViewPreset } from "@/components/model3d/Model3DScene";

interface Model3DViewerProps {
  url: string;
  filename: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

type SceneModule = ComponentType<{
  url: string;
  preset: ViewPreset;
  exploded: boolean;
  zoomSignal: { dir: number; n: number };
  resetSignal: number;
}>;

let cachedScene: SceneModule | null = null;

/** Keeps a failed model load inside the popup instead of crashing the whole app. */
class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("3D model failed to load:", error);
    this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}



/** Animated hand hint that shows how to orbit the model, then fades out. */
const HowToOverlay = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative w-40 h-16 mb-6">
        <Hand className="w-10 h-10 text-primary absolute top-2 animate-[drag-hand_2s_ease-in-out_infinite]" />
      </div>
      <p className="text-sm font-medium text-foreground">Drag to rotate</p>
      <p className="text-xs text-muted-foreground mt-1">Scroll / pinch to zoom · Right-drag to pan</p>
      <style>{`@keyframes drag-hand{0%{transform:translateX(0)}50%{transform:translateX(110px)}100%{transform:translateX(0)}}`}</style>
    </div>
  );
};

const presets: { id: ViewPreset; label: string }[] = [
  { id: "iso", label: "Iso" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
];

const Model3DViewer = ({ url, filename, title, isOpen, onClose }: Model3DViewerProps) => {
  const [showHint, setShowHint] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [preset, setPreset] = useState<ViewPreset>("iso");
  const [exploded, setExploded] = useState(false);
  const [zoomSignal, setZoomSignal] = useState({ dir: 0, n: 0 });
  const [Scene, setScene] = useState<SceneModule | null>(cachedScene);
  const [loadError, setLoadError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lazy-load the heavy three.js scene bundle only when the popup opens.
  useEffect(() => {
    if (!isOpen || cachedScene) return;
    let active = true;
    setLoadError(false);
    import("@/components/model3d/Model3DScene")
      .then((m) => {
        cachedScene = m.default as SceneModule;
        if (active) setScene(() => cachedScene);
      })
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowHint(true);
      setPreset("iso");
      setExploded(false);
      setLoadError(false);
    }
  }, [isOpen]);

  const zoom = (dir: number) => setZoomSignal((z) => ({ dir, n: z.n + 1 }));

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-5xl w-[96vw] p-0 gap-0 overflow-hidden"
        aria-label={`${title} interactive 3D model viewer`}
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          closeRef.current?.focus();
        }}
      >
        <DialogHeader className="px-4 sm:px-6 py-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg pr-8">
            <Box className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="truncate">{title} — 3D View</span>
          </DialogTitle>
        </DialogHeader>

        <div
          className="relative w-full h-[55vh] sm:h-[62vh] bg-secondary/30"
          role="application"
          aria-label="3D model canvas. Use the buttons below to change view, zoom and explode the assembly. Press Escape to close."
        >
          {isOpen && Scene && !loadError && (
            <SceneErrorBoundary onError={() => setLoadError(true)}>
              <Scene
                url={url}
                preset={preset}
                exploded={exploded}
                zoomSignal={zoomSignal}
                resetSignal={resetSignal}
              />
            </SceneErrorBoundary>
          )}


          {isOpen && !Scene && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground" role="status" aria-live="polite">
              <Loader2 className="w-7 h-7 animate-spin" aria-hidden="true" />
              <p className="text-xs uppercase tracking-wide">Initializing 3D engine…</p>
              <p className="text-[11px] text-muted-foreground/80 max-w-xs text-center px-6">
                First load downloads the viewer and model. On slower mobile connections this can take
                a few seconds.
              </p>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center" role="alert">
              <WifiOff className="w-7 h-7 text-primary" aria-hidden="true" />
              <p className="text-sm text-foreground">3D viewer could not be loaded.</p>
              <p className="text-xs text-muted-foreground">
                Check your connection and try again, or download the .glb file below and open it in
                Blender.
              </p>
            </div>
          )}

          {showHint && Scene && !loadError && <HowToOverlay onDone={() => setShowHint(false)} />}

          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => zoom(1)}
              aria-label="Zoom in"
              className="inline-flex items-center justify-center w-8 h-8 bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => zoom(-1)}
              aria-label="Zoom out"
              className="inline-flex items-center justify-center w-8 h-8 bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setPreset("iso");
                setExploded(false);
                setResetSignal((k) => k + 1);
              }}
              aria-label="Reset camera view"
              className="inline-flex items-center gap-1.5 px-3 h-8 text-xs bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset view
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-border space-y-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Camera view presets">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                aria-pressed={preset === p.id}
                aria-label={`${p.label} view`}
                className={`px-3 py-1.5 text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  preset === p.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 border-border hover:bg-secondary"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setExploded((e) => !e)}
              aria-pressed={exploded}
              aria-label="Toggle exploded assembly view"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                exploded
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/40 border-border hover:bg-secondary"
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              Exploded
            </button>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MousePointer2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Left-drag rotates · Scroll or pinch zooms · Right-drag (or two-finger drag) pans ·
              Press <kbd className="px-1 border border-border">Esc</kbd> to close.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground border border-border p-3 bg-secondary/30">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong className="text-foreground">Disclaimer:</strong> This model is shared for
              educational and portfolio review only. Geometry is simplified/decimated for web
              viewing and is not a manufacturing-accurate release. Redistribution or commercial use
              is not permitted.
            </span>
          </div>
          <a href={url} download={filename} className="block">
            <Button className="w-full sm:w-auto gap-2" aria-label={`Download ${filename}`}>
              <Download className="w-4 h-4" aria-hidden="true" />
              Download 3D file (.glb)
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Model3DViewer;
