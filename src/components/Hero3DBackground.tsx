import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const Gear = ({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 8, 6]} />
      <meshStandardMaterial
        color="#4a90d9"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

const FloatingCube = ({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const WobbleSphere = ({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) => {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.25}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

const GridFloor = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshStandardMaterial
        color="#4a90d9"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
};

const Particles = ({ count = 80 }: { count?: number }) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#93c5fd" />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#06b6d4" />

      {/* Gears */}
      <Gear position={[-4, 2, -3]} scale={0.6} speed={0.3} />
      <Gear position={[5, -1, -4]} scale={0.8} speed={-0.2} />
      <Gear position={[3, 3, -5]} scale={0.4} speed={0.5} />

      {/* Cubes */}
      <FloatingCube position={[-3, -1, -2]} scale={0.7} color="#3b82f6" />
      <FloatingCube position={[4, 2, -3]} scale={0.5} color="#06b6d4" />
      <FloatingCube position={[-5, 3, -4]} scale={0.4} color="#8b5cf6" />
      <FloatingCube position={[2, -2, -1]} scale={0.3} color="#14b8a6" />

      {/* Spheres */}
      <WobbleSphere position={[0, 0, -5]} scale={1.2} color="#3b82f6" />
      <WobbleSphere position={[-6, -2, -6]} scale={0.8} color="#06b6d4" />
      <WobbleSphere position={[6, 1, -7]} scale={0.6} color="#8b5cf6" />

      {/* Grid */}
      <GridFloor />

      {/* Particles */}
      <Particles count={100} />
    </>
  );
};

const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;
