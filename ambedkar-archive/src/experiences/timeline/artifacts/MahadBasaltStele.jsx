import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/mahad_basalt_water_stone.jpg';

export default function MahadBasaltStele({ isActive, isHovered }) {
  const groupRef = useRef();
  const waterRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle dignified monument breathing (NO wild spinning!)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
    }
    if (waterRef.current) {
      // Gentle rippling water oscillation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.02;
      waterRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.08 : 0.92}>
      {/* Chavdar Tale Sacred Water Basin Reservoir */}
      <group position={[0, -0.65, 0]}>
        {/* Stone Basin Outer Rim */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.35, 1.45, 0.14, 48]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.8}
            metalness={0.15}
            bumpMap={texture}
            bumpScale={0.05}
          />
        </mesh>

        {/* Polished Brass Inner Lip */}
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[1.32, 1.32, 0.015, 48]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.88} />
        </mesh>

        {/* Rippling Clear Water Surface */}
        <mesh ref={waterRef} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.28, 48]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={isActive ? 0.35 : 0.15}
            roughness={0.08}
            metalness={0.8}
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>

      {/* Central Chiseled Raigad Volcanic Basalt Stele */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 1.6, 0.45]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.1}
          bumpMap={texture}
          bumpScale={0.14}
        />
      </mesh>

      {/* Chiseled Pyramidal Stele Crown */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <coneGeometry args={[0.48, 0.38, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.1}
          bumpMap={texture}
          bumpScale={0.12}
        />
      </mesh>

      {/* Engraved Inscription Plaque (Chavdar Tale Water Declaration) */}
      <group position={[0, 0.22, 0.235]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[0.7, 1.2]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
        {/* Brass Plaque Bezel Frame */}
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[0.72, 1.22, 0.005]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.85} wireframe />
        </mesh>
      </group>

      {/* Beacon of Human Dignity (Warm Top Light) */}
      <pointLight
        position={[0, 1.3, 0.5]}
        color="#38bdf8"
        intensity={isActive ? 3.0 : 1.2}
        distance={3.5}
      />
    </group>
  );
}
