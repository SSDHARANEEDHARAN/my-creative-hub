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

/* ── Central parametric structure ── */
const ParametricCore = () => {
  const primaryRef = useRef<THREE.Mesh>(null);
  const secondaryRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (primaryRef.current) {
      primaryRef.current.rotation.y = t * 0.04;
      primaryRef.current.rotation.x = Math.sin(t * 0.06) * 0.08;
    }
    if (secondaryRef.current) {
      secondaryRef.current.rotation.y = -t * 0.025;
      secondaryRef.current.rotation.z = t * 0.03;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.06;
      innerRef.current.rotation.x = -t * 0.04;
      const s = 1 + Math.sin(t * 0.8) * 0.02;
      innerRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.025 + Math.sin(t * 0.6) * 0.01;
      const gs = 1 + Math.sin(t * 0.5) * 0.03;
      glowRef.current.scale.setScalar(gs);
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Primary icosahedron mesh — the hero shape */}
      <mesh ref={primaryRef}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          wireframe
          transparent
          opacity={0.18}
          metalness={1}
          roughness={0.15}
          emissive="#3a7bd5"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Secondary dodecahedron — offset rotation */}
      <mesh ref={secondaryRef}>
        <dodecahedronGeometry args={[1.9, 0]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          wireframe
          transparent
          opacity={0.07}
          metalness={1}
          roughness={0.1}
          emissive="#6c5ce7"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Inner octahedron — precision core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color="#2d3436"
          transparent
          opacity={0.15}
          metalness={0.95}
          roughness={0.05}
          emissive="#3a7bd5"
          emissiveIntensity={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Soft glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#3a7bd5"
          transparent
          opacity={0.025}
          emissive="#3a7bd5"
          emissiveIntensity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Core point light */}
      <pointLight color="#3a7bd5" intensity={0.25} distance={8} decay={2} />
    </group>
  );
};

/* ── Orbital constraint rings ── */
const OrbitRing = ({ radius, speed, tilt, color, opacity = 0.08 }: {
  radius: number; speed: number; tilt: [number, number, number]; color: string; opacity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} position={[0, 0.2, 0]} rotation={tilt}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
};

/* ── Constraint nodes on rings ── */
const ConstraintNodes = ({ count = 12 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const nodeData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const ring = Math.floor(Math.random() * 3);
      const radii = [2.8, 3.4, 4.0];
      const r = radii[ring];
      const tilts = [0.4, 0.9, 0.2];
      const tiltAngle = tilts[ring];
      return { angle, radius: r, tiltAngle, speed: 0.02 + Math.random() * 0.02 };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const nd = nodeData[i];
      const a = nd.angle + t * nd.speed;
      child.position.x = Math.cos(a) * nd.radius;
      child.position.y = Math.sin(a) * nd.radius * Math.sin(nd.tiltAngle) + 0.2;
      child.position.z = Math.sin(a) * nd.radius * Math.cos(nd.tiltAngle);
    });
  });

  return (
    <group ref={groupRef}>
      {nodeData.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.35}
            emissive="#3a7bd5"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ── Subtle ambient particles ── */
const AmbientDust = ({ count = 35 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#6c7a89" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
};

/* ── Parallax wrapper ── */
const ParallaxGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (mousePos.x * 0.06 - ref.current.rotation.y) * 0.015;
    ref.current.rotation.x += (mousePos.y * 0.03 - ref.current.rotation.x) * 0.015;
  });
  return <group ref={ref}>{children}</group>;
};

/* ── Full scene ── */
const FullScene = () => (
  <>
    <MouseTracker />

    {/* Lighting — cinematic, controlled */}
    <ambientLight intensity={0.04} />
    <directionalLight position={[4, 3, 5]} intensity={0.1} color="#b8c6db" />
    <directionalLight position={[-3, 2, -4]} intensity={0.06} color="#6c5ce7" />
    <pointLight position={[0, 5, 3]} intensity={0.08} color="#3a7bd5" distance={15} decay={2} />

    {/* Depth fog */}
    <fog attach="fog" args={["#0a0a0f", 8, 25]} />

    <ParallaxGroup>
      <ParametricCore />

      {/* Orbital rings */}
      <OrbitRing radius={2.8} speed={0.03} tilt={[0.4, 0, 0]} color="#3a7bd5" opacity={0.07} />
      <OrbitRing radius={3.4} speed={-0.02} tilt={[0.9, 0.2, 0]} color="#6c5ce7" opacity={0.05} />
      <OrbitRing radius={4.0} speed={0.015} tilt={[0.2, -0.3, 0.1]} color="#3a7bd5" opacity={0.04} />

      {/* Constraint nodes */}
      <ConstraintNodes count={10} />
    </ParallaxGroup>

    <AmbientDust count={30} />
  </>
);

/* ── Mobile scene ── */
const MobileScene = () => (
  <>
    <ambientLight intensity={0.04} />
    <directionalLight position={[4, 3, 5]} intensity={0.08} color="#b8c6db" />
    <fog attach="fog" args={["#0a0a0f", 6, 20]} />
    <ParametricCore />
    <OrbitRing radius={2.8} speed={0.025} tilt={[0.4, 0, 0]} color="#3a7bd5" opacity={0.06} />
    <AmbientDust count={15} />
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
