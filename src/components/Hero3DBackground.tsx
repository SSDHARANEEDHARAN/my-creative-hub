import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const mousePos = { x: 0, y: 0 };

const MouseTracker = () => {
  const { size } = useThree();
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.x = (e.clientX / size.width - 0.5) * 2;
      mousePos.y = -(e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);
  return null;
};

/* ── DNA-style double helix ── */
const DoubleHelix = ({ count = 40 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spheresA = useRef<THREE.InstancedMesh>(null);
  const spheresB = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const linePos = useMemo(() => new Float32Array(count * 6), [count]);

  useFrame((state) => {
    if (!groupRef.current || !spheresA.current || !spheresB.current || !linesRef.current) return;

    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y += (mousePos.x * 0.1 - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (mousePos.y * 0.05 - groupRef.current.rotation.x) * 0.02;

    const radius = 2.5;
    const spacing = 0.5;
    const offset = count * spacing * 0.5;

    for (let i = 0; i < count; i++) {
      const y = i * spacing - offset;
      const angle = i * 0.3 + t * 0.2;

      const ax = Math.cos(angle) * radius;
      const az = Math.sin(angle) * radius - 5;
      const bx = Math.cos(angle + Math.PI) * radius;
      const bz = Math.sin(angle + Math.PI) * radius - 5;

      const scale = 0.08 + Math.sin(t * 0.8 + i * 0.2) * 0.03;

      dummy.position.set(ax, y, az);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      spheresA.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(bx, y, bz);
      dummy.updateMatrix();
      spheresB.current.setMatrixAt(i, dummy.matrix);

      // Connection lines
      linePos[i * 6] = ax;
      linePos[i * 6 + 1] = y;
      linePos[i * 6 + 2] = az;
      linePos[i * 6 + 3] = bx;
      linePos[i * 6 + 4] = y;
      linePos[i * 6 + 5] = bz;
    }

    spheresA.current.instanceMatrix.needsUpdate = true;
    spheresB.current.instanceMatrix.needsUpdate = true;
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.1]}>
      <instancedMesh ref={spheresA} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </instancedMesh>
      <instancedMesh ref={spheresB} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.4} metalness={0.9} roughness={0.1} />
      </instancedMesh>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count * 2} array={linePos} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
};

/* ── Floating geometric shapes ── */
const GeoShape = ({ position, geoType, scale, rotSpeed }: {
  position: [number, number, number]; geoType: "octa" | "tetra" | "dodeca"; scale: number; rotSpeed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * rotSpeed;
    ref.current.rotation.y = state.clock.elapsedTime * rotSpeed * 0.7;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.4;
  });

  const geo = geoType === "octa"
    ? <octahedronGeometry args={[1, 0]} />
    : geoType === "tetra"
    ? <tetrahedronGeometry args={[1, 0]} />
    : <dodecahedronGeometry args={[1, 0]} />;

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geo}
      <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.08} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

/* ── Sweeping light beam ── */
const LightBeam = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.025 + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
  });
  return (
    <mesh ref={ref} position={[0, 0, -8]}>
      <planeGeometry args={[0.3, 30]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} />
    </mesh>
  );
};

/* ── Concentric pulse rings ── */
const PulseRings = ({ count = 3 }: { count?: number }) => {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (state.clock.elapsedTime * 0.3 + i * 1.5) % 4;
      const s = 0.5 + t * 1.2;
      mesh.scale.set(s, s, s);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.08 * (1 - t / 4));
    });
  });
  return (
    <group position={[0, 0, -6]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.01, 16, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
};

/* ── Subtle dust particles ── */
const Dust = ({ count = 50 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#999999" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

/* ── Scenes ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.1} />
    <directionalLight position={[3, 5, 4]} intensity={0.15} />
    <pointLight position={[-5, 2, -3]} intensity={0.08} color="#ffffff" />

    <DoubleHelix count={40} />

    <GeoShape position={[-6, 2, -4]} geoType="octa" scale={0.8} rotSpeed={0.15} />
    <GeoShape position={[6, -2, -5]} geoType="tetra" scale={0.6} rotSpeed={-0.2} />
    <GeoShape position={[-4, -3, -6]} geoType="dodeca" scale={0.5} rotSpeed={0.12} />
    <GeoShape position={[5, 3, -7]} geoType="octa" scale={0.4} rotSpeed={-0.18} />

    <LightBeam />
    <PulseRings count={3} />
    <Dust count={60} />
  </>
);

const MobileScene = () => (
  <>
    <ambientLight intensity={0.1} />
    <directionalLight position={[3, 5, 4]} intensity={0.12} />
    <DoubleHelix count={20} />
    <Dust count={20} />
  </>
);

const Hero3DBackground = () => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? "low-power" : "default" }}
        style={{ background: "transparent" }}
      >
        {isMobile ? <MobileScene /> : <FullScene />}
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;
