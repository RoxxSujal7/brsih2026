import React, { useState } from 'react';
import ThreeCanvas from '../../three/ThreeCanvas';
import ExitExperience from '../../three/ExitExperience';
import JourneyScene, { JOURNEY_STATIONS } from './JourneyScene';
import SpotlightCard from '../../components/react-bits/Components/SpotlightCard/SpotlightCard';
import DecryptedText from '../../components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../../components/react-bits/TextAnimations/ShinyText/ShinyText';

export default function JourneyExperience() {
  const [activeIndex, setActiveIndex] = useState(2); // Start at Columbia University

  const activeStation = JOURNEY_STATIONS[activeIndex] || JOURNEY_STATIONS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070d', overflow: 'hidden' }}>
      {/* 3D Cartographic Desk Viewport */}
      <ThreeCanvas camera={{ position: [0, 2.8, 2.4], fov: 40, near: 0.1, far: 100 }}>
        <JourneyScene
          activeIndex={activeIndex}
          onSelectStation={setActiveIndex}
        />
      </ThreeCanvas>

      {/* Exit Bar */}
      <ExitExperience
        title="1920s Archival Cartographic Desk • Global Journey"
        returnUrl="/timeline.html"
        returnLabel="Return to Timeline"
      />

      {/* Top Floating Curatorial Badge (Double-Bezel Shell) */}
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
            border: '1px solid rgba(245, 158, 11, 0.25)'
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
              <span>🧭</span>
              <span>1891–1956 Global Odyssey</span>
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
                text="Archival Journey Map"
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
              Authentic 1920s cartographic desk tracing Dr. Ambedkar’s international intellectual odyssey from Bombay across the Atlantic to Columbia University, London School of Economics, and the constitutional assemblies of India.
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
              <span>Transatlantic Routes & Historic Stations</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span>Click markers to navigate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Station Selector Dock (Button-in-Button Architecture) */}
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
        {JOURNEY_STATIONS.map((station, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={station.id}
              onClick={() => setActiveIndex(i)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px 6px 8px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'transparent',
                color: isActive ? '#05070d' : '#94a3b8',
                fontSize: '0.75rem',
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
              <span>{station.title.split(' ')[0]} ({station.year})</span>
            </button>
          );
        })}
      </div>

      {/* Right Station Dossier Card (Double-Bezel Nested Architecture) */}
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
                Historic Station
              </span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b' }}>
                <ShinyText text={activeStation.year} speed={3} color="#f59e0b" shineColor="#fef08a" />
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.35rem',
              fontWeight: 800,
              marginBottom: '4px',
              color: '#ffffff'
            }}>
              {activeStation.title}
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginBottom: '14px', fontWeight: 600 }}>
              {activeStation.role}
            </div>

            <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
              {activeStation.desc}
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
                Primary Historical Source
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fde68a', fontWeight: 600 }}>
                {activeStation.source}
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
                href="/timeline.html"
                style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>←</span> <span>2D Chronology</span>
              </a>

              <a
                href={`/archive.html?vol=${activeStation.volNo}`}
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
                  text={`Read BAWS Vol. ${activeStation.volNo} ↗`}
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
