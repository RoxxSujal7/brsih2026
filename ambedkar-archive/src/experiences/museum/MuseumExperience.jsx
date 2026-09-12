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
      {/* 3D Museum Gallery Canvas with eye-level perspective */}
      <ThreeCanvas camera={{ position: [0, 1.3, 4.2], fov: 42, near: 0.1, far: 100 }}>
        <MuseumScene
          activeIndex={activeIndex}
          onSelectArtifact={setActiveIndex}
        />
      </ThreeCanvas>

      {/* Exit Experience Bar */}
      <ExitExperience
        title="National Digital Heritage Vitrine Gallery"
        returnUrl="/archive.html"
        returnLabel="Return to Archive Library"
      />

      {/* Top Floating Museum Curatorial Badge (Double-Bezel Shell) */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '32px',
        zIndex: 100,
        pointerEvents: 'none',
        maxWidth: '480px'
      }}>
        <div style={{
          padding: '6px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{
            padding: '20px 24px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95), rgba(7, 10, 18, 0.98))',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <span>🏛️</span>
              <span>Curated Vitrine Exhibition</span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.03em',
              lineHeight: 1.15,
              margin: '0 0 8px 0',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              <DecryptedText
                text="Digital Heritage Museum"
                speed={30}
                maxIterations={10}
                animateOn="view"
              />
            </h1>

            <p style={{
              fontSize: '0.82rem',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.6
            }}>
              Authentic, museum-grade 3D historical artifacts commemorating the life, scholarship, and constitutional legacy of Dr. Babasaheb Ambedkar.
            </p>

            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#d4af37'
            }}>
              <span>Exhibition Gallery • 5 Masterpieces</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span>Click plinth or buttons to inspect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Exhibit Selector Dock (Button-in-Button Architecture) */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        zIndex: 140,
        display: 'flex',
        gap: '8px',
        background: 'rgba(9, 12, 22, 0.88)',
        padding: '6px',
        borderRadius: '9999px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        maxWidth: 'calc(100vw - 520px)',
        overflowX: 'auto'
      }}>
        {MUSEUM_ARTIFACTS.map((artifact, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={artifact.id}
              onClick={() => setActiveIndex(i)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px 6px 8px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'transparent',
                color: isActive ? '#05070d' : '#94a3b8',
                fontSize: '0.76rem',
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '9999px',
                background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#05070d' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {i + 1}
              </span>
              <span>{artifact.title}</span>
            </button>
          );
        })}
      </div>

      {/* Right Curatorial Provenance Dossier (Double-Bezel Nested Architecture) */}
      <aside style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '430px',
        maxWidth: 'calc(100vw - 64px)',
        zIndex: 150
      }}>
        <div style={{
          padding: '6px',
          borderRadius: '28px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
        }}>
          <SpotlightCard
            spotlightColor="rgba(245, 158, 11, 0.35)"
            style={{
              background: 'linear-gradient(145deg, rgba(13, 17, 26, 0.95), rgba(7, 10, 18, 0.98))',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '22px',
              padding: '22px',
              color: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                Archival Provenance
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {activeIndex + 1} of {MUSEUM_ARTIFACTS.length}
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.35rem',
              fontWeight: 800,
              marginBottom: '4px',
              color: '#ffffff'
            }}>
              {activeArtifact.title}
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginBottom: '14px', fontWeight: 600 }}>
              {activeArtifact.epoch}
            </div>

            {/* Curatorial Material Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '14px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Materials
                </div>
                <div style={{ fontSize: '0.74rem', color: '#f1f5f9', fontWeight: 600, marginTop: '2px' }}>
                  {activeArtifact.materials}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Dimensions
                </div>
                <div style={{ fontSize: '0.74rem', color: '#f1f5f9', fontWeight: 600, marginTop: '2px' }}>
                  {activeArtifact.dimensions}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
              {activeArtifact.desc}
            </p>

            {/* Archival Citation */}
            <div style={{
              padding: '10px 12px',
              background: 'rgba(245, 158, 11, 0.06)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 8px 8px 0',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px', fontWeight: 700 }}>
                Primary Archival Citation
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>
                {activeArtifact.source}
              </div>
            </div>

            {/* Actions */}
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
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>←</span> <span>60 Volumes Archive</span>
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
        </div>
      </aside>
    </div>
  );
}
