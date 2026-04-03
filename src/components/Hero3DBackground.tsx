import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Slowly rotating wireframe icosahedron ── */
const WireIco = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * speed * 0.15;
      ref.current.rotation.y += d * speed * 0.1;
    }
  });
  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.12} metalness={1} roughness={0.1} />
      </mesh>
    </Float>
  );
};

/* ── Thin wireframe torus (gear-like) ── */
const WireTorus = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * speed;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.15, 6, 6]} />
      <meshStandardMaterial color="#999999" wireframe transparent opacity={0.1} metalness={0.9} roughness={0.2} />
    </mesh>
  );
};

/* ── Wireframe octahedron ── */
const WireOcta = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * speed * 0.12;
      ref.current.rotation.x += d * speed * 0.08;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#cccccc" wireframe transparent opacity={0.1} metalness={0.8} roughness={0.3} />
      </mesh>
    </Float>
  );
};

/* ── Perspective grid plane ── */
const GridPlane = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -4, -2]}>
      <planeGeometry args={[50, 50, 60, 60]} />
      <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.04} />
    </mesh>
  );
};

/* ── Floating dots ── */
const Dots = ({ count = 60 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#888888" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

/* ── Scene ── */
const Scene = () => (
  <>
    <ambientLight intensity={0.2} />
    <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
    <pointLight position={[-4, 3, -3]} intensity={0.15} color="#aaaaaa" />

    {/* Large central icosahedron */}
    <WireIco position={[0, 0.5, -6]} scale={2} speed={0.3} />

    {/* Smaller scattered shapes */}
    <WireIco position={[-5, 2, -4]} scale={0.7} speed={0.5} />
    <WireIco position={[6, -1, -5]} scale={0.5} speed={-0.4} />

    {/* Torus rings */}
    <WireTorus position={[-3, -1.5, -3]} scale={0.6} speed={0.15} />
    <WireTorus position={[4, 2.5, -5]} scale={0.9} speed={-0.1} />
    <WireTorus position={[7, -2, -7]} scale={0.4} speed={0.2} />

    {/* Octahedrons */}
    <WireOcta position={[-6, -2, -6]} scale={0.8} speed={0.4} />
    <WireOcta position={[3, 3, -8]} scale={0.6} speed={-0.3} />

    {/* Grid & dots */}
    <GridPlane />
    <Dots count={80} />
  </>
);

const Hero3DBackground = () => (
  <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  </div>
);

export default Hero3DBackground;
