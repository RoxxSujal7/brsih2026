import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import ConstitutionFolio from '../timeline/artifacts/ConstitutionFolio';
import MahadBasaltStele from '../timeline/artifacts/MahadBasaltStele';
import ScholarlyTomePen from '../timeline/artifacts/ScholarlyTomePen';
import BronzeMedallion from '../timeline/artifacts/BronzeMedallion';
import DhammaWheelLotus from '../timeline/artifacts/DhammaWheelLotus';

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
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 1.8, 6.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Arrange the 5 artifacts in an elegant semi-circular gallery vitrine
  const positions = useMemo(() => {
    const radius = 5.2;
    return MUSEUM_ARTIFACTS.map((_, i) => {
      const angle = (i - 2) * 0.52; // centered semi-circle
      return [
        Math.sin(angle) * radius,
        0,
        -Math.cos(angle) * radius + radius - 1.2
      ];
    });
  }, []);

  // GSAP camera glide to active exhibit
  useGSAP(() => {
    const activePos = positions[activeIndex];
    if (!activePos) return;

    gsap.to(targetCamPos.current, {
      x: activePos[0],
      y: activePos[1] + 1.6,
      z: activePos[2] + 4.6,
      duration: 1.4,
      ease: 'power3.out'
    });

    gsap.to(targetLookAt.current, {
      x: activePos[0],
      y: activePos[1] + 0.1,
      z: activePos[2],
      duration: 1.4,
      ease: 'power3.out'
    });
  }, [activeIndex, positions]);

  useFrame(() => {
    camera.position.lerp(targetCamPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group>
      {/* Dynamic Gallery Spotlight on Active Artifact */}
      {positions[activeIndex] && (
        <spotLight
          position={[
            positions[activeIndex][0] + 1.2,
            positions[activeIndex][1] + 3.8,
            positions[activeIndex][2] + 2.8
          ]}
          target-position={[
            positions[activeIndex][0],
            positions[activeIndex][1],
            positions[activeIndex][2]
          ]}
          angle={0.6}
          penumbra={0.8}
          intensity={5.5}
          color="#fffbeb"
          castShadow
        />
      )}

      {/* Render All 5 Historical Vitrine Exhibits */}
      {MUSEUM_ARTIFACTS.map((artifact, i) => {
        const ArtifactComponent = artifact.component;
        const isActive = i === activeIndex;
        const pos = positions[i];

        return (
          <group
            key={artifact.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectArtifact(i);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Suspense fallback={null}>
              <ArtifactComponent isActive={isActive} isHovered={false} />
            </Suspense>

            {/* Vitrine Floor Ring */}
            <mesh position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.35, 32]} />
              <meshBasicMaterial
                color={isActive ? '#f59e0b' : '#334155'}
                transparent
                opacity={isActive ? 0.9 : 0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
