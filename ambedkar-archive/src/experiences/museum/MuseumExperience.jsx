import React, { useState } from 'react';
import ThreeCanvas from '../../three/ThreeCanvas';
import ExitExperience from '../../three/ExitExperience';
import MuseumScene, { MUSEUM_ARTIFACTS } from './MuseumScene';
import SpotlightCard from '../../components/react-bits/Components/SpotlightCard/SpotlightCard';
import DecryptedText from '../../components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../../components/react-bits/TextAnimations/ShinyText/ShinyText';

export default function MuseumExperience() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeArtifact = MUSEUM_ARTIFACTS[activeIndex] || MUSEUM_ARTIFACTS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070d', overflow: 'hidden' }}>
      {/* 3D Museum Gallery Canvas */}
      <ThreeCanvas>
        <MuseumScene
          activeIndex={activeIndex}
          onSelectArtifact={setActiveIndex}
        />
      </ThreeCanvas>

      {/* Exit Bar */}
      <ExitExperience
        title="Digital Heritage Museum Vitrine"
        returnUrl="/archive.html"
        returnLabel="Return to Archive Library"
      />

      {/* Top Header HUD */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '32px',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          color: '#f59e0b',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <span>🏛️</span>
          <span>Curated Vitrine Exhibition</span>
        </div>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '2rem',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.04em',
          margin: 0,
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
        }}>
          <DecryptedText
            text="Digital Heritage Museum"
            speed={35}
            maxIterations={8}
            animateOn="view"
          />
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          margin: '4px 0 0',
          maxWidth: '460px',
          lineHeight: 1.5
        }}>
          Explore authentic, museum-grade 3D historical artifacts commemorating the life, philosophy, and constitutional achievements of Dr. Babasaheb Ambedkar.
        </p>
      </div>

      {/* Bottom Exhibit Selector Dock */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        zIndex: 140,
        display: 'flex',
        gap: '8px',
        background: 'rgba(9, 12, 22, 0.85)',
        padding: '8px',
        borderRadius: '9999px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        maxWidth: 'calc(100vw - 480px)',
        overflowX: 'auto'
      }}>
        {MUSEUM_ARTIFACTS.map((artifact, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={artifact.id}
              onClick={() => setActiveIndex(i)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive ? '#f59e0b' : 'transparent',
                color: isActive ? '#05070d' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {artifact.title}
            </button>
          );
        })}
      </div>

      {/* Right Artifact Provenance Dossier (React Bits SpotlightCard) */}
      <aside style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '430px',
        maxWidth: 'calc(100vw - 64px)',
        zIndex: 150
      }}>
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.35)"
          style={{
            background: 'rgba(9, 12, 22, 0.90)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '24px',
            padding: '24px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 24px rgba(197, 155, 39, 0.18)',
            color: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              Archival Provenance
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#64748b' }}>
              {activeIndex + 1} of {MUSEUM_ARTIFACTS.length}
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            marginBottom: '4px',
            color: '#ffffff'
          }}>
            {activeArtifact.title}
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '12px', fontWeight: 600 }}>
            {activeArtifact.epoch}
          </div>

          {/* Materials & Specifications */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '14px',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <strong style={{ color: '#e2e8f0', display: 'block' }}>Materials:</strong>
              {activeArtifact.materials}
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <strong style={{ color: '#e2e8f0', display: 'block' }}>Dimensions:</strong>
              {activeArtifact.dimensions}
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
            {activeArtifact.desc}
          </p>

          {/* Primary Archival Citation */}
          <div style={{
            marginBottom: '16px',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              Primary Archival Citation
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>
              {activeArtifact.source}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <a
              href="/archive.html"
              style={{
                fontSize: '0.82rem',
                color: '#94a3b8',
                textDecoration: 'none'
              }}
            >
              ← 60 Volumes Archive
            </a>

            <a
              href={`/archive.html?vol=${activeArtifact.volNo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <ShinyText
                text={`Read BAWS Vol. ${activeArtifact.volNo} ↗`}
                speed={2.5}
                color="#f59e0b"
                shineColor="#fef08a"
              />
            </a>
          </div>
        </SpotlightCard>
      </aside>
    </div>
  );
}
