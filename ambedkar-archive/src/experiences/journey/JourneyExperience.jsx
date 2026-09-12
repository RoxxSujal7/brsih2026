import React, { useState } from 'react';
import ThreeCanvas from '../../three/ThreeCanvas';
import ExitExperience from '../../three/ExitExperience';
import JourneyScene, { JOURNEY_STATIONS } from './JourneyScene';
import SpotlightCard from '../../components/react-bits/Components/SpotlightCard/SpotlightCard';
import DecryptedText from '../../components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../../components/react-bits/TextAnimations/ShinyText/ShinyText';

export default function JourneyExperience() {
  const [activeIndex, setActiveIndex] = useState(2); // Start at New York (Columbia)

  const activeStation = JOURNEY_STATIONS[activeIndex] || JOURNEY_STATIONS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070d', overflow: 'hidden' }}>
      {/* 3D Terrestrial Globe Viewport */}
      <ThreeCanvas>
        <JourneyScene
          activeIndex={activeIndex}
          onSelectStation={setActiveIndex}
        />
      </ThreeCanvas>

      {/* Exit Bar */}
      <ExitExperience
        title="Global Journey & Archival Geography"
        returnUrl="/timeline.html"
        returnLabel="Return to Timeline"
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
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          color: '#38bdf8',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <span>🗺️</span>
          <span>Transatlantic Intellectual Trajectory</span>
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
            text="Global Journey Map"
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
          Trace Dr. Ambedkar's international academic odyssey across Columbia University, London School of Economics, Gray's Inn, and the civil rights epicenters of India.
        </p>
      </div>

      {/* Bottom Station Selector Dock */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        zIndex: 140,
        display: 'flex',
        gap: '6px',
        background: 'rgba(9, 12, 22, 0.85)',
        padding: '6px',
        borderRadius: '9999px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        maxWidth: 'calc(100vw - 480px)',
        overflowX: 'auto'
      }}>
        {JOURNEY_STATIONS.map((station, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={station.id}
              onClick={() => setActiveIndex(i)}
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive ? '#38bdf8' : 'transparent',
                color: isActive ? '#05070d' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {station.title.split(' ')[0]} ({station.year})
            </button>
          );
        })}
      </div>

      {/* Right Station Dossier Card (React Bits SpotlightCard) */}
      <aside style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '430px',
        maxWidth: 'calc(100vw - 64px)',
        zIndex: 150
      }}>
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.35)"
          style={{
            background: 'rgba(9, 12, 22, 0.90)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '24px',
            padding: '24px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 24px rgba(56, 189, 248, 0.18)',
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
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              Station {activeIndex + 1} of {JOURNEY_STATIONS.length}
            </span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
              <ShinyText text={activeStation.year} speed={3} color="#38bdf8" shineColor="#bae6fd" />
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            marginBottom: '4px',
            color: '#ffffff'
          }}>
            {activeStation.title}
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '14px', fontWeight: 600 }}>
            {activeStation.role}
          </div>

          <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
            {activeStation.desc}
          </p>

          {/* Archival Citation Box */}
          <div style={{
            marginBottom: '16px',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              Primary Archival Citation
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600 }}>
              {activeStation.source}
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
              href="/timeline.html"
              style={{
                fontSize: '0.82rem',
                color: '#94a3b8',
                textDecoration: 'none'
              }}
            >
              ← Chronological Timeline
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
                color="#38bdf8"
                shineColor="#bae6fd"
              />
            </a>
          </div>
        </SpotlightCard>
      </aside>
    </div>
  );
}
