import { Component, ReactNode, useCallback, useEffect, useMemo, useRef, useState, ComponentType } from "react";
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
  Maximize2,
  Minimize2,
  Ruler,
  Trash2,
  X,
} from "lucide-react";
import type { CameraState, ModelQuality, SceneProps, ViewPreset } from "@/components/model3d/Model3DScene";

interface Model3DViewerProps {
  url: string;
  filename: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  /** Used to remember camera / preset / quality per industrial project. */
  projectId?: number | string;
}

type SceneModule = ComponentType<SceneProps>;

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

const qualities: ModelQuality[] = ["low", "medium", "high"];

interface SavedView {
  camera?: CameraState;
  preset?: ViewPreset;
  quality?: ModelQuality;
}

interface SavedMeasurement {
  id: string;
  kind: "distance" | "angle";
  value: string;
  note: string;
  at: string;
}

const viewKey = (k: string) => `model3d:view:${k}`;
const measureKey = (k: string) => `model3d:measure:${k}`;

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — persistence is best-effort */
  }
};

/** Picks a starting quality from the network / device hints. */
const defaultQuality = (): ModelQuality => {
  const conn = (navigator as any).connection;
  if (conn?.saveData) return "low";
  if (/2g/.test(conn?.effectiveType || "")) return "low";
  if (conn?.effectiveType === "3g") return "medium";
  if (typeof window !== "undefined" && window.innerWidth < 640) return "medium";
  return "high";
};

const dist = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const formatLen = (d: number) =>
  d < 1 ? `${(d * 1000).toFixed(1)} mm` : `${d.toFixed(3)} m`;

const angleAt = (a: number[], b: number[], c: number[]) => {
  const v1 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const v2 = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const m = Math.hypot(...v1) * Math.hypot(...v2);
  if (!m) return 0;
  return (Math.acos(Math.min(1, Math.max(-1, dot / m))) * 180) / Math.PI;
};

