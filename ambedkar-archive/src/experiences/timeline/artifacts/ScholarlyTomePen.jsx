import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/scholar_parchment_vellum.jpg';

export default function ScholarlyTomePen({ isActive, isHovered }) {
  const groupRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isActive ? 0.7 : 0.25);
      const targetTilt = isHovered ? -0.2 : -0.3;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetTilt + Math.sin(state.clock.elapsedTime * 2) * 0.04,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.15 : 0.95}>
      {/* Exhibit Base Pedestal */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.05, 1.2, 0.1, 32]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Open Archival Ledger Left Wing */}
      <group position={[-0.45, 0, 0]} rotation={[0, 0.2, 0.05]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.85, 1.2, 0.08]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.6}
            metalness={0.05}
            bumpMap={texture}
            bumpScale={0.03}
          />
        </mesh>
      </group>

      {/* Open Archival Ledger Right Wing */}
      <group position={[0.45, 0, 0]} rotation={[0, -0.2, -0.05]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.85, 1.2, 0.08]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.6}
            metalness={0.05}
            bumpMap={texture}
            bumpScale={0.03}
          />
        </mesh>
      </group>

      {/* Book Center Binding Crease */}
      <mesh position={[0, 0, -0.02]}>
        <cylinderGeometry args={[0.06, 0.06, 1.22, 16]} />
        <meshStandardMaterial color="#451a03" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Antique Brass Fountain Pen resting across ledger */}
      <group position={[0.2, 0.15, 0.12]} rotation={[0.4, 0.2, -0.8]}>
        {/* Pen Barrel */}
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Brass Grip & Trim Rings */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.06, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* 14k Gold Nib */}
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.03, 0.1, 4]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.15} metalness={0.95} />
        </mesh>
      </group>

      {/* Active Scholar Beacon Ring */}
      {isActive && (
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.35, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
