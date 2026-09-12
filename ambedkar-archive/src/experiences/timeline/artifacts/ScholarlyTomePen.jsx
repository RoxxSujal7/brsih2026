import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/scholar_parchment_vellum.jpg';

export default function ScholarlyTomePen({ isActive, isHovered }) {
  const groupRef = useRef();
  const ledgerRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle archival breathing sway (NO wild spinning!)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.07;
    }
    if (ledgerRef.current) {
      const targetTilt = isHovered ? -0.15 : -0.22;
      ledgerRef.current.rotation.x = THREE.MathUtils.lerp(
        ledgerRef.current.rotation.x,
        targetTilt + Math.sin(state.clock.elapsedTime * 1.1) * 0.012,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.08 : 0.92}>
      {/* Handcrafted Mahogany Desk Reading Stand */}
      <group position={[0, -0.42, -0.1]} rotation={[-0.2, 0, 0]}>
        <mesh position={[0, 0.45, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.45, 0.06]} />
          <meshStandardMaterial color="#2a160e" roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.32, 0.08]} castShadow>
          <boxGeometry args={[2.05, 0.08, 0.22]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.9} />
        </mesh>
      </group>

      {/* Open Archival Scholarly Ledger (Columbia & LSE Dissertations) */}
      <group ref={ledgerRef} position={[0, -0.05, 0.08]} rotation={[-0.22, 0, 0]}>
        {/* Open Book Hardcover Base Plate */}
        <mesh position={[0, 0, -0.06]} receiveShadow>
          <boxGeometry args={[1.92, 1.34, 0.04]} />
          <meshStandardMaterial color="#381d12" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Left Dissertation Page Leaf (Columbia University PhD, 1915) */}
        <group position={[-0.47, 0, 0]} rotation={[0, 0.05, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 1.28, 0.06]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.6}
              metalness={0.05}
              bumpMap={texture}
              bumpScale={0.04}
            />
          </mesh>
        </group>

        {/* Right Dissertation Page Leaf (LSE DSc, 1923 "Problem of the Rupee") */}
        <group position={[0.47, 0, 0]} rotation={[0, -0.05, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 1.28, 0.06]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.6}
              metalness={0.05}
              bumpMap={texture}
              bumpScale={0.04}
            />
          </mesh>
        </group>

        {/* Central Sewn Binding Gutter */}
        <mesh position={[0, 0, -0.015]}>
          <cylinderGeometry args={[0.045, 0.045, 1.3, 16]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Antique Brass Fountain Pen resting across the lower page */}
        <group position={[0.15, -0.32, 0.08]} rotation={[0, 0, -0.25]}>
          {/* Pen Barrel */}
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.75, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Gold Trim Ring */}
          <mesh position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.04, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.18} metalness={0.92} />
          </mesh>
          {/* 14k Gold Nib */}
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.022, 0.08, 4]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.15} metalness={0.96} />
          </mesh>
        </group>

        {/* Vintage Round Brass Reading Spectacles (Dr. Ambedkar's iconic glasses) */}
        <group position={[-0.4, 0.28, 0.08]} rotation={[0, 0, 0.15]}>
          {/* Left Lens Ring */}
          <mesh position={[-0.14, 0, 0]}>
            <torusGeometry args={[0.11, 0.012, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
          </mesh>
          {/* Right Lens Ring */}
          <mesh position={[0.14, 0, 0]}>
            <torusGeometry args={[0.11, 0.012, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
          </mesh>
          {/* Nose Bridge */}
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.04, 0.01, 8, 16]} rotation={[0, 0, Math.PI]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
          </mesh>
          {/* Glass Lenses with subtle specular sheen */}
          {[-0.14, 0.14].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]}>
              <circleGeometry args={[0.1, 24]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.1}
                transparent
                opacity={0.35}
              />
            </mesh>
          ))}
        </group>

        {/* Dedicated Warm Scholar Spot */}
        <pointLight
          position={[0, 0.5, 1.2]}
          color="#fef3c7"
          intensity={isActive ? 3.5 : 1.2}
          distance={3.0}
        />
      </group>
    </group>
  );
}
