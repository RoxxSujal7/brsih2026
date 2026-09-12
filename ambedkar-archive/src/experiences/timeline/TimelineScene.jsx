import React, { useMemo, useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TIMELINE_CATEGORIES } from '../../data/timelineData';
import ArtifactNode from './artifacts/ArtifactNode';

function MilestoneNode({
  event,
  index,
  position,
  isActive,
  onSelect
}) {
  const [hovered, setHovered] = useState(false);
  const category = TIMELINE_CATEGORIES[event.category] || TIMELINE_CATEGORIES.all;

  return (
    <group
      position={position}
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
    >
      {/* Museum-Grade 3D Historical Artifact */}
      <Suspense fallback={null}>
        <ArtifactNode
          event={event}
          isActive={isActive}
          isHovered={hovered}
        />
      </Suspense>

      {/* Vertical Archival Spotlight Beacon */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshBasicMaterial
          color={isActive ? '#f59e0b' : category.color}
          transparent
          opacity={isActive ? 0.8 : 0.3}
        />
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

  // Animate target camera coordinates using GSAP on activeIndex change
  useGSAP(() => {
    const activePos = nodePositions[activeIndex];
    if (!activePos) return;

    gsap.to(targetCamPos.current, {
      x: activePos[0] + 1.2,
      y: activePos[1] + 1.1,
      z: activePos[2] + 5.6,
      duration: 1.2,
      ease: 'power2.out'
    });

    gsap.to(targetLookAt.current, {
      x: activePos[0],
      y: activePos[1] + 0.3,
      z: activePos[2],
      duration: 1.2,
      ease: 'power2.out'
    });
  }, [activeIndex, nodePositions]);

  // Continuously orient camera along lookAt
  useFrame(() => {
    camera.position.lerp(targetCamPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
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

      {/* Active Milestone Museum Gallery Spotlight */}
      {nodePositions[activeIndex] && (
        <spotLight
          position={[
            nodePositions[activeIndex][0] + 1.8,
            nodePositions[activeIndex][1] + 3.2,
            nodePositions[activeIndex][2] + 3.8
          ]}
          angle={0.65}
          penumbra={0.8}
          intensity={4.5}
          color="#fffbeb"
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
