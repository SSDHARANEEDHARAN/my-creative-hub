import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

export type ViewPreset = "iso" | "front" | "side" | "top";

interface SceneProps {
  url: string;
  preset: ViewPreset;
  exploded: boolean;
  zoomSignal: { dir: number; n: number };
  resetSignal: number;
}

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

const Model = ({ url, exploded }: { url: string; exploded: boolean }) => {
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

  return <primitive object={scene} />;
};

const CameraRig = ({ preset, zoomSignal, resetSignal }: Omit<SceneProps, "url" | "exploded">) => {
  const { camera, controls } = useThree() as any;
  const first = useRef(true);

  useEffect(() => {
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
    if (first.current) {
      first.current = false;
      return;
    }
    const factor = zoomSignal.dir > 0 ? 0.82 : 1.22;
    camera.position.multiplyScalar(factor);
    controls?.update?.();
  }, [zoomSignal, camera, controls]);

  return null;
};

const Model3DScene = ({ url, preset, exploded, zoomSignal, resetSignal }: SceneProps) => (
  <Canvas camera={{ position: [1.6, 1.1, 1.6], fov: 45 }} dpr={[1, 1.6]}>
    <color attach="background" args={["#0b0b0b"]} />
    <Suspense fallback={<Loader />}>
      <Stage intensity={0.6} environment="city" adjustCamera={1.1} shadows={false}>
        <Model url={url} exploded={exploded} />
      </Stage>
    </Suspense>
    <OrbitControls makeDefault enableDamping dampingFactor={0.08} enableZoom enablePan />
    <CameraRig preset={preset} zoomSignal={zoomSignal} resetSignal={resetSignal} />
  </Canvas>
);

export default Model3DScene;