const Model3DViewer = ({ url, filename, title, isOpen, onClose, projectId }: Model3DViewerProps) => {
  const storeKey = String(projectId ?? url);

  const [showHint, setShowHint] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [preset, setPreset] = useState<ViewPreset>("iso");
  const [exploded, setExploded] = useState(false);
  const [zoomSignal, setZoomSignal] = useState({ dir: 0, n: 0 });
  const [Scene, setScene] = useState<SceneModule | null>(cachedScene);
  const [loadError, setLoadError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<ModelQuality>("medium");
  const [autoDropped, setAutoDropped] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [points, setPoints] = useState<[number, number, number][]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<SavedMeasurement[]>([]);
  const [initialCamera, setInitialCamera] = useState<CameraState | null>(null);
  const cameraRef = useRef<CameraState | null>(null);
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

  // Restore the last camera / preset / quality for this project.
  useEffect(() => {
    if (!isOpen) return;
    const savedView = readJSON<SavedView>(viewKey(storeKey), {});
    setShowHint(true);
    setExploded(false);
    setLoadError(false);
    setMeasuring(false);
    setPoints([]);
    setNote("");
    setAutoDropped(false);
    setPreset(savedView.preset ?? "iso");
    setQuality(savedView.quality ?? defaultQuality());
    setInitialCamera(savedView.camera ?? null);
    cameraRef.current = savedView.camera ?? null;
    setSaved(readJSON<SavedMeasurement[]>(measureKey(storeKey), []));
  }, [isOpen, storeKey]);

  const persistView = useCallback(
    (patch: SavedView) => {
      const current = readJSON<SavedView>(viewKey(storeKey), {});
      writeJSON(viewKey(storeKey), { ...current, ...patch });
    },
    [storeKey],
  );

  // Save the camera when the popup closes (and on every orbit end via ref).
  useEffect(() => {
    if (isOpen) return;
    if (cameraRef.current) persistView({ camera: cameraRef.current });
  }, [isOpen, persistView]);

  const handleCameraChange = useCallback(
    (c: CameraState) => {
      cameraRef.current = c;
      persistView({ camera: c });
    },
    [persistView],
  );

  const changePreset = (p: ViewPreset) => {
    setPreset(p);
    persistView({ preset: p });
  };

  const changeQuality = (q: ModelQuality) => {
    setQuality(q);
    setAutoDropped(false);
    persistView({ quality: q });
  };

  const handleFallback = useCallback(() => {
    setQuality((q) => {
      if (q === "high") {
        setAutoDropped(true);
        return "medium";
      }
      if (q === "medium") {
        setAutoDropped(true);
        return "low";
      }
      return q;
    });
  }, []);

  const zoom = (dir: number) => setZoomSignal((z) => ({ dir, n: z.n + 1 }));

  const addPoint = useCallback((p: [number, number, number]) => {
    setPoints((prev) => (prev.length >= 3 ? [p] : [...prev, p]));
  }, []);

  const measurement = useMemo(() => {
    if (points.length === 2) {
      return { kind: "distance" as const, value: formatLen(dist(points[0], points[1])) };
    }
    if (points.length === 3) {
      return { kind: "angle" as const, value: `${angleAt(points[0], points[1], points[2]).toFixed(1)}°` };
    }
    return null;
  }, [points]);

  const saveMeasurement = () => {
    if (!measurement) return;
    const entry: SavedMeasurement = {
      id: `${Date.now()}`,
      kind: measurement.kind,
      value: measurement.value,
      note: note.trim(),
      at: new Date().toISOString(),
    };
    const next = [entry, ...saved].slice(0, 30);
    setSaved(next);
    writeJSON(measureKey(storeKey), next);
    setNote("");
    setPoints([]);
  };

  const deleteMeasurement = (id: string) => {
    const next = saved.filter((m) => m.id !== id);
    setSaved(next);
    writeJSON(measureKey(storeKey), next);
  };

  const statusMessage = loadError
    ? "3D model failed to load. You can download the file instead."
    : !Scene
      ? "Loading the 3D engine and model, please wait."
      : "3D model is ready. Drag to rotate.";

  const toggleBase =
    "px-3 py-1.5 text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-9";
  const activeCls = "bg-primary text-primary-foreground border-primary";
  const idleCls = "bg-secondary/40 border-border hover:bg-secondary";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={
          fullscreen
            ? "max-w-none w-screen h-[100dvh] p-0 gap-0 overflow-y-auto border-0 translate-x-0 translate-y-0 left-0 top-0"
            : "max-w-5xl w-[96vw] p-0 gap-0 overflow-hidden"
        }
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

        {/* Screen-reader status for loading / ready / failure */}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>

        <div
          className={`relative w-full bg-secondary/30 ${fullscreen ? "h-[62dvh] sm:h-[70dvh]" : "h-[55vh] sm:h-[62vh]"}`}
          role="application"
          aria-label="3D model canvas. Use the buttons below to change view, zoom, quality and measurements. Press Escape to close."
        >
          {isOpen && Scene && !loadError && (
            <SceneErrorBoundary onError={() => setLoadError(true)}>
              <Scene
                url={url}
                preset={preset}
                exploded={exploded}
                zoomSignal={zoomSignal}
                resetSignal={resetSignal}
                quality={quality}
                measuring={measuring}
                points={points}
                onPick={addPoint}
                initialCamera={initialCamera}
                onCameraChange={handleCameraChange}
                onQualityFallback={handleFallback}
              />
            </SceneErrorBoundary>
          )}

          {isOpen && !Scene && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
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

          {showHint && Scene && !loadError && !measuring && <HowToOverlay onDone={() => setShowHint(false)} />}

          {measuring && (
            <div className="absolute bottom-3 left-3 z-10 max-w-[85%] bg-background/85 border border-border px-3 py-2 text-xs">
              <p className="text-foreground font-medium">
                Measurement mode — tap {points.length < 2 ? "2 points for a distance" : "a 3rd point for an angle"}
              </p>
              <p className="text-muted-foreground mt-0.5">
                Points: {points.length}/3 {measurement ? `· ${measurement.value}` : ""}
              </p>
            </div>
          )}

          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => zoom(1)}
              aria-label="Zoom in"
              className="inline-flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => zoom(-1)}
              aria-label="Zoom out"
              className="inline-flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setFullscreen((f) => !f)}
              aria-pressed={fullscreen}
              aria-label={fullscreen ? "Exit fullscreen 3D view" : "Enter fullscreen 3D view"}
              className="inline-flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" aria-hidden="true" /> : <Maximize2 className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setPreset("iso");
                setExploded(false);
                setInitialCamera(null);
                setResetSignal((k) => k + 1);
                persistView({ preset: "iso", camera: undefined });
              }}
              aria-label="Reset camera view"
              className="inline-flex items-center gap-1.5 px-3 h-11 sm:h-9 text-xs bg-background/80 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          {fullscreen && (
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Exit fullscreen"
              className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-4 h-11 text-xs bg-background/90 border border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Exit fullscreen
            </button>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-border space-y-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Camera view presets">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => changePreset(p.id)}
                aria-pressed={preset === p.id}
                aria-label={`${p.label} view`}
                className={`${toggleBase} ${preset === p.id ? activeCls : idleCls}`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setExploded((e) => !e)}
              aria-pressed={exploded}
              aria-label="Toggle exploded assembly view"
              className={`inline-flex items-center gap-1.5 ${toggleBase} ${exploded ? activeCls : idleCls}`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              Exploded
            </button>
            <button
              type="button"
              onClick={() => {
                setMeasuring((m) => !m);
                setPoints([]);
              }}
              aria-pressed={measuring}
              aria-label="Toggle measurement mode"
              className={`inline-flex items-center gap-1.5 ${toggleBase} ${measuring ? activeCls : idleCls}`}
            >
              <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
              Measure
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Model quality">
            <span className="text-xs text-muted-foreground mr-1">Quality:</span>
            {qualities.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => changeQuality(q)}
                aria-pressed={quality === q}
                aria-label={`${q} quality`}
                className={`${toggleBase} capitalize ${quality === q ? activeCls : idleCls}`}
              >
                {q}
              </button>
            ))}
            {autoDropped && (
              <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
                Auto-reduced for smoother performance.
              </span>
            )}
          </div>

          {measuring && (
            <div className="border border-border p-3 space-y-2 bg-secondary/20">
              <p className="text-xs text-foreground" role="status" aria-live="polite">
                {measurement
                  ? `${measurement.kind === "distance" ? "Distance" : "Angle"}: ${measurement.value}`
                  : "Tap the model to place points (2 = distance, 3 = angle)."}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this measurement"
                  aria-label="Measurement note"
                  className="flex-1 h-10 px-3 text-xs bg-background border border-border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveMeasurement} disabled={!measurement} className="h-10">
                    Save measurement
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPoints([])} className="h-10">
                    Clear points
                  </Button>
                </div>
              </div>

              {saved.length > 0 && (
                <ul className="space-y-1 pt-1" aria-label="Saved measurements">
                  {saved.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-xs border border-border bg-background px-2 py-1.5">
                      <Ruler className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                      <span className="text-foreground font-medium">{m.value}</span>
                      {m.note && <span className="text-muted-foreground truncate">— {m.note}</span>}
                      <button
                        type="button"
                        onClick={() => deleteMeasurement(m.id)}
                        aria-label={`Delete measurement ${m.value}`}
                        className="ml-auto p-1.5 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
              viewing and measurements are indicative only — not a manufacturing-accurate release.
              Redistribution or commercial use is not permitted.
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
