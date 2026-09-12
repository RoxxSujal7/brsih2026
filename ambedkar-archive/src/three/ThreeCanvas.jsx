import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { getRecommendedQuality } from './QualityManager';

export default function ThreeCanvas({
  children,
  camera = { position: [0, 2, 8], fov: 45, near: 0.1, far: 1000 },
  style = {},
  onCreated,
  ...props
}) {
  const quality = getRecommendedQuality();
  const canvasRef = useRef(null);

  // Clean WebGL context and GPU resources on unmount
  useEffect(() => {
    return () => {
      // Fiber handles children disposal, this ensures renderer state resets
      THREE.Cache.clear();
    };
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      camera={camera}
      dpr={quality.profile.dpr}
      shadows={quality.profile.shadows}
      gl={{
        antialias: quality.profile.antialias,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        outline: 'none',
        ...style
      }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color('#05070d');
        scene.fog = new THREE.FogExp2('#05070d', 0.035);
        if (onCreated) onCreated({ gl, scene });
      }}
      {...props}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
