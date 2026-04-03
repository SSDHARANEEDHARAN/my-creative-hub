import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Mouse tracker ── */
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

/* ── Connected node network ── */
const NetworkNodes = ({ count = 50 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, velocities } = useMemo(() => {
    const n: number[] = [];
    const v: number[] = [];
    for (let i = 0; i < count; i++) {
      n.push(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 3
      );
      v.push(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.003
      );
    }
    return { nodes: new Float32Array(n), velocities: v };
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * count * 6), [count]);
  const lineColors = useMemo(() => new Float32Array(count * count * 6), [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return;

    groupRef.current.rotation.y += (mousePos.x * 0.12 - groupRef.current.rotation.y) * 0.015;
    groupRef.current.rotation.x += (mousePos.y * 0.08 - groupRef.current.rotation.x) * 0.015;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      if (Math.abs(positions[i * 3]) > 9) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 6) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2] + 3) > 4) velocities[i * 3 + 2] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    const maxDist = 3.5;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.2;
          linePositions[lineIdx * 6] = positions[i * 3];
          linePositions[lineIdx * 6 + 1] = positions[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = positions[i * 3 + 2];
          linePositions[lineIdx * 6 + 3] = positions[j * 3];
          linePositions[lineIdx * 6 + 4] = positions[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = positions[j * 3 + 2];
          const c = 0.4 + alpha;
          for (let k = 0; k < 6; k++) lineColors[lineIdx * 6 + k] = c;
          lineIdx++;
        }
      }
    }

    const lineGeo = linesRef.current.geometry;
    lineGeo.setDrawRange(0, lineIdx * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={nodes} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lineColors.length / 3} array={lineColors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
};

/* ── Floating ring ── */
const FloatingRing = ({ position, scale, speed, axis }: {
  position: [number, number, number]; scale: number; speed: number; axis: "x" | "y" | "z";
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation[axis] = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 64]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.1} metalness={1} roughness={0} />
    </mesh>
  );
};

/* ── Orbiting dot ── */
const OrbitDot = ({ radius, speed, offset, y }: { radius: number; speed: number; offset: number; y: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius - 4;
    ref.current.position.y = y + Math.sin(t * 2) * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} transparent opacity={0.7} />
    </mesh>
  );
};

/* ── Scene ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.12} />
    <directionalLight position={[5, 5, 5]} intensity={0.18} />
    <NetworkNodes count={45} />
    <FloatingRing position={[-3, 1, -5]} scale={1.5} speed={0.15} axis="y" />
    <FloatingRing position={[4, -1, -6]} scale={1} speed={-0.12} axis="x" />
    <FloatingRing position={[0, 2, -7]} scale={2} speed={0.08} axis="z" />
    <OrbitDot radius={3} speed={0.3} offset={0} y={0.5} />
    <OrbitDot radius={4} speed={0.2} offset={2} y={-0.5} />
    <OrbitDot radius={2.5} speed={0.4} offset={4} y={1.5} />
  </>
);

const MobileScene = () => (
  <>
    <ambientLight intensity={0.1} />
    <directionalLight position={[5, 5, 5]} intensity={0.15} />
    <NetworkNodes count={18} />
    <FloatingRing position={[0, 1, -5]} scale={1.2} speed={0.1} axis="y" />
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
        frameloop={isMobile ? "demand" : "always"}
      >
        {isMobile ? <MobileScene /> : <FullScene />}
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;
