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

/* ── Wireframe Torus Knot — flowing topology ── */
const TorusKnotCore = () => {
  const knotRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (knotRef.current) {
      knotRef.current.rotation.y = t * 0.035;
      knotRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.02;
      shellRef.current.rotation.z = t * 0.015;
      const mat = shellRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.04 + Math.sin(t * 0.7) * 0.02;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Primary torus knot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.3, 0.35, 128, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#0d0d12"
          wireframe
          transparent
          opacity={0.14}
          metalness={1}
          roughness={0.1}
          emissive="#4a90d9"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Outer sphere shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshPhysicalMaterial
          color="#0d0d12"
          wireframe
          transparent
          opacity={0.05}
          metalness={1}
          roughness={0.05}
          emissive="#7c6bc4"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Inner glow */}
      <pointLight color="#4a90d9" intensity={0.2} distance={6} decay={2} />
    </group>
  );
};

/* ── Floating grid planes ── */
const FloatingGrid = ({ position, rotation, size = 3 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  size?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0]) * 0.15;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[size, size, 8, 8]} />
      <meshStandardMaterial
        color="#1a1a2e"
        wireframe
        transparent
        opacity={0.04}
        emissive="#4a90d9"
        emissiveIntensity={0.03}
      />
    </mesh>
  );
};

/* ── Floating data lines ── */
const DataLines = ({ count = 6 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const linesData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points: THREE.Vector3[] = [];
      const startX = (Math.random() - 0.5) * 12;
      const startY = (Math.random() - 0.5) * 8;
      const startZ = -2 - Math.random() * 4;
      for (let j = 0; j < 20; j++) {
        points.push(new THREE.Vector3(
          startX + j * 0.3,
          startY + Math.sin(j * 0.5 + i) * 0.3,
          startZ
        ));
      }
      return { points, speed: 0.01 + Math.random() * 0.015 };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const line = child as THREE.Line;
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 0.5 + i * 1.5) * 0.03;
    });
  });

  return (
    <group ref={groupRef}>
      {linesData.map((data, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(data.points);
        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#4a90d9", transparent: true, opacity: 0.06 }))} />
        );
      })}
    </group>
  );
};

/* ── Hex grid particles ── */
const HexParticles = ({ count = 40 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.004;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#8b9dc3" transparent opacity={0.25} sizeAttenuation />
    </points>
  );
};

/* ── Parallax wrapper ── */
const ParallaxGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (mousePos.x * 0.05 - ref.current.rotation.y) * 0.012;
    ref.current.rotation.x += (mousePos.y * 0.025 - ref.current.rotation.x) * 0.012;
  });
  return <group ref={ref}>{children}</group>;
};

/* ── Full scene ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.03} />
    <directionalLight position={[5, 4, 6]} intensity={0.08} color="#b8c6db" />
    <directionalLight position={[-4, 2, -5]} intensity={0.04} color="#7c6bc4" />
    <pointLight position={[0, 6, 4]} intensity={0.06} color="#4a90d9" distance={18} decay={2} />
    <fog attach="fog" args={["#08080f", 7, 22]} />

    <ParallaxGroup>
      <TorusKnotCore />
      <FloatingGrid position={[-4, -1.5, -3]} rotation={[0.3, 0.5, 0]} size={4} />
      <FloatingGrid position={[4.5, 1, -4]} rotation={[-0.2, -0.4, 0.1]} size={3} />
      <FloatingGrid position={[-2, 2.5, -5]} rotation={[0.5, 0.2, -0.1]} size={2.5} />
      <DataLines count={5} />
    </ParallaxGroup>

    <HexParticles count={35} />
  </>
);

/* ── Mobile scene ── */
const MobileScene = () => (
  <>
    <ambientLight intensity={0.03} />
    <directionalLight position={[4, 3, 5]} intensity={0.06} color="#b8c6db" />
    <fog attach="fog" args={["#08080f", 5, 18]} />
    <TorusKnotCore />
    <HexParticles count={15} />
  </>
);

const Hero3DBackground = () => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 45, near: 0.1, far: 30 }}
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
