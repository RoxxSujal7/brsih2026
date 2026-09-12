import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/dhamma_sandstone_relief.jpg';

export default function DhammaWheelLotus({ isActive, isHovered }) {
  const groupRef = useRef();
  const wheelRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle dignified monument sway (NO wild spinning!)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
    }
    if (wheelRef.current) {
      // Sacred majestic slow rotation of the 24-spoke Dhamma Wheel
      wheelRef.current.rotation.z -= delta * (isActive ? 0.35 : 0.15);
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.08 : 0.92}>
      {/* Sculpted White Makrana Marble Lotus Pedestal */}
      <group position={[0, -0.48, 0]}>
        {/* Tiered Lotus Base Plinth */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.15, 1.35, 0.16, 48]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Polished Gold Collar Ring */}
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.02, 48]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
        </mesh>

        {/* Carved Lotus Petal Collar */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.82, 0.12, 16, 48]} />
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* 24-Spoke Sarnath Sandstone Dhamma Chakra Wheel (1956 Deekshabhoomi Nagpur) */}
      <group position={[0, 0.32, 0]} ref={wheelRef}>
        {/* Main Sandstone Medallion Disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.12, 64]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.75}
            metalness={0.08}
            bumpMap={texture}
            bumpScale={0.12}
          />
        </mesh>

        {/* Outer Wheel Rim */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.82, 0.035, 16, 64]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Central Hub Boss (Embossed Lotus Seedpod) */}
        <mesh position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.25}
            metalness={0.88}
          />
        </mesh>
      </group>

      {/* Warm Golden Core Enlightenment Light */}
      <pointLight
        position={[0, 0.4, 0.9]}
        color="#fde047"
        intensity={isActive ? 3.5 : 1.4}
        distance={3.5}
      />
    </group>
  );
}
