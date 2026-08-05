import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Html } from "@react-three/drei";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Box, Download, Hand, Loader2, MousePointer2, RotateCcw, AlertTriangle } from "lucide-react";

interface Model3DViewerProps {
  url: string;
  filename: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Model = ({ url }: { url: string }) => {
  // second arg = use the hosted Draco decoder (model is Draco compressed)
  const { scene } = useGLTF(url, true);
  return <primitive object={scene} />;
};

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-xs tracking-wide uppercase">Loading model…</span>
    </div>
  </Html>
);

/** Animated hand hint that shows how to orbit the model, then fades out. */
const HowToOverlay = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] pointer-events-none">
      <div className="relative w-40 h-16 mb-6">
        <Hand className="w-10 h-10 text-primary absolute top-2 animate-[drag-hand_2s_ease-in-out_infinite]" />
      </div>
      <p className="text-sm font-medium text-foreground">Drag to rotate</p>
      <p className="text-xs text-muted-foreground mt-1">Scroll / pinch to zoom · Right-drag to pan</p>
      <style>{`@keyframes drag-hand{0%{transform:translateX(0)}50%{transform:translateX(110px)}100%{transform:translateX(0)}}`}</style>
    </div>
  );
};

const Model3DViewer = ({ url, filename, title, isOpen, onClose }: Model3DViewerProps) => {
  const [showHint, setShowHint] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (isOpen) setShowHint(true);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg pr-8">
            <Box className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{title} — 3D View</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[55vh] sm:h-[62vh] bg-secondary/30">
          {isOpen && (
            <Canvas key={resetKey} camera={{ position: [1.6, 1.1, 1.6], fov: 45 }} dpr={[1, 1.6]}>
              <color attach="background" args={["#0b0b0b"]} />
              <Suspense fallback={<Loader />}>
                <Stage intensity={0.6} environment="city" adjustCamera={1.1} shadows={false}>
                  <Model url={url} />
                </Stage>
              </Suspense>
              <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
            </Canvas>
          )}
          {showHint && <HowToOverlay onDone={() => setShowHint(false)} />}

          <button
            onClick={() => setResetKey((k) => k + 1)}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-background/80 border border-border hover:bg-background transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset view
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-border space-y-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MousePointer2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <span>Left-drag rotates · Scroll or pinch zooms · Right-drag pans the assembly.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground border border-border p-3 bg-secondary/30">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <span>
              <strong className="text-foreground">Disclaimer:</strong> This model is shared for
              educational and portfolio review only. Geometry is simplified/decimated for web
              viewing and is not a manufacturing-accurate release. Redistribution or commercial use
              is not permitted.
            </span>
          </div>
          <a href={url} download={filename} className="block">
            <Button className="w-full sm:w-auto gap-2">
              <Download className="w-4 h-4" />
              Download 3D file (.glb)
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Model3DViewer;
