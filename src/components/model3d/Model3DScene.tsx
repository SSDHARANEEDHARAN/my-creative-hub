import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Html, useProgress, Line, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

export type ViewPreset = "iso" | "front" | "side" | "top";
export type ModelQuality = "low" | "medium" | "high";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

export interface SceneProps {
  url: string;
  preset: ViewPreset;
  exploded: boolean;
  zoomSignal: { dir: number; n: number };
  resetSignal: number;
  quality?: ModelQuality;
  measuring?: boolean;
  points?: [number, number, number][];
  onPick?: (p: [number, number, number]) => void;
  initialCamera?: CameraState | null;
  onCameraChange?: (c: CameraState) => void;
  onQualityFallback?: () => void;
}

const qualitySettings: Record<ModelQuality, { dpr: [number, number]; antialias: boolean; env: boolean }> = {
  low: { dpr: [0.6, 1], antialias: false, env: false },
  medium: { dpr: [1, 1.5], antialias: true, env: true },
  high: { dpr: [1, 2], antialias: true, env: true },
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-muted-foreground w-40">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
        <span className="text-xs tracking-wide uppercase">Loading model… {Math.round(progress)}%</span>
        <div className="w-full h-1 bg-border overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Html>
  );
};

const Model = ({
  url,
  exploded,
  measuring,
  onPick,
}: {
  url: string;
  exploded: boolean;
  measuring?: boolean;
  onPick?: (p: [number, number, number]) => void;
}) => {
  const { scene } = useGLTF(url, true);

  const originals = useMemo(() => {
    const map = new Map<THREE.Object3D, THREE.Vector3>();
    scene.children.forEach((c) => map.set(c, c.position.clone()));
    return map;
  }, [scene]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    originals.forEach((orig, obj) => {
      if (!exploded) {
        obj.position.copy(orig);
        return;
      }
      const objCenter = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
      const dir = objCenter.sub(center);
      if (dir.lengthSq() === 0) dir.set(0, 1, 0);
      obj.position.copy(orig).add(dir.normalize().multiplyScalar(box.getSize(new THREE.Vector3()).length() * 0.18));
    });
  }, [exploded, scene, originals]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!measuring || !onPick) return;
    e.stopPropagation();
    onPick([e.point.x, e.point.y, e.point.z]);
  };

  return (
    <group onPointerDown={handleClick as never}>
      <primitive object={scene} />
    </group>
  );
};

/** Markers + connecting lines for measurement mode. */
const Measurements = ({ points }: { points: [number, number, number][] }) => {
  const { camera } = useThree();
  const size = useMemo(() => camera.position.length() * 0.012 || 0.02, [camera]);
  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color="#ff3b30" />
        </mesh>
      ))}
      {points.length > 1 && (
        <Line points={points.map((p) => new THREE.Vector3(...p))} color="#ff3b30" lineWidth={2} />
      )}
    </group>
  );
};

const CameraRig = ({
  preset,
  zoomSignal,
  resetSignal,
  initialCamera,
  onCameraChange,
}: Pick<SceneProps, "preset" | "zoomSignal" | "resetSignal" | "initialCamera" | "onCameraChange">) => {
  const { camera, controls } = useThree() as any;
  const firstZoom = useRef(true);
  const restored = useRef(false);
  const skipPreset = useRef(!!initialCamera);

  // Restore a previously saved camera position once the stage has framed the model.
  useEffect(() => {
    if (!initialCamera || restored.current) return;
    const t = setTimeout(() => {
      restored.current = true;
      camera.position.set(...initialCamera.position);
      controls?.target?.set(...initialCamera.target);
      camera.lookAt(...initialCamera.target);
      controls?.update?.();
    }, 450);
    return () => clearTimeout(t);
  }, [initialCamera, camera, controls]);

  useEffect(() => {
    if (skipPreset.current) {
      skipPreset.current = false;
      return;
    }
    const dist = camera.position.length() || 3;
    const dirs: Record<ViewPreset, [number, number, number]> = {
      iso: [1, 0.75, 1],
      front: [0, 0, 1],
      side: [1, 0, 0],
      top: [0, 1, 0.001],
    };
    const v = new THREE.Vector3(...dirs[preset]).normalize().multiplyScalar(dist);
    camera.position.copy(v);
    camera.lookAt(0, 0, 0);
    controls?.target?.set(0, 0, 0);
    controls?.update?.();
  }, [preset, resetSignal, camera, controls]);

  useEffect(() => {
    if (firstZoom.current) {
      firstZoom.current = false;
      return;
    }
    const factor = zoomSignal.dir > 0 ? 0.82 : 1.22;
    camera.position.multiplyScalar(factor);
    controls?.update?.();
  }, [zoomSignal, camera, controls]);

  // Report camera state so the parent can persist it per project.
  useEffect(() => {
    if (!controls || !onCameraChange) return;
    const report = () => {
      const t = controls.target as THREE.Vector3;
      onCameraChange({
        position: [camera.position.x, camera.position.y, camera.position.z],
        target: [t.x, t.y, t.z],
      });
    };
    controls.addEventListener?.("end", report);
    return () => controls.removeEventListener?.("end", report);
  }, [controls, camera, onCameraChange]);

  return null;
};

const Model3DScene = ({
  url,
  preset,
  exploded,
  zoomSignal,
  resetSignal,
  quality = "medium",
  measuring,
  points = [],
  onPick,
  initialCamera,
  onCameraChange,
  onQualityFallback,
}: SceneProps) => {
  const q = qualitySettings[quality];
  return (
    <Canvas
      camera={{ position: [1.6, 1.1, 1.6], fov: 45 }}
      dpr={q.dpr}
      gl={{ antialias: q.antialias, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0b0b0b"]} />
      <PerformanceMonitor onDecline={() => onQualityFallback?.()} />
      <Suspense fallback={<Loader />}>
        <Stage
          intensity={0.6}
          environment={q.env ? "city" : null}
          adjustCamera={1.1}
          shadows={false}
        >
          <Model url={url} exploded={exploded} measuring={measuring} onPick={onPick} />
        </Stage>
        {!q.env && (
          <>
            <ambientLight intensity={1.6} />
            <hemisphereLight intensity={0.8} />
            <directionalLight position={[3, 4, 2]} intensity={1.4} />
            <directionalLight position={[-3, 2, -2]} intensity={0.8} />
          </>
        )}
      </Suspense>
      <Measurements points={points} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} enableZoom enablePan />
      <CameraRig
        preset={preset}
        zoomSignal={zoomSignal}
        resetSignal={resetSignal}
        initialCamera={initialCamera}
        onCameraChange={onCameraChange}
      />
    </Canvas>
  );
};

export default Model3DScene;
