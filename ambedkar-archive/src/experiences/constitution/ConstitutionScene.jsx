import React, { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import ConstitutionFolio from '../timeline/artifacts/ConstitutionFolio';
import textureUrl from '../../assets/textures/scholar_parchment_vellum.jpg';
import { useLoader } from '@react-three/fiber';

export default function ConstitutionScene({
  activeSection,
  onSelectSection,
  isPageTurned,
  onTogglePageTurn
}) {
  const folioRef = useRef();
  const vellumTexture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state, delta) => {
    if (folioRef.current) {
      // Gentle breathing float
      folioRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      // Controlled tilt
      folioRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Volumetric Vitrine Gallery Lighting */}
      <spotLight
        position={[2.5, 4.5, 4.0]}
        angle={0.65}
        penumbra={0.8}
        intensity={4.8}
        color="#fffbeb"
        castShadow
      />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color="#0284c7" />
      <pointLight position={[3, -1, 2]} intensity={1.2} color="#f59e0b" />

      {/* 2. Main Exhibit Pedestal */}
      <mesh position={[0, -1.3, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.4, 64]} />
        <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Radiant Golden Vitrine Halo */}
      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.25, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. The Sacred Constitution Master Folio & Open Leaves */}
      <group ref={folioRef} position={[0, -0.1, 0]}>
        {!isPageTurned ? (
          /* Closed Master Folio with Gold-Embossed 24-Spoke Ashoka Chakra */
          <group scale={1.35}>
            <Suspense fallback={null}>
              <ConstitutionFolio isActive={true} isHovered={false} />
            </Suspense>
          </group>
        ) : (
          /* Open Calligraphed Preamble Vellum Leaves */
          <group scale={1.2} rotation={[-0.2, 0, 0]}>
            {/* Left Page (The Preamble Calligraphy) */}
            <mesh position={[-0.95, 0, 0]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 2.4, 0.08]} />
              <meshStandardMaterial
                map={vellumTexture}
                roughness={0.6}
                metalness={0.05}
                bumpMap={vellumTexture}
                bumpScale={0.04}
              />
            </mesh>

            {/* Right Page (Fundamental Rights & Article 32) */}
            <mesh position={[0.95, 0, 0]} rotation={[0, -0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 2.4, 0.08]} />
              <meshStandardMaterial
                map={vellumTexture}
                roughness={0.6}
                metalness={0.05}
                bumpMap={vellumTexture}
                bumpScale={0.04}
              />
            </mesh>

            {/* Center Gilded Leather Spine Crease */}
            <mesh position={[0, 0, -0.04]}>
              <cylinderGeometry args={[0.08, 0.08, 2.42, 16]} />
              <meshStandardMaterial color="#451a03" roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Gold Leaf Inscription Spotlights */}
            <pointLight position={[0, 0.5, 1.2]} color="#fbbf24" intensity={2.8} distance={3.5} />
          </group>
        )}
      </group>
    </group>
  );
}
