import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/antique_bronze_patina.jpg';

export default function BronzeMedallion({ isActive, isHovered }) {
  const groupRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isActive ? 0.9 : 0.3);
      const targetTilt = isHovered ? -0.1 : -0.2;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetTilt,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.15 : 0.95}>
      {/* Heavy Bronze Base Stand */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.12, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Museum Display Easel Prongs */}
      <mesh position={[-0.3, -0.4, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.3, -0.4, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Main Cast Bronze Commemorative Medallion */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.14, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.35}
          metalness={0.75}
          bumpMap={texture}
          bumpScale={0.08}
        />
      </mesh>

      {/* Raised Bronze Outer Relief Rim */}
      <mesh position={[0, 0.1, 0.08]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.66, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#92400e"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Active Golden Glow Ring */}
      {isActive && (
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.25, 32]} />
          <meshBasicMaterial
            color="#d97706"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
