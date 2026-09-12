import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const JOURNEY_STATIONS = [
  {
    id: 'mhow',
    title: 'Mhow (Military Cantonment)',
    year: '1891',
    role: 'Birthplace & Roots',
    coords: [22.55, 75.76],
    desc: 'Born on April 14, 1891, the fourteenth child of Ramji Sakpal and Bhimabai, beginning a life dedicated to universal emancipation.',
    source: 'BAWS Vol. 17: Biographical Chronicles',
    volNo: 17
  },
  {
    id: 'bombay',
    title: 'Bombay (Elphinstone College)',
    year: '1907–1912',
    role: 'Matriculation & BA Graduation',
    coords: [18.93, 72.83],
    desc: 'The first of his community to matriculate from Elphinstone High School; graduated with BA in Economics and Politics with the Gaekwad scholarship.',
    source: 'BAWS Vol. 17: Life & Mission',
    volNo: 17
  },
  {
    id: 'newyork',
    title: 'New York (Columbia University)',
    year: '1913–1916',
    role: 'MA & PhD in Economics',
    coords: [40.81, -73.96],
    desc: 'Studied under John Dewey, Edwin Seligman, and James Shotwell. Authored "Castes in India" and "National Dividend of India".',
    source: 'BAWS Vol. 12: Ancient Indian Commerce',
    volNo: 12
  },
  {
    id: 'london',
    title: 'London (LSE & Gray’s Inn)',
    year: '1916–1923',
    role: 'DSc & Barrister-at-Law',
    coords: [51.51, -0.11],
    desc: 'Completed his monumental treatise "The Problem of the Rupee: Its Origin and Its Solution" and was called to the Bar at Gray’s Inn.',
    source: 'BAWS Vol. 6: The Problem of the Rupee',
    volNo: 6
  },
  {
    id: 'mahad',
    title: 'Mahad (Chavdar Tale)',
    year: '1927',
    role: 'Water Satyagraha & Equality Declaration',
    coords: [18.08, 73.42],
    desc: 'Led the historic march to Chavdar Tale on March 20, asserting the fundamental human right to public water and universal dignity.',
    source: 'BAWS Vol. 17: Civil Rights Movements',
    volNo: 17
  },
  {
    id: 'delhi',
    title: 'New Delhi (Constituent Assembly)',
    year: '1947–1950',
    role: 'Law Minister & Drafting Chairman',
    coords: [28.61, 77.21],
    desc: 'Piloted the Constitution through the Constituent Assembly, embedding fundamental rights, separation of powers, and social democracy.',
    source: 'BAWS Vol. 13: Principal Architect of Constitution',
    volNo: 13
  },
  {
    id: 'nagpur',
    title: 'Nagpur (Deekshabhoomi)',
    year: '1956',
    role: 'Dhamma Chakra Pravartan',
    coords: [21.14, 79.08],
    desc: 'Led over 500,000 followers into Buddhism on October 14, administering the 22 Vows and completing his magnum opus "The Buddha and His Dhamma".',
    source: 'BAWS Vol. 11: The Buddha and His Dhamma',
    volNo: 11
  }
];

// Convert latitude and longitude into 3D Cartesian coordinates on sphere
function latLongToVector3(lat, lon, radius = 3.2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function JourneyScene({ activeIndex, onSelectStation }) {
  const { camera } = useThree();
  const globeRef = useRef();
  const targetCamPos = useRef(new THREE.Vector3(0, 1.5, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Compute 3D station positions on globe
  const stationVectors = useMemo(() => {
    return JOURNEY_STATIONS.map(s => latLongToVector3(s.coords[0], s.coords[1], 3.22));
  }, []);

  // Compute 3D curved flight arcs connecting the sequential journey
  const flightArcs = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < stationVectors.length - 1; i++) {
      const start = stationVectors[i];
      const end = stationVectors[i + 1];
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      // Lift midpoint outwards into atmosphere
      mid.normalize().multiplyScalar(4.0);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      arcs.push(curve.getPoints(24));
    }
    return arcs;
  }, [stationVectors]);

  // GSAP smooth camera pivot to active station
  useGSAP(() => {
    const activeVector = stationVectors[activeIndex];
    if (!activeVector) return;

    // Position camera outward along the station's normal vector
    const camTarget = activeVector.clone().normalize().multiplyScalar(6.5);
    camTarget.y += 0.8;

    gsap.to(targetCamPos.current, {
      x: camTarget.x,
      y: camTarget.y,
      z: camTarget.z,
      duration: 1.5,
      ease: 'power3.inOut'
    });

    gsap.to(targetLookAt.current, {
      x: activeVector.x * 0.4,
      y: activeVector.y * 0.4,
      z: activeVector.z * 0.4,
      duration: 1.5,
      ease: 'power3.inOut'
    });
  }, [activeIndex, stationVectors]);

  useFrame((state, delta) => {
    camera.position.lerp(targetCamPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Deep Space Atmosphere Lighting */}
      <ambientLight color="#0f172a" intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[-8, -5, -5]} intensity={1.4} color="#0284c7" />

      {/* 3D Terrestrial Archival Globe */}
      <group ref={globeRef}>
        {/* Core Ocean Sphere */}
        <mesh receiveShadow>
          <sphereGeometry args={[3.2, 64, 64]} />
          <meshStandardMaterial
            color="#080e1a"
            roughness={0.65}
            metalness={0.35}
          />
        </mesh>

        {/* Luminous Latitude/Longitude Wireframe Lines */}
        <mesh>
          <sphereGeometry args={[3.21, 24, 24]} />
          <meshBasicMaterial
            color="#1e293b"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Glowing Atmospheric Aura Shell */}
        <mesh>
          <sphereGeometry args={[3.38, 32, 32]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Transatlantic Flight Path Arcs */}
        {flightArcs.map((arcPoints, idx) => (
          <Line
            key={idx}
            points={arcPoints}
            color="#f59e0b"
            lineWidth={2.2}
            transparent
            opacity={0.75}
          />
        ))}

        {/* Historical Journey Stations */}
        {JOURNEY_STATIONS.map((station, i) => {
          const vec = stationVectors[i];
          const isActive = i === activeIndex;

          return (
            <group key={station.id} position={vec}>
              {/* Pulsing Beacon Node */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStation(i);
                }}
              >
                <sphereGeometry args={[isActive ? 0.14 : 0.08, 16, 16]} />
                <meshStandardMaterial
                  color={isActive ? '#f59e0b' : '#38bdf8'}
                  emissive={isActive ? '#f59e0b' : '#0284c7'}
                  emissiveIntensity={isActive ? 1.0 : 0.4}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>

              {/* Station Label */}
              <Html distanceFactor={14} position={[0, 0.25, 0]} center>
                <div
                  onClick={() => onSelectStation(i)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: isActive ? 'rgba(245, 158, 11, 0.95)' : 'rgba(9, 12, 22, 0.85)',
                    border: `1px solid ${isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)'}`,
                    color: isActive ? '#05070d' : '#f8fafc',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                    boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.6)' : 'none',
                    userSelect: 'none'
                  }}
                >
                  {station.year} • {station.title.split(' ')[0]}
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
