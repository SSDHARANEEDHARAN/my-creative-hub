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

/* ── Neural Brain Core ── */
const BrainCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;

    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.15;
      innerRef.current.rotation.z = t * 0.1;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.05;
      outerRef.current.rotation.x = t * 0.08;
    }
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.08;
      pulseRef.current.scale.setScalar(pulse);
      const mat = pulseRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.06 + Math.sin(t * 2) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.3, -2]}>
      {/* Inner icosahedron - neural structure */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#4fc3f7" wireframe transparent opacity={0.25} emissive="#4fc3f7" emissiveIntensity={0.3} />
      </mesh>
      {/* Outer dodecahedron shell */}
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#7c4dff" wireframe transparent opacity={0.1} emissive="#7c4dff" emissiveIntensity={0.2} />
      </mesh>
      {/* Pulse sphere */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.05} emissive="#4fc3f7" emissiveIntensity={0.15} side={THREE.BackSide} />
      </mesh>
      {/* Core glow */}
      <pointLight color="#4fc3f7" intensity={0.6} distance={8} />
    </group>
  );
};

/* ── Orbital Gear Rings ── */
const GearRing = ({ radius, speed, tilt, color, tubeRadius = 0.015 }: {
  radius: number; speed: number; tilt: [number, number, number]; color: string; tubeRadius?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} position={[0, 0.3, -2]} rotation={tilt}>
      <torusGeometry args={[radius, tubeRadius, 16, 64]} />
      <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.4} metalness={1} roughness={0} />
    </mesh>
  );
};

