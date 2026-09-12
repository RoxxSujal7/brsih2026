import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/constitution_leather_gold.jpg';

export default function ConstitutionFolio({ isActive, isHovered }) {
  const groupRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle historical vitrine rotation
      groupRef.current.rotation.y += delta * (isActive ? 0.8 : 0.25);
      // Subtle physical breathing tilt
      const targetTilt = isHovered ? -0.15 : -0.25;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetTilt + Math.sin(state.clock.elapsedTime * 1.5) * 0.03,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.15 : 0.95}>
      {/* Folio Base Display Plinth */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.0, 1.15, 0.12, 32]} />
        <meshStandardMaterial
          color="#18181b"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Main Bound Leather Volume (Front & Back Covers) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.45, 0.22]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.2}
          bumpMap={texture}
          bumpScale={0.08}
        />
      </mesh>

      {/* Warm Golden Key Light to catch Gold Foil details */}
      <pointLight
        position={[0, 0.4, 0.8]}
        color="#fbbf24"
        intensity={isActive ? 2.8 : 0.8}
        distance={3.5}
      />

      {/* Gilded Gold Foil Edge Pages */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[1.14, 1.39, 0.2]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#b45309"
          emissiveIntensity={isActive ? 0.35 : 0.15}
          roughness={0.2}
          metalness={0.88}
        />
      </mesh>

      {/* Golden Spine Ribs & Ornamentation */}
      <mesh position={[-0.59, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.46, 16]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* Radiant Golden Glow Ring for Active State */}
      {isActive && (
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.35, 32]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
