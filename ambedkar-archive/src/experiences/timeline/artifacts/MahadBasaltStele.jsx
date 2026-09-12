import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/mahad_basalt_water_stone.jpg';

export default function MahadBasaltStele({ isActive, isHovered }) {
  const groupRef = useRef();
  const waterRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isActive ? 0.6 : 0.2);
    }
    if (waterRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
      waterRef.current.scale.set(pulse, pulse, pulse);
      waterRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.15 : 0.95}>
      {/* Chavdar Tale Water Basin Reservoir */}
      <mesh ref={waterRef} position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={isActive ? 0.6 : 0.25}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Stone Basin Outer Rim */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.1, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Central Chiseled Basalt Obelisk */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.4, 0.4]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.1}
          bumpMap={texture}
          bumpScale={0.12}
        />
      </mesh>

      {/* Tapered Stele Cap */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.42, 0.4, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.1}
          bumpMap={texture}
          bumpScale={0.1}
        />
      </mesh>

      {/* Beacon of Equality (Warm top light) */}
      <pointLight
        position={[0, 0.9, 0]}
        color="#38bdf8"
        intensity={isActive ? 2.0 : 0.5}
        distance={2.5}
      />
    </group>
  );
}
