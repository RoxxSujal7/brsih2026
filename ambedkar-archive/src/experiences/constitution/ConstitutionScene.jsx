import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

import leatherUrl from '../../assets/textures/constitution_leather_gold.jpg';
import preambleUrl from '../../assets/textures/constitution_preamble.jpg';
import rightsUrl from '../../assets/textures/constitution_rights.jpg';
import marbleUrl from '../../assets/textures/museum_marble.jpg';

export default function ConstitutionScene({
  activeSection,
  onSelectSection,
  isPageTurned,
  onTogglePageTurn
}) {
  const folioGroupRef = useRef();
  const controlsRef = useRef();

  // Load high-resolution museum archival textures
  const leatherTexture = useLoader(THREE.TextureLoader, leatherUrl);
  const preambleTexture = useLoader(THREE.TextureLoader, preambleUrl);
  const rightsTexture = useLoader(THREE.TextureLoader, rightsUrl);
  const marbleTexture = useLoader(THREE.TextureLoader, marbleUrl);

  [leatherTexture, preambleTexture, rightsTexture, marbleTexture].forEach((tex) => {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
  });

  useFrame((state, delta) => {
    if (folioGroupRef.current) {
      // Gentle archival breathing motion
      folioGroupRef.current.position.y = THREE.MathUtils.lerp(
        folioGroupRef.current.position.y,
        Math.sin(state.clock.elapsedTime * 0.8) * 0.015,
        delta * 2
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. OrbitControls with Apple-grade fluid damping */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={7.0}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
        dampingFactor={0.04}
        enableDamping={true}
        rotateSpeed={0.6}
      />

      {/* 2. Studio Lighting: Three-Point Museum Setup */}
      <ambientLight color="#2a241e" intensity={1.5} />

      {/* Soft warm key light from top-right */}
      <spotLight
        position={[3.0, 5.5, 4.2]}
        angle={0.65}
        penumbra={0.9}
        intensity={5.0}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* 24k Gold Rim / Grazing Light to catch gold leaf and leather grain */}
      <directionalLight
        position={[-3.5, 3.8, -2.0]}
        intensity={2.8}
        color="#f59e0b"
      />

      {/* Soft Sapphire Gallery Fill */}
      <pointLight
        position={[-4.0, 2.0, 3.0]}
        intensity={1.2}
        color="#93c5fd"
        distance={9.0}
      />

      {/* Subtle Warm Pedestal Underglow */}
      <pointLight
        position={[0, -0.7, 1.2]}
        intensity={0.8}
        color="#d97706"
        distance={3.5}
      />

      {/* 3. Golden Dust Motes */}
      <Sparkles
        count={45}
        scale={7}
        size={2.2}
        speed={0.35}
        color="#fbbf24"
        opacity={0.6}
      />

      {/* 4. Ground Contact Shadows */}
      <ContactShadows
        position={[0, -1.26, 0]}
        opacity={0.85}
        scale={9}
        blur={2.4}
        far={3.0}
        color="#05070d"
      />

      {/* 5. Architectural Exhibition Pedestal (Nero Marquina Marble with Brass Collar) */}
      <group position={[0, -1.15, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.1, 2.3, 0.22, 64]} />
          <meshStandardMaterial
            map={marbleTexture}
            bumpMap={marbleTexture}
            bumpScale={0.03}
            roughness={0.25}
            metalness={0.35}
          />
        </mesh>

        {/* Polished Solid Brass Plinth Ring */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[2.12, 2.12, 0.025, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Outer Radiant Brass Floor Inscription Ring */}
        <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.32, 2.44, 64]} />
          <meshBasicMaterial
            color="#d97706"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Engraved Archival Label Plate */}
        <group position={[0, 0.02, 1.85]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.18, 0.02]} />
            <meshStandardMaterial
              color="#b45309"
              roughness={0.25}
              metalness={0.88}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[1.56, 0.14, 0.005]} />
            <meshStandardMaterial
              color="#1a110a"
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Handcrafted Mahogany & Brass Archival Presentation Cradle */}
      <group position={[0, -0.65, -0.1]} rotation={[-0.24, 0, 0]}>
        {/* Main Mahogany Slanted Deck */}
        <mesh position={[0, 0.55, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.85, 0.08]} />
          <meshStandardMaterial
            color="#2a160e"
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>

        {/* Felt Lining on Deck */}
        <mesh position={[0, 0.55, -0.018]}>
          <planeGeometry args={[2.52, 1.78]} />
          <meshStandardMaterial
            color="#140a06"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Bottom Mahogany Retaining Ledge */}
        <mesh position={[0, -0.36, 0.08]} castShadow>
          <boxGeometry args={[2.65, 0.12, 0.22]} />
          <meshStandardMaterial
            color="#3d1f14"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        {/* Polished Brass Archival Retaining Brackets */}
        {[-1.0, 1.0].map((x, idx) => (
          <mesh key={idx} position={[x, -0.3, 0.15]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.08]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.2}
              metalness={0.92}
            />
          </mesh>
        ))}
      </group>

      {/* 7. The Sacred Folio */}
      <group ref={folioGroupRef} position={[0, -0.18, 0.02]} rotation={[-0.24, 0, 0]}>
        {!isPageTurned ? (
          /* ================= CLOSED MASTER VOLUME VIEW ================= */
          <group position={[0, 0.1, 0.06]}>
            {/* Front Morocco Leather Cover with 24-Spoke Embossed Gold Ashoka Chakra */}
            <mesh position={[0, 0, 0.12]} castShadow receiveShadow>
              <planeGeometry args={[1.5, 1.84]} />
              <meshStandardMaterial
                map={leatherTexture}
                bumpMap={leatherTexture}
                bumpScale={0.08}
                roughness={0.28}
                metalness={0.25}
              />
            </mesh>

            {/* Leather Cover Rim Board Backing */}
            <mesh position={[0, 0, 0.09]} castShadow>
              <boxGeometry args={[1.54, 1.88, 0.03]} />
              <meshStandardMaterial
                color="#4a0410"
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>

            {/* Gilded 24k Gold Foil Page Block */}
            <mesh position={[0.03, 0, -0.01]} castShadow>
              <boxGeometry args={[1.44, 1.78, 0.16]} />
              <meshStandardMaterial
                color="#d97706"
                emissive="#b45309"
                emissiveIntensity={0.25}
                roughness={0.16}
                metalness={0.94}
              />
            </mesh>

            {/* Rear Archival Hardcover Board */}
            <mesh position={[0, 0, -0.11]}>
              <boxGeometry args={[1.54, 1.88, 0.03]} />
              <meshStandardMaterial
                color="#4a0410"
                roughness={0.45}
                metalness={0.2}
              />
            </mesh>

            {/* Curved Oxblood Morocco Spine */}
            <mesh position={[-0.76, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 1.88, 32]} />
              <meshStandardMaterial
                color="#580816"
                roughness={0.35}
                metalness={0.25}
              />
            </mesh>

            {/* 5 Raised Gold Leaf Spine Ribs */}
            {[-0.68, -0.34, 0, 0.34, 0.68].map((yOffset, idx) => (
              <mesh key={idx} position={[-0.76, yOffset, 0]}>
                <torusGeometry args={[0.116, 0.014, 16, 32]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  roughness={0.18}
                  metalness={0.92}
                />
              </mesh>
            ))}

            {/* Crimson Archival Silk Bookmark Ribbon */}
            <mesh position={[0.2, -0.96, 0.06]} rotation={[0, 0, 0.12]}>
              <boxGeometry args={[0.06, 0.32, 0.005]} />
              <meshStandardMaterial
                color="#991b1b"
                roughness={0.6}
                metalness={0.1}
              />
            </mesh>
          </group>
        ) : (
          /* ================= OPEN ILLUMINATED LEAVES VIEW ================= */
          <group position={[0, 0.1, 0.04]}>
            {/* Open Book Hardcover Base */}
            <mesh position={[0, 0, -0.08]} receiveShadow>
              <boxGeometry args={[2.92, 1.92, 0.045]} />
              <meshStandardMaterial
                color="#4a0410"
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>

            {/* LEFT FOLIO: The Sacred Illuminated Preamble */}
            <group position={[-0.71, 0, 0]} rotation={[0, 0.06, 0]}>
              <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
                <boxGeometry args={[1.38, 1.82, 0.08]} />
                <meshStandardMaterial
                  color="#d97706"
                  emissive="#78350f"
                  emissiveIntensity={0.2}
                  roughness={0.2}
                  metalness={0.9}
                />
              </mesh>

              <mesh position={[0, 0, 0.028]} castShadow receiveShadow>
                <planeGeometry args={[1.36, 1.8]} />
                <meshStandardMaterial
                  map={preambleTexture}
                  bumpMap={preambleTexture}
                  bumpScale={0.03}
                  roughness={0.4}
                  metalness={0.1}
                />
              </mesh>

              <mesh position={[-0.68, 0, -0.015]}>
                <boxGeometry args={[0.01, 1.82, 0.08]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  roughness={0.15}
                  metalness={0.95}
                />
              </mesh>
            </group>

            {/* RIGHT FOLIO: Chapter III Fundamental Rights */}
            <group position={[0.71, 0, 0]} rotation={[0, -0.06, 0]}>
              <mesh position={[0, 0, -0.015]} castShadow receiveShadow>
                <boxGeometry args={[1.38, 1.82, 0.08]} />
                <meshStandardMaterial
                  color="#d97706"
                  emissive="#78350f"
                  emissiveIntensity={0.2}
                  roughness={0.2}
                  metalness={0.9}
                />
              </mesh>

              <mesh position={[0, 0, 0.028]} castShadow receiveShadow>
                <planeGeometry args={[1.36, 1.8]} />
                <meshStandardMaterial
                  map={rightsTexture}
                  bumpMap={rightsTexture}
                  bumpScale={0.03}
                  roughness={0.4}
                  metalness={0.1}
                />
              </mesh>

              <mesh position={[0.68, 0, -0.015]}>
                <boxGeometry args={[0.01, 1.82, 0.08]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  roughness={0.15}
                  metalness={0.95}
                />
              </mesh>
            </group>

            {/* Central Sewn Valley */}
            <mesh position={[0, 0, -0.02]}>
              <cylinderGeometry args={[0.06, 0.06, 1.84, 16]} />
              <meshStandardMaterial
                color="#580816"
                roughness={0.45}
                metalness={0.25}
              />
            </mesh>

            {/* Crimson Silk Archival Bookmark */}
            <mesh position={[0, -0.15, 0.045]}>
              <boxGeometry args={[0.045, 1.7, 0.005]} />
              <meshStandardMaterial
                color="#991b1b"
                roughness={0.6}
                metalness={0.1}
              />
            </mesh>

            {/* Gold Tassel */}
            <mesh position={[0, -0.98, 0.08]}>
              <cylinderGeometry args={[0.025, 0.045, 0.12, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                roughness={0.2}
                metalness={0.92}
              />
            </mesh>

            {/* Twin Polished Brass Page Clips */}
            {[-1.3, 1.3].map((x, idx) => (
              <mesh key={idx} position={[x, -0.78, 0.06]} castShadow>
                <boxGeometry args={[0.07, 0.22, 0.06]} />
                <meshStandardMaterial
                  color="#f59e0b"
                  roughness={0.18}
                  metalness={0.94}
                />
              </mesh>
            ))}

            {/* Overhead Golden Illumination across Open Vellum */}
            <pointLight
              position={[0, 1.0, 1.5]}
              color="#fffbeb"
              intensity={4.0}
              distance={4.5}
            />
          </group>
        )}
      </group>
    </group>
  );
}
