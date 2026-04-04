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

/* ── Breathing Core Glow ── */
const CoreGlow = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 0.8) * 0.15;
    meshRef.current.scale.setScalar(scale);
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = 0.4 + Math.sin(t * 1.2) * 0.3;
    mat.opacity = 0.3 + Math.sin(t * 0.8) * 0.15;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshPhysicalMaterial
        color="#4a90d9"
        emissive="#4a90d9"
        emissiveIntensity={0.6}
        transparent
        opacity={0.4}
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
};

/* ── Geodesic Sphere Shell ── */
const GeodesicShell = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.03;
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.z = t * 0.02;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.04;
      innerRef.current.rotation.y = -t * 0.06;
      const scale = 1 + Math.sin(t * 0.5) * 0.05;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Outer wireframe icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshPhysicalMaterial
          wireframe
          color="#0d1117"
          emissive="#4a90d9"
          emissiveIntensity={0.15}
          transparent
          opacity={0.2}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      {/* Inner rotating dodecahedron */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          wireframe
          color="#0d1117"
          emissive="#7c6bc4"
          emissiveIntensity={0.2}
          transparent
          opacity={0.25}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      {/* Core glow sphere with breathing pulse */}
      <CoreGlow />
    </group>
  );
};

/* ── Orbiting Rings ── */
const OrbitalRings = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 3;
      ring1.current.rotation.z = t * 0.12;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 1.8;
      ring2.current.rotation.y = t * 0.1;
    }
    if (ring3.current) {
      ring3.current.rotation.y = Math.PI / 4;
      ring3.current.rotation.z = -t * 0.08;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={ring1}>
        <torusGeometry args={[2.5, 0.008, 8, 100]} />
        <meshPhysicalMaterial emissive="#4a90d9" emissiveIntensity={0.3} transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.8, 0.006, 8, 100]} />
        <meshPhysicalMaterial emissive="#7c6bc4" emissiveIntensity={0.25} transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[3.2, 0.005, 8, 100]} />
        <meshPhysicalMaterial emissive="#3a6b9f" emissiveIntensity={0.2} transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

/* ── Floating Vertices ── */
const FloatingVertices = ({ count = 40 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 2;
      spd[i] = 0.2 + Math.random() * 0.5;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.001;
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = t * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#5ba3e6" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
};

/* ── Connection Lines between random points ── */
const ConnectionWeb = ({ count = 12 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: count }, () => {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = 2 + Math.random() * 2;
      const theta2 = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(2 * Math.random() - 1);
      const r2 = 2 + Math.random() * 2;
      return [
        new THREE.Vector3(r1 * Math.sin(phi1) * Math.cos(theta1), r1 * Math.sin(phi1) * Math.sin(theta1), r1 * Math.cos(phi1)),
        new THREE.Vector3(r2 * Math.sin(phi2) * Math.cos(theta2), r2 * Math.sin(phi2) * Math.sin(theta2), r2 * Math.cos(phi2)),
      ];
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.006;
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
      if (mat) mat.opacity = 0.03 + Math.sin(t * 0.3 + i * 0.8) * 0.02;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((pts, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#4a90d9", transparent: true, opacity: 0.04 }))}
          />
        );
      })}
    </group>
  );
};

/* ── Parallax wrapper ── */
const ParallaxGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (mousePos.x * 0.08 - ref.current.rotation.y) * 0.012;
    ref.current.rotation.x += (mousePos.y * 0.04 - ref.current.rotation.x) * 0.012;
  });
  return <group ref={ref}>{children}</group>;
};

/* ── Full scene ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.02} />
    <directionalLight position={[5, 4, 6]} intensity={0.06} color="#b8c6db" />
    <directionalLight position={[-4, 2, -5]} intensity={0.03} color="#7c6bc4" />
    <pointLight position={[0, 0, 4]} intensity={0.1} color="#4a90d9" distance={12} decay={2} />
    <pointLight position={[2, -2, 2]} intensity={0.05} color="#7c6bc4" distance={10} decay={2} />
    <fog attach="fog" args={["#08080f", 6, 22]} />

    <ParallaxGroup>
      <GeodesicShell />
      <OrbitalRings />
      <ConnectionWeb count={12} />
    </ParallaxGroup>

    <FloatingVertices count={40} />
  </>
);

/* ── Mobile scene ── */
const MobileScene = () => (
  <>
    <ambientLight intensity={0.03} />
    <directionalLight position={[4, 3, 5]} intensity={0.06} color="#b8c6db" />
    <pointLight position={[0, 0, 4]} intensity={0.08} color="#4a90d9" distance={10} decay={2} />
    <fog attach="fog" args={["#08080f", 5, 16]} />
    <GeodesicShell />
    <FloatingVertices count={15} />
  </>
);

const Hero3DBackground = () => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 48, near: 0.1, far: 30 }}
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
