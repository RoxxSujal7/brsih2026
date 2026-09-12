import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE_CATEGORIES } from '../../data/timelineData';

function MilestoneNode({
  event,
  index,
  position,
  isActive,
  onSelect
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const ringRef = useRef();
  const category = TIMELINE_CATEGORIES[event.category] || TIMELINE_CATEGORIES.all;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isActive ? 1.2 : 0.4);
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef.current && isActive) {
      ringRef.current.rotation.z += delta * 0.8;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const nodeColor = isActive ? '#f59e0b' : hovered ? '#38bdf8' : category.color;

  return (
    <group position={position}>
      {/* 3D Interactive Faceted Crystal Pylon */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          castShadow
        >
          <octahedronGeometry args={[isActive ? 0.9 : 0.65, 0]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={isActive ? 0.7 : hovered ? 0.4 : 0.15}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Radiant Glowing Ground Ring for Active Milestone */}
      {isActive && (
        <mesh ref={ringRef} position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.35, 32]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Vertical Golden Pillar Beacon */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.5} />
      </mesh>

      {/* Floating 3D Year & Title Tag */}
      <Html
        position={[0, 1.4, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={() => onSelect(index)}
          style={{
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: isActive
              ? 'rgba(245, 158, 11, 0.95)'
              : hovered
              ? 'rgba(56, 189, 248, 0.85)'
              : 'rgba(9, 12, 22, 0.75)',
            border: `1px solid ${isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)'}`,
            backdropFilter: 'blur(10px)',
            color: isActive ? '#05070d' : '#f8fafc',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            boxShadow: isActive
              ? '0 0 20px rgba(245, 158, 11, 0.6)'
              : '0 4px 12px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.2s ease',
            userSelect: 'none'
          }}
        >
          <span>{event.icon}</span>
          <span>{event.year}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.title}
          </span>
        </div>
      </Html>
    </group>
  );
}

export default function TimelineScene({
  events,
  activeIndex,
  onSelectMilestone
}) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 2, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Compute 3D node positions along an undulating chronological spline
  const nodePositions = useMemo(() => {
    return events.map((_, i) => [
      Math.sin(i * 0.48) * 3.8,
      Math.cos(i * 0.32) * 0.9,
      -i * 7.2
    ]);
  }, [events]);

  // Spline track line points connecting all nodes
  const splinePoints = useMemo(() => {
    if (nodePositions.length < 2) return [];
    const curve = new THREE.CatmullRomCurve3(
      nodePositions.map(p => new THREE.Vector3(...p)),
      false,
      'centripetal',
      0.5
    );
    return curve.getPoints(nodePositions.length * 16);
  }, [nodePositions]);

  // Update target camera position when active index changes
  useFrame((_, delta) => {
    const activePos = nodePositions[activeIndex];
    if (activePos) {
      targetCamPos.current.set(
        activePos[0] + 1.2,
        activePos[1] + 1.1,
        activePos[2] + 5.6
      );
      targetLookAt.current.set(
        activePos[0],
        activePos[1] + 0.3,
        activePos[2]
      );
    }

    // Fluid Apple-style smooth camera interpolation
    camera.position.lerp(targetCamPos.current, 0.055);
    currentLookAt.current.lerp(targetLookAt.current, 0.055);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group>
      {/* 3D Spline Timeline Trajectory Ribbon */}
      {splinePoints.length > 0 && (
        <Line
          points={splinePoints}
          color="#f59e0b"
          lineWidth={2.2}
          transparent
          opacity={0.65}
        />
      )}

      {/* Render all milestone nodes */}
      {events.map((event, idx) => (
        <MilestoneNode
          key={event.id || idx}
          event={event}
          index={idx}
          position={nodePositions[idx]}
          isActive={idx === activeIndex}
          onSelect={onSelectMilestone}
        />
      ))}
    </group>
  );
}
