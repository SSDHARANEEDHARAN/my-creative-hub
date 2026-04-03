import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.004
      );
    }
    return { nodes: new Float32Array(n), velocities: v };
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * count * 6), [count]);
  const lineColors = useMemo(() => new Float32Array(count * count * 6), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return;

    // Mouse parallax on group
    groupRef.current.rotation.y += (mousePos.x * 0.15 - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (mousePos.y * 0.1 - groupRef.current.rotation.x) * 0.02;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Animate nodes
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Bounce
      if (Math.abs(positions[i * 3]) > 9) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 6) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2] + 3) > 4) velocities[i * 3 + 2] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Draw connections
    let lineIdx = 0;
    const maxDist = 3.5;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          linePositions[lineIdx * 6] = positions[i * 3];
          linePositions[lineIdx * 6 + 1] = positions[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = positions[i * 3 + 2];
          linePositions[lineIdx * 6 + 3] = positions[j * 3];
          linePositions[lineIdx * 6 + 4] = positions[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = positions[j * 3 + 2];

          const c = 0.5 + alpha;
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
        <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lineColors.length / 3} array={lineColors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.15} />
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
      <meshStandardMaterial color="#ffffff" transparent opacity={0.12} metalness={1} roughness={0} />
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
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.8} />
    </mesh>
  );
};

/* ── Hexagonal grid plane ── */
const HexGrid = () => {
  const ref = useRef<THREE.Group>(null);

  const hexPositions = useMemo(() => {
    const positions: [number, number][] = [];
    const size = 0.8;
    const rows = 14;
    const cols = 20;
    for (let r = -rows / 2; r < rows / 2; r++) {
      for (let c = -cols / 2; c < cols / 2; c++) {
        const x = c * size * 1.75 + (r % 2 ? size * 0.875 : 0);
        const z = r * size * 1.5;
        positions.push([x, z]);
      }
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = -Math.PI / 3;
    ref.current.position.y = -5;
    ref.current.position.z = -4;
    // Subtle breathe
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.05) * 0.02;
      mat.opacity = 0.04 + pulse;
    });
  });

  return (
    <group ref={ref}>
      {hexPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <circleGeometry args={[0.38, 6]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.04} />
        </mesh>
      ))}
    </group>
  );
};

/* ── Scene ── */
const Scene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.15} />
    <directionalLight position={[5, 5, 5]} intensity={0.2} />

    {/* Connected network */}
    <NetworkNodes count={45} />

    {/* Floating rings */}
    <FloatingRing position={[-3, 1, -5]} scale={1.5} speed={0.15} axis="y" />
    <FloatingRing position={[4, -1, -6]} scale={1} speed={-0.12} axis="x" />
    <FloatingRing position={[0, 2, -7]} scale={2} speed={0.08} axis="z" />

    {/* Orbiting dots */}
    <OrbitDot radius={3} speed={0.3} offset={0} y={0.5} />
    <OrbitDot radius={4} speed={0.2} offset={2} y={-0.5} />
    <OrbitDot radius={2.5} speed={0.4} offset={4} y={1.5} />

    {/* Hex grid floor */}
    <HexGrid />
  </>
);

const Hero3DBackground = () => (
  <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.domElement.style.pointerEvents = "none";
      }}
    >
      <Scene />
    </Canvas>
    {/* Invisible overlay to capture mouse for parallax */}
    <div
      className="absolute inset-0"
      style={{ pointerEvents: "auto", zIndex: -1 }}
      onMouseMove={() => {}}
    />
  </div>
);

export default Hero3DBackground;
