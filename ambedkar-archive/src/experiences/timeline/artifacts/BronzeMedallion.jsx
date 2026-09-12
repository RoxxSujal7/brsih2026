import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import textureUrl from '../../../assets/textures/antique_bronze_patina.jpg';

export default function BronzeMedallion({ isActive, isHovered }) {
  const groupRef = useRef();
  const discRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle archival breathing sway (NO wild spinning!)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
    }
    if (discRef.current) {
      const targetTilt = isHovered ? -0.1 : -0.16;
      discRef.current.rotation.x = THREE.MathUtils.lerp(
        discRef.current.rotation.x,
        targetTilt + Math.sin(state.clock.elapsedTime * 1.1) * 0.015,
        delta * 3
      );
    }
  });

  return (
    <group ref={groupRef} scale={isActive ? 1.08 : 0.92}>
      {/* Matte Steel Archival Exhibition Stand */}
      <group position={[0, -0.45, -0.05]} rotation={[-0.14, 0, 0]}>
        {/* Horizontal Crossbar */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.06, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Twin Vertical Upright Prongs with Brass Tips */}
        {[-0.42, 0.42].map((x, idx) => (
          <group key={idx} position={[x, 0.22, 0.04]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.48, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.22, 0.03]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.12, 16]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Main Cast Heavy Bronze Commemorative Medallion (1930–1932 London Round Table Conference) */}
      <group ref={discRef} position={[0, 0.12, 0.08]} rotation={[-0.16, 0, 0]}>
        {/* Main Cast Bronze Disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.12, 64]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.38}
            metalness={0.8}
            bumpMap={texture}
            bumpScale={0.08}
          />
        </mesh>

        {/* Outer Raised Laurel & Beaded Rim */}
        <mesh position={[0, 0, 0.065]}>
          <torusGeometry args={[0.78, 0.035, 16, 64]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Inner Concentric Medallion Ring */}
        <mesh position={[0, 0, 0.065]}>
          <torusGeometry args={[0.54, 0.02, 16, 64]} />
          <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.9} />
        </mesh>

        {/* Central High-Relief Boss Embodying the 1932 Poona Pact Rights */}
        <mesh position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.35}
            metalness={0.82}
            bumpMap={texture}
            bumpScale={0.12}
          />
        </mesh>

        {/* Dedicated Grazing Rim Light to highlight verdigris patina and raised relief */}
        <pointLight
          position={[-0.8, 0.6, 1.2]}
          color="#fef08a"
          intensity={isActive ? 3.8 : 1.4}
          distance={3.0}
        />
      </group>
    </group>
  );
}
