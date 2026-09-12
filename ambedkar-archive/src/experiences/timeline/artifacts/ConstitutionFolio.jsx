import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/constitution_leather_gold.jpg';

export default function ConstitutionFolio({ isActive, isHovered }) {
  const groupRef = useRef();
  const bookRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  // Set texture filtering for razor-sharp gold leaf detail
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle archival breathing sway (NO fast spinning!)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
    if (bookRef.current) {
      const targetTilt = isHovered ? -0.22 : -0.28;
      bookRef.current.rotation.x = THREE.MathUtils.lerp(
        bookRef.current.rotation.x,
        targetTilt + Math.sin(state.clock.elapsedTime * 1.0) * 0.015,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.08 : 0.92}>
      {/* Handcrafted Museum Archival Reading Cradle */}
      <group position={[0, -0.45, -0.1]} rotation={[-0.22, 0, 0]}>
        {/* Mahogany Backrest Support Plate */}
        <mesh position={[0, 0.45, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 1.95, 0.06]} />
          <meshStandardMaterial color="#2c160e" roughness={0.35} metalness={0.15} />
        </mesh>
        {/* Felt Pad on Cradle */}
        <mesh position={[0, 0.45, -0.025]}>
          <planeGeometry args={[1.58, 1.88]} />
          <meshStandardMaterial color="#140a06" roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Solid Brass Retaining Shelf */}
        <mesh position={[0, -0.42, 0.08]} castShadow>
          <boxGeometry args={[1.7, 0.1, 0.22]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
        </mesh>
      </group>

      {/* The Sacred Constitution Master Volume */}
      <group ref={bookRef} position={[0, -0.05, 0.08]} rotation={[-0.28, 0, 0]}>
        {/* Front Cover Plate (Displaying the 24-Spoke Golden Ashoka Chakra facing front!) */}
        <mesh position={[0, 0, 0.12]} castShadow receiveShadow>
          <planeGeometry args={[1.42, 1.76]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={texture}
            bumpScale={0.08}
            roughness={0.26}
            metalness={0.28}
          />
        </mesh>

        {/* Hardcover Leather Board Framing (Oxblood Calfskin Rim) */}
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[1.46, 1.8, 0.03]} />
          <meshStandardMaterial
            color="#4a0410"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Gilded 24k Gold Foil Pages Block (Side, Top, Bottom Page Edges) */}
        <mesh position={[0.03, 0, -0.01]} castShadow>
          <boxGeometry args={[1.38, 1.72, 0.18]} />
          <meshStandardMaterial
            color="#d97706"
            emissive="#b45309"
            emissiveIntensity={isActive ? 0.35 : 0.15}
            roughness={0.15}
            metalness={0.94}
          />
        </mesh>

        {/* Back Archival Hardcover Board */}
        <mesh position={[0, 0, -0.11]}>
          <boxGeometry args={[1.46, 1.8, 0.032]} />
          <meshStandardMaterial
            color="#4a0410"
            roughness={0.45}
            metalness={0.2}
          />
        </mesh>

        {/* Rounded Morocco Leather Spine */}
        <mesh position={[-0.73, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 1.8, 32]} />
          <meshStandardMaterial
            color="#580816"
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>

        {/* 5 Raised Gold Leaf Spine Ribs */}
        {[-0.65, -0.32, 0, 0.32, 0.65].map((yOffset, idx) => (
          <mesh key={idx} position={[-0.73, yOffset, 0]}>
            <torusGeometry args={[0.115, 0.014, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.18} metalness={0.92} />
          </mesh>
        ))}

        {/* Crimson Archival Silk Bookmark Ribbon */}
        <mesh position={[0.15, -0.92, 0.06]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.05, 0.3, 0.005]} />
          <meshStandardMaterial color="#991b1b" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Dedicated Golden Specular Key Light */}
        <pointLight
          position={[0, 0.6, 1.4]}
          color="#fffbeb"
          intensity={isActive ? 0.8 : 0.3}
          distance={3.5}
        />
      </group>
    </group>
  );
}
