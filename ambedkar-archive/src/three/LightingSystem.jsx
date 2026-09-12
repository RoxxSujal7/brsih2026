import React from 'react';
import { getRecommendedQuality } from './QualityManager';

export default function LightingSystem({
  preset = 'studio_gold',
  ambientIntensity = 1.2,
  keyIntensity = 2.4,
  fillIntensity = 1.5,
  rimIntensity = 2.8
}) {
  const quality = getRecommendedQuality();
  const shadowsEnabled = quality.profile.shadows;
  const shadowMapSize = quality.profile.shadowMapSize || 512;

  return (
    <>
      {/* Deep blue/slate ambient fill */}
      <ambientLight color="#1e293b" intensity={ambientIntensity} />

      {/* Key Light: High-angle warm illumination */}
      <directionalLight
        position={[6, 10, 8]}
        intensity={keyIntensity}
        color="#ffffff"
        castShadow={shadowsEnabled}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0002}
      />

      {/* Fill Light: Soft cyan/dharma blue contrast */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={fillIntensity}
        color="#2563eb"
      />

      {/* Rim Light: Saffron/amber contour highlights */}
      <directionalLight
        position={[0, 8, -8]}
        intensity={rimIntensity}
        color="#f59e0b"
      />

      {/* Ground bounce light */}
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#c59b27" distance={10} />
    </>
  );
}
