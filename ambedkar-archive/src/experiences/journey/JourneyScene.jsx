import React, { useRef, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Line, OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import mapUrl from '../../assets/textures/archival_world_map.jpg';

export const JOURNEY_STATIONS = [
  {
    id: 'mhow',
    title: 'Mhow (Military Cantonment)',
    year: '1891',
    role: 'Birthplace & Roots',
    mapPos: [1.35, 0.22],
    desc: 'Born on April 14, 1891, the fourteenth child of Subedar Ramji Sakpal and Bhimabai, beginning a life consecrated to human equality.',
    source: 'BAWS Vol. 17: Biographical Chronicles',
    volNo: 17
  },
  {
    id: 'bombay',
    title: 'Bombay (Elphinstone College)',
    year: '1907–1912',
    role: 'Matriculation & BA Graduation',
    mapPos: [1.24, 0.38],
    desc: 'First of his community to matriculate from Elphinstone High School; earned his BA in Economics and Politics supported by the Maharaja of Baroda.',
    source: 'BAWS Vol. 17: Life & Mission',
    volNo: 17
  },
  {
    id: 'newyork',
    title: 'New York (Columbia University)',
    year: '1913–1916',
    role: 'MA & PhD in Economics',
    mapPos: [-1.82, -0.38],
    desc: 'Studied under John Dewey, Edwin Seligman, and James Shotwell. Penned "Castes in India" and "The Evolution of Provincial Finance".',
    source: 'BAWS Vol. 12: Ancient Indian Commerce',
    volNo: 12
  },
  {
    id: 'london',
    title: 'London (LSE & Gray’s Inn)',
    year: '1916–1923',
    role: 'DSc & Barrister-at-Law',
    mapPos: [-0.35, -0.68],
    desc: 'Authored "The Problem of the Rupee: Its Origin and Its Solution" at LSE and called to the Bar at Gray’s Inn, London.',
    source: 'BAWS Vol. 6: The Problem of the Rupee',
    volNo: 6
  },
  {
    id: 'mahad',
    title: 'Mahad (Chavdar Tale)',
    year: '1927',
    role: 'Water Satyagraha & Civil Rights',
    mapPos: [1.28, 0.44],
    desc: 'Led the historic march to Chavdar Tale on March 20, asserting the fundamental human right to public water and universal human dignity.',
    source: 'BAWS Vol. 17: Civil Rights Movements',
    volNo: 17
  },
  {
    id: 'delhi',
    title: 'New Delhi (Constituent Assembly)',
    year: '1947–1950',
    role: 'Law Minister & Drafting Chairman',
    mapPos: [1.34, 0.1],
    desc: 'Piloted the Constitution through the Constituent Assembly, embedding fundamental rights, separation of powers, and social democracy.',
    source: 'BAWS Vol. 13: Principal Architect of Constitution',
    volNo: 13
  },
  {
    id: 'nagpur',
    title: 'Nagpur (Deekshabhoomi)',
    year: '1956',
    role: 'Dhamma Chakra Pravartan',
    mapPos: [1.44, 0.28],
    desc: 'Led over 500,000 followers into Buddhism on October 14, administering the 22 Vows and completing "The Buddha and His Dhamma".',
    source: 'BAWS Vol. 11: The Buddha and His Dhamma',
    volNo: 11
  }
];

export default function JourneyScene({ activeIndex, onSelectStation }) {
  const { camera } = useThree();
  const mapTexture = useLoader(THREE.TextureLoader, mapUrl);

  mapTexture.generateMipmaps = true;
  mapTexture.minFilter = THREE.LinearMipmapLinearFilter;
  mapTexture.magFilter = THREE.LinearFilter;

  const targetCamPos = useRef(new THREE.Vector3(0, 3.2, 2.4));
  const targetLookAt = useRef(new THREE.Vector3(0, -0.2, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, -0.2, 0));

  // Build arched golden flight & sea voyage ribbons connecting historical points
  const routeRibbons = useMemo(() => {
    const lines = [];
    for (let i = 0; i < JOURNEY_STATIONS.length - 1; i++) {
      const p1 = JOURNEY_STATIONS[i].mapPos;
      const p2 = JOURNEY_STATIONS[i + 1].mapPos;

      const v1 = new THREE.Vector3(p1[0], 0.04, p1[1]);
      const v2 = new THREE.Vector3(p2[0], 0.04, p2[1]);

      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const dist = v1.distanceTo(v2);
      mid.y += Math.min(dist * 0.3, 0.65);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      lines.push(curve.getPoints(24));
    }
    return lines;
  }, []);

  // Smooth camera glide to active station
  useGSAP(() => {
    const station = JOURNEY_STATIONS[activeIndex];
    if (!station) return;

    const [sx, sz] = station.mapPos;
    gsap.to(targetCamPos.current, {
      x: sx * 0.4,
      y: 2.9,
      z: sz * 0.4 + 2.4,
      duration: 1.4,
      ease: 'power3.out'
    });

    gsap.to(targetLookAt.current, {
      x: sx * 0.6,
      y: -0.2,
      z: sz * 0.6,
      duration: 1.4,
      ease: 'power3.out'
    });
  }, [activeIndex]);

  useFrame(() => {
    camera.position.lerp(targetCamPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. OrbitControls with smooth damping */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.8}
        maxDistance={5.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        dampingFactor={0.05}
        enableDamping={true}
        rotateSpeed={0.5}
      />

      {/* 2. Warm Archival Library Lighting */}
      <ambientLight color="#2c2218" intensity={1.5} />
      <directionalLight position={[0, 6, 4]} intensity={2.2} color="#fef3c7" />
      <pointLight position={[-3, 2, -2]} intensity={1.2} color="#f59e0b" />

      {/* Dynamic Key Spotlight over Active Station */}
      {JOURNEY_STATIONS[activeIndex] && (
        <spotLight
          position={[
            JOURNEY_STATIONS[activeIndex].mapPos[0] + 0.5,
            3.2,
            JOURNEY_STATIONS[activeIndex].mapPos[1] + 1.0
          ]}
          target-position={[
            JOURNEY_STATIONS[activeIndex].mapPos[0],
            0.1,
            JOURNEY_STATIONS[activeIndex].mapPos[1]
          ]}
          angle={0.65}
          penumbra={0.75}
          intensity={5.5}
          color="#fff8ed"
          castShadow
        />
      )}

      {/* 3. Golden Dust Particles floating above the Map */}
      <Sparkles
        count={35}
        scale={[6, 2, 4]}
        position={[0, 0.5, 0]}
        size={2.2}
        speed={0.3}
        color="#fbbf24"
        opacity={0.5}
      />

      {/* 4. Floor Contact Shadows */}
      <ContactShadows
        position={[0, -0.65, 0]}
        opacity={0.8}
        scale={8}
        blur={2.4}
        far={3.0}
        color="#05070d"
      />

      {/* 5. Solid Dark Mahogany Cartographer's Desk */}
      <group position={[0, -0.3, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[5.6, 0.16, 3.4]} />
          <meshStandardMaterial
            color="#24140c"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        {/* Polished Solid Brass Edge Trim Around Table */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[5.64, 0.02, 3.44]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Brass Corner Brackets */}
        {[
          [-2.8, -1.7],
          [2.8, -1.7],
          [-2.8, 1.7],
          [2.8, 1.7]
        ].map(([cx, cz], idx) => (
          <mesh key={idx} position={[cx, 0.08, cz]}>
            <boxGeometry args={[0.2, 0.025, 0.2]} />
            <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.94} />
          </mesh>
        ))}
      </group>

      {/* 6. The 1920s Archival Cartographic Map */}
      <group position={[0, -0.21, 0]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <planeGeometry args={[5.0, 2.81]} />
          <meshStandardMaterial
            map={mapTexture}
            bumpMap={mapTexture}
            bumpScale={0.03}
            roughness={0.65}
            metalness={0.08}
          />
        </mesh>

        {/* Gilded Border Frame for Map Sheet */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.02, 2.83]} />
          <meshStandardMaterial
            color="#b45309"
            wireframe
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* 7. Arched Golden Route Ribbons Across Continents */}
      {routeRibbons.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color="#f59e0b"
          lineWidth={2.4}
          transparent
          opacity={0.85}
        />
      ))}

      {/* 8. Vintage Solid Brass Drafting Compass Resting on Desk */}
      <group position={[-1.9, -0.18, 0.9]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 16]} rotation={[0, 0, 0.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 16]} rotation={[0, 0, -0.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* 9. Sleek Tactile Brass & Gold Gemstone Map Markers */}
      {JOURNEY_STATIONS.map((st, i) => {
        const isActive = i === activeIndex;
        const [x, z] = st.mapPos;

        return (
          <group
            key={st.id}
            position={[x, -0.2, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStation(i);
            }}
          >
            {/* Solid Brass Pin Shaft */}
            <mesh position={[0, 0.07, 0]} castShadow>
              <cylinderGeometry args={[0.014, 0.008, 0.14, 16]} />
              <meshStandardMaterial
                color={isActive ? '#f59e0b' : '#94a3b8'}
                roughness={0.2}
                metalness={0.9}
              />
            </mesh>

            {/* Glowing Gemstone Head */}
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.045, 24, 24]} />
              <meshStandardMaterial
                color={isActive ? '#fbbf24' : '#64748b'}
                emissive={isActive ? '#f59e0b' : '#334155'}
                emissiveIntensity={isActive ? 0.95 : 0.2}
                roughness={0.12}
                metalness={0.92}
              />
            </mesh>

            {/* Active Concentric Ripple Halo */}
            {isActive && (
              <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.15, 32]} />
                <meshBasicMaterial
                  color="#f59e0b"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
