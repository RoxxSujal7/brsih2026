import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/dhamma_sandstone_relief.jpg';

export default function DhammaWheelLotus({ isActive, isHovered }) {
  const groupRef = useRef();
  const wheelRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (wheelRef.current) {
      // Noble continuous rotation of the 24-spoke Dhamma Wheel
      wheelRef.current.rotation.z -= delta * (isActive ? 0.6 : 0.2);
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.15 : 0.95}>
      {/* Sculpted Marble Lotus Pedestal */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.05, 1.25, 0.14, 32]} />
        <meshStandardMaterial
          color="#f4f4f5"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Lotus Petal Collar Plinth */}
      <mesh position={[0, -0.52, 0]}>
        <torusGeometry args={[0.75, 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#e4e4e7"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* 24-Spoke Sarnath Sandstone Dhamma Chakra Wheel */}
      <group position={[0, 0.15, 0]} ref={wheelRef}>
        {/* Main Sandstone Medallion Disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.12, 64]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.75}
            metalness={0.05}
            bumpMap={texture}
            bumpScale={0.1}
          />
        </mesh>

        {/* Central Hub Boss */}
        <mesh position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Radiant Enlightenment Aura Ring for Active State */}
      {isActive && (
        <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.38, 32]} />
          <meshBasicMaterial
            color="#eab308"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Warm Golden Core Spotlight */}
      <pointLight
        position={[0, 0.2, 0.8]}
        color="#fbbf24"
        intensity={isActive ? 2.2 : 0.8}
        distance={3.0}
      />
    </group>
  );
}