/* ── Data Stream Particles ── */
const DataStreams = ({ count = 120 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const palette = [
      [0.31, 0.76, 0.97], // cyan
      [0.49, 0.30, 1.0],  // purple
      [0.30, 0.90, 0.55], // green
    ];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 6;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = Math.sin(angle) * r - 4;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
      spd[i] = 0.3 + Math.random() * 0.8;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      // Spiral inward flow
      const angle = Math.atan2(pos[i * 3 + 2] + 4, pos[i * 3]) + 0.003 * speeds[i];
      const r = Math.sqrt(pos[i * 3] ** 2 + (pos[i * 3 + 2] + 4) ** 2);
      const newR = r - 0.008 * speeds[i];
      if (newR < 0.5) {
        const resetAngle = Math.random() * Math.PI * 2;
        const resetR = 5 + Math.random() * 3;
        pos[i * 3] = Math.cos(resetAngle) * resetR;
        pos[i * 3 + 2] = Math.sin(resetAngle) * resetR - 4;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      } else {
        pos[i * 3] = Math.cos(angle) * newR;
        pos[i * 3 + 2] = Math.sin(angle) * newR - 4;
        pos[i * 3 + 1] += Math.sin(t + i) * 0.003;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

/* ── Holographic UI Panel ── */
const HoloPanel = ({ position, width, height, rotation, label }: {
  position: [number, number, number]; width: number; height: number; rotation: [number, number, number]; label: string;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.15;
    if (matRef.current) {
      matRef.current.opacity = 0.06 + Math.sin(t * 0.8 + position[2]) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial ref={matRef} color="#4fc3f7" transparent opacity={0.06} emissive="#4fc3f7" emissiveIntensity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Border lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#4fc3f7" transparent opacity={0.2} />
      </lineSegments>
      {/* Scan line */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 0.9, 0.01]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

/* ── Robotic Arm Silhouette ── */
const RoboticArm = ({ position, scale, speed }: {
  position: [number, number, number]; scale: number; speed: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const joint1 = useRef<THREE.Group>(null);
  const joint2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !joint1.current || !joint2.current) return;
    const t = state.clock.elapsedTime * speed;
    joint1.current.rotation.z = Math.sin(t) * 0.3;
    joint2.current.rotation.z = Math.sin(t * 1.3 + 1) * 0.4;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.15, 8]} />
        <meshStandardMaterial color="#666" transparent opacity={0.15} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Arm segment 1 */}
      <group ref={joint1} position={[0, 0.15, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#888" transparent opacity={0.12} wireframe />
        </mesh>
        {/* Joint */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#4fc3f7" transparent opacity={0.3} emissive="#4fc3f7" emissiveIntensity={0.5} />
        </mesh>
        {/* Arm segment 2 */}
        <group ref={joint2} position={[0, 0.8, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.04, 0.6, 0.04]} />
            <meshStandardMaterial color="#888" transparent opacity={0.12} wireframe />
          </mesh>
          {/* End effector */}
          <mesh position={[0, 0.6, 0]}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color="#7c4dff" transparent opacity={0.4} emissive="#7c4dff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/* ── Grid Floor ── */
const GridFloor = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -4, -3]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial color="#4fc3f7" wireframe transparent opacity={0.04} />
    </mesh>
  );
};

/* ── Ambient Fog Particles ── */
const FogParticles = ({ count = 40 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = -8 - Math.random() * 10;
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
      <pointsMaterial size={0.8} color="#4fc3f7" transparent opacity={0.03} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

/* ── Main Group with parallax ── */
const MainGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (mousePos.x * 0.08 - ref.current.rotation.y) * 0.02;
    ref.current.rotation.x += (mousePos.y * 0.04 - ref.current.rotation.x) * 0.02;
  });
  return <group ref={ref}>{children}</group>;
};

/* ── Scenes ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.08} />
    <directionalLight position={[5, 5, 5]} intensity={0.12} color="#b3e5fc" />
    <pointLight position={[-6, 3, -2]} intensity={0.15} color="#7c4dff" distance={15} />
    <pointLight position={[6, -2, -3]} intensity={0.1} color="#69f0ae" distance={12} />
    <fog attach="fog" args={["#000000", 12, 28]} />

    <MainGroup>
      <BrainCore />

      {/* Orbital rings */}
      <GearRing radius={2.8} speed={0.1} tilt={[0.5, 0, 0]} color="#4fc3f7" />
      <GearRing radius={3.3} speed={-0.07} tilt={[1.2, 0.3, 0]} color="#7c4dff" tubeRadius={0.01} />
      <GearRing radius={3.8} speed={0.05} tilt={[0.8, -0.5, 0.2]} color="#69f0ae" tubeRadius={0.008} />

      {/* Data streams */}
      <DataStreams count={100} />

      {/* Robotic arms */}
      <RoboticArm position={[-4, -2, -4]} scale={1.5} speed={0.4} />
      <RoboticArm position={[4.5, -2, -5]} scale={1.2} speed={0.3} />
      <RoboticArm position={[-2, -2.5, -6]} scale={1} speed={0.5} />

      {/* Holo panels */}
      <HoloPanel position={[-5, 1.5, -4]} width={1.8} height={1.2} rotation={[0, 0.4, 0]} label="CAD" />
      <HoloPanel position={[5.5, 2, -5]} width={1.5} height={1} rotation={[0, -0.3, 0.05]} label="Metrics" />
      <HoloPanel position={[-3, -1, -7]} width={1.2} height={0.8} rotation={[0.1, 0.2, 0]} label="Code" />
      <HoloPanel position={[3, -0.5, -6]} width={1.4} height={0.9} rotation={[0, -0.5, -0.05]} label="System" />
    </MainGroup>

    <GridFloor />
    <FogParticles count={30} />
  </>
);

const MobileScene = () => (
  <>
    <ambientLight intensity={0.08} />
    <directionalLight position={[5, 5, 5]} intensity={0.1} color="#b3e5fc" />
    <fog attach="fog" args={["#000000", 10, 22]} />
    <BrainCore />
    <GearRing radius={2.8} speed={0.08} tilt={[0.5, 0, 0]} color="#4fc3f7" />
    <GearRing radius={3.3} speed={-0.05} tilt={[1.2, 0.3, 0]} color="#7c4dff" tubeRadius={0.01} />
    <DataStreams count={40} />
    <GridFloor />
  </>
);

const Hero3DBackground = () => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 1, 10], fov: 50, near: 0.1, far: 30 }}
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
