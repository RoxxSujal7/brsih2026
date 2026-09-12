import React, { useRef, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import ConstitutionFolio from '../timeline/artifacts/ConstitutionFolio';
import MahadBasaltStele from '../timeline/artifacts/MahadBasaltStele';
import ScholarlyTomePen from '../timeline/artifacts/ScholarlyTomePen';
import BronzeMedallion from '../timeline/artifacts/BronzeMedallion';
import DhammaWheelLotus from '../timeline/artifacts/DhammaWheelLotus';
import marbleUrl from '../../assets/textures/museum_marble.jpg';

export const MUSEUM_ARTIFACTS = [
  {
    id: 'constitution',
    title: 'The Constitution Master Folio',
    epoch: '1947–1950 • New Delhi',
    materials: 'Morocco Calfskin, 24k Gold Foil, Gilded Vellum',
    dimensions: '45 × 30 × 7 cm • 13 kg',
    desc: 'The original illuminated master volume of the Constitution of India, crafted under Dr. Ambedkar’s chairmanship of the Drafting Committee.',
    source: 'BAWS Vol. 13: Principal Architect of the Constitution',
    volNo: 13,
    component: ConstitutionFolio
  },
  {
    id: 'mahad',
    title: 'Mahad Satyagraha Basalt Stele',
    epoch: 'March 20, 1927 • Raigad',
    materials: 'Chiseled Volcanic Basalt, Inscribed Devanagari, Water Basin',
    dimensions: 'Heritage Obelisk Monument',
    desc: 'Commemorating the historic declaration of equal human rights at Chavdar Tale, where Dr. Ambedkar led thousands to drink from the public water reservoir.',
    source: 'BAWS Vol. 17: Biographical Chronicles',
    volNo: 17,
    component: MahadBasaltStele
  },
  {
    id: 'scholar',
    title: 'Columbia & LSE Scholarly Ledger',
    epoch: '1913–1923 • New York & London',
    materials: 'Creamy Academic Vellum, Antique Brass Fountain Pen, 14k Gold Nib',
    dimensions: 'Historical Dissertation Folio',
    desc: 'Honoring Dr. Ambedkar’s dual doctorates: PhD from Columbia University ("National Dividend") and DSc from London School of Economics ("The Problem of the Rupee").',
    source: 'BAWS Vol. 6: The Problem of the Rupee',
    volNo: 6,
    component: ScholarlyTomePen
  },
  {
    id: 'bronze',
    title: 'Round Table Conference Medallion',
    epoch: '1930–1932 • St James’s Palace, London',
    materials: 'Cast Heavy Bronze, Verdigris Patina, Raised Laurel Rim',
    dimensions: '30 cm Commemorative Plaque',
    desc: 'Commemorating Dr. Ambedkar’s fearless advocacy at the Round Table Conferences and the resulting 1932 Poona Pact.',
    source: 'BAWS Vol. 2: Speeches at the Round Table Conference',
    volNo: 2,
    component: BronzeMedallion
  },
  {
    id: 'dhamma',
    title: 'Dhamma Chakra Sarnath Wheel',
    epoch: 'October 14, 1956 • Deekshabhoomi, Nagpur',
    materials: 'Sarnath Sandstone, 24 Spokes, Carved Marble Lotus Base',
    dimensions: 'Sacred Dhamma Monument',
    desc: 'Representing the historic mass conversion to Buddhism and the pronouncement of the 22 Vows (22 प्रतिज्ञा) restoring social democracy.',
    source: 'BAWS Vol. 11: The Buddha and His Dhamma',
    volNo: 11,
    component: DhammaWheelLotus
  }
];

export default function MuseumScene({ activeIndex, onSelectArtifact }) {
  const controlsRef = useRef();
  const marbleTexture = useLoader(THREE.TextureLoader, marbleUrl);
  const activeExhibit = MUSEUM_ARTIFACTS[activeIndex] || MUSEUM_ARTIFACTS[0];
  const ArtifactComponent = activeExhibit.component;

  marbleTexture.generateMipmaps = true;
  marbleTexture.minFilter = THREE.LinearMipmapLinearFilter;
  marbleTexture.magFilter = THREE.LinearFilter;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. OrbitControls for intuitive, museum-grade object inspection */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={6.5}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 2.05}
        dampingFactor={0.04}
        enableDamping={true}
        rotateSpeed={0.6}
      />

      {/* 2. Museum Three-Point Cinematic Lighting Setup */}
      <ambientLight color="#2a221a" intensity={1.5} />

      {/* Overhead Key Spotlight focused onto the Center Vitrine */}
      <spotLight
        position={[2.5, 5.0, 3.8]}
        angle={0.65}
        penumbra={0.8}
        intensity={5.5}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Saffron/Gold Rim Light from rear */}
      <directionalLight
        position={[-3.5, 4.0, -2.5]}
        intensity={2.8}
        color="#f59e0b"
      />

      {/* Sapphire Fill Light */}
      <pointLight
        position={[-3.8, 1.8, 2.5]}
        intensity={1.2}
        color="#93c5fd"
        distance={8.0}
      />

      {/* Subtle Warm Pedestal Underglow */}
      <pointLight
        position={[0, -0.6, 1.2]}
        intensity={0.8}
        color="#d97706"
        distance={3.0}
      />

      {/* 3. Golden Dust Particles */}
      <Sparkles
        count={45}
        scale={7}
        size={2.2}
        speed={0.3}
        color="#fbbf24"
        opacity={0.6}
      />

      {/* 4. Soft Ground Contact Shadows */}
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.85}
        scale={9}
        blur={2.4}
        far={3.0}
        color="#05070d"
      />

      {/* 5. Center-Stage Nero Marquina Marble Pedestal with Solid Brass Collar */}
      <group position={[0, -0.92, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.0, 2.2, 0.22, 64]} />
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
          <cylinderGeometry args={[2.02, 2.02, 0.025, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Outer Radiant Brass Floor Halo */}
        <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.22, 2.34, 64]} />
          <meshBasicMaterial
            color="#d97706"
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Engraved Archival Label Plate */}
        <group position={[0, 0.02, 1.75]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.18, 0.02]} />
            <meshStandardMaterial
              color="#b45309"
              roughness={0.25}
              metalness={0.88}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[1.46, 0.14, 0.005]} />
            <meshStandardMaterial
              color="#1a110a"
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* 6. The Center-Stage Historical Artifact */}
      <group position={[0, -0.15, 0]}>
        <Suspense fallback={null}>
          <ArtifactComponent isActive={true} isHovered={false} />
        </Suspense>
      </group>
    </group>
  );
}
