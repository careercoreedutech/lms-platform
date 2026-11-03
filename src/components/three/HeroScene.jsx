import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * "Career Core" — a faceted glossy core inside a wireframe shell, circled by orbit
 * rings with satellites (skills), floating brand-coloured shapes and a star field.
 * Lightweight: no post-processing, no textures, ~1 draw call per object.
 */

const NAVY = '#0A317B';
const TEAL = '#1A9C9B';
const ORANGE = '#FA9C16';
const SKY = '#38BDF8';

function useReducedMotion() {
  return useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );
}

function Core() {
  const core = useRef();
  const shell = useRef();
  const glow = useRef();
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += dt * 0.25;
      core.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.12;
      shell.current.rotation.z += dt * 0.05;
    }
    if (glow.current) glow.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);
  });
  return (
    <group>
      {/* inner glow */}
      <mesh ref={glow}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.18} />
      </mesh>
      {/* faceted glossy core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshPhysicalMaterial
          color={TEAL}
          flatShading
          metalness={0.55}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={NAVY}
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.62, 1]} />
        <meshBasicMaterial color={SKY} wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Orbit({ radius, tilt, speed, color, satellites }) {
  const group = useRef();
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      <group ref={group} rotation={[Math.PI / 2, 0, 0]}>
        {satellites.map((s, i) => {
          const a = (i / satellites.length) * Math.PI * 2 + (s.offset || 0);
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[s.size, 24, 24]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.9} roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function FloatingShape({ position, speed = 1, children }) {
  const ref = useRef();
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + seed;
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(t) * 0.18;
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.45;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function Stars({ count }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph) - 2;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#cbd5e1" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Smoothly tilts the whole scene toward the pointer
function Parallax({ children }) {
  const ref = useRef();
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.2, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ compact }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={30} color={ORANGE} distance={12} />
      <pointLight position={[3, -3, 2]} intensity={25} color={SKY} distance={12} />

      <Stars count={compact ? 220 : 520} />

      <Parallax>
        <group rotation={[0.25, -0.35, 0]}>
          <Core />
          <Orbit
            radius={2.25}
            tilt={[0.35, 0, 0.25]}
            speed={0.35}
            color={TEAL}
            satellites={[
              { size: 0.11, color: ORANGE },
              { size: 0.08, color: '#ffffff', offset: 0.6 },
              { size: 0.09, color: SKY, offset: 1.1 },
            ]}
          />
          <Orbit
            radius={2.85}
            tilt={[-0.5, 0.2, -0.35]}
            speed={-0.22}
            color={ORANGE}
            satellites={[
              { size: 0.1, color: TEAL },
              { size: 0.07, color: ORANGE, offset: 0.9 },
            ]}
          />
        </group>

        {!compact && (
          <>
            <FloatingShape position={[-2.9, 1.5, -0.6]} speed={0.8}>
              <mesh>
                <torusKnotGeometry args={[0.32, 0.11, 120, 16]} />
                <meshPhysicalMaterial color={ORANGE} metalness={0.4} roughness={0.15} clearcoat={1} />
              </mesh>
            </FloatingShape>
            <FloatingShape position={[3.0, 1.7, -1]} speed={0.6}>
              <mesh>
                <octahedronGeometry args={[0.38, 0]} />
                <meshPhysicalMaterial color={SKY} metalness={0.3} roughness={0.1} clearcoat={1} flatShading />
              </mesh>
            </FloatingShape>
            <FloatingShape position={[2.6, -1.9, 0.2]} speed={0.9}>
              <mesh>
                <torusGeometry args={[0.3, 0.12, 24, 64]} />
                <meshPhysicalMaterial color={TEAL} metalness={0.4} roughness={0.2} clearcoat={1} />
              </mesh>
            </FloatingShape>
            <FloatingShape position={[-2.5, -1.8, 0.4]} speed={0.7}>
              <mesh>
                <boxGeometry args={[0.42, 0.42, 0.42]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.25} clearcoat={1} />
              </mesh>
            </FloatingShape>
          </>
        )}
      </Parallax>
    </>
  );
}

export default function HeroScene({ compact = false, onReady }) {
  const reduced = useReducedMotion();
  return (
    <Canvas
      dpr={[1, compact ? 1.5 : 2]}
      camera={{ position: [0, 0, compact ? 7.4 : 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <Scene compact={compact} />
    </Canvas>
  );
}
