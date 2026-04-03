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

/* ── DNA Double Helix ── */
const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  const strandCount = 60;

  const { spheres1, spheres2, connectors } = useMemo(() => {
    const s1: { pos: THREE.Vector3; phase: number }[] = [];
    const s2: { pos: THREE.Vector3; phase: number }[] = [];
    const conn: { start: THREE.Vector3; end: THREE.Vector3; idx: number }[] = [];

    for (let i = 0; i < strandCount; i++) {
      const t = (i / strandCount) * Math.PI * 4;
      const y = (i / strandCount - 0.5) * 6;
      const r = 0.8;
      const x1 = Math.cos(t) * r;
      const z1 = Math.sin(t) * r;
      const x2 = Math.cos(t + Math.PI) * r;
      const z2 = Math.sin(t + Math.PI) * r;

      s1.push({ pos: new THREE.Vector3(x1, y, z1), phase: t });
      s2.push({ pos: new THREE.Vector3(x2, y, z2), phase: t + Math.PI });

      if (i % 4 === 0) {
        conn.push({
          start: new THREE.Vector3(x1, y, z1),
          end: new THREE.Vector3(x2, y, z2),
          idx: i,
        });
      }
    }
    return { spheres1: s1, spheres2: s2, connectors: conn };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.08;

    groupRef.current.children.forEach((child, i) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = 0.08 + Math.sin(t * 0.8 + i * 0.2) * 0.04;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Strand 1 spheres */}
      {spheres1.map((s, i) => (
        <mesh key={`s1-${i}`} position={s.pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhysicalMaterial
            color="#0a1628"
            emissive="#4a90d9"
            emissiveIntensity={0.1}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Strand 2 spheres */}
      {spheres2.map((s, i) => (
        <mesh key={`s2-${i}`} position={s.pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhysicalMaterial
            color="#0a1628"
            emissive="#7c6bc4"
            emissiveIntensity={0.1}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Base pair connectors */}
      {connectors.map((c, i) => {
        const mid = new THREE.Vector3().lerpVectors(c.start, c.end, 0.5);
        const dir = new THREE.Vector3().subVectors(c.end, c.start);
        const len = dir.length();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());

        return (
          <mesh key={`conn-${i}`} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.012, 0.012, len, 4]} />
            <meshPhysicalMaterial
              color="#0d1117"
              emissive="#5ba3e6"
              emissiveIntensity={0.12}
              transparent
              opacity={0.35}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      {/* Strand curves */}
      {[spheres1, spheres2].map((strand, si) => {
        const curve = new THREE.CatmullRomCurve3(strand.map((s) => s.pos));
        const points = curve.getPoints(80);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive
            key={`strand-${si}`}
            object={
              new THREE.Line(
                geo,
                new THREE.LineBasicMaterial({
                  color: si === 0 ? "#4a90d9" : "#7c6bc4",
                  transparent: true,
                  opacity: 0.2,
                })
              )
            }
          />
        );
      })}
    </group>
  );
};

/* ── Circuit Board Traces ── */
const CircuitTraces = ({ count = 8 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const traces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points: THREE.Vector3[] = [];
      let x = (Math.random() - 0.5) * 14;
      let y = (Math.random() - 0.5) * 8;
      const z = -2 - Math.random() * 5;

      points.push(new THREE.Vector3(x, y, z));

      for (let j = 0; j < 6; j++) {
        // Circuit-style right-angle paths
        if (Math.random() > 0.5) {
          x += (Math.random() - 0.3) * 2;
        } else {
          y += (Math.random() - 0.3) * 2;
        }
        points.push(new THREE.Vector3(x, y, z));
      }

      return { points, color: i % 3 === 0 ? "#4a90d9" : i % 3 === 1 ? "#7c6bc4" : "#3a6b9f" };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const line = child as THREE.Line;
      if (line.material) {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.04 + Math.sin(t * 0.4 + i * 1.2) * 0.025;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {traces.map((trace, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(trace.points);
        return (
          <primitive
            key={i}
            object={
              new THREE.Line(
                geo,
                new THREE.LineBasicMaterial({
                  color: trace.color,
                  transparent: true,
                  opacity: 0.05,
                })
              )
            }
          />
        );
      })}
    </group>
  );
};

/* ── Circuit Nodes (junction points) ── */
const CircuitNodes = ({ count = 20 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = -2 - Math.random() * 5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#5ba3e6" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
};

/* ── Floating data particles ── */
const DataParticles = ({ count = 30 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.005;
      ref.current.rotation.x = Math.sin(t * 0.008) * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8b9dc3" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
};

/* ── Parallax wrapper ── */
const ParallaxGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (mousePos.x * 0.06 - ref.current.rotation.y) * 0.01;
    ref.current.rotation.x += (mousePos.y * 0.03 - ref.current.rotation.x) * 0.01;
  });
  return <group ref={ref}>{children}</group>;
};

/* ── Full scene ── */
const FullScene = () => (
  <>
    <MouseTracker />
    <ambientLight intensity={0.025} />
    <directionalLight position={[5, 4, 6]} intensity={0.08} color="#b8c6db" />
    <directionalLight position={[-4, 2, -5]} intensity={0.04} color="#7c6bc4" />
    <pointLight position={[0, 3, 3]} intensity={0.08} color="#4a90d9" distance={12} decay={2} />
    <pointLight position={[0, -2, 2]} intensity={0.04} color="#7c6bc4" distance={10} decay={2} />
    <fog attach="fog" args={["#08080f", 6, 20]} />

    <ParallaxGroup>
      <DNAHelix />
      <CircuitTraces count={8} />
    </ParallaxGroup>

    <CircuitNodes count={20} />
    <DataParticles count={30} />
  </>
);

/* ── Mobile scene ── */
const MobileScene = () => (
  <>
    <ambientLight intensity={0.03} />
    <directionalLight position={[4, 3, 5]} intensity={0.06} color="#b8c6db" />
    <pointLight position={[0, 2, 3]} intensity={0.06} color="#4a90d9" distance={10} decay={2} />
    <fog attach="fog" args={["#08080f", 5, 16]} />
    <DNAHelix />
    <DataParticles count={12} />
  </>
);

const Hero3DBackground = () => {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 50, near: 0.1, far: 30 }}
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
