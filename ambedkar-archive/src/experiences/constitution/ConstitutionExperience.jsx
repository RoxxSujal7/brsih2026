import React, { useState } from 'react';
import ThreeCanvas from '../../three/ThreeCanvas';
import ExitExperience from '../../three/ExitExperience';
import ConstitutionScene from './ConstitutionScene';
import SpotlightCard from '../../components/react-bits/Components/SpotlightCard/SpotlightCard';
import DecryptedText from '../../components/react-bits/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../../components/react-bits/TextAnimations/ShinyText/ShinyText';

const PILLARS = [
  {
    id: 'justice',
    title: 'JUSTICE',
    sub: 'Social, Economic & Political',
    desc: 'The paramount pillar securing equality of opportunity and dismantling caste-based discrimination.'
  },
  {
    id: 'liberty',
    title: 'LIBERTY',
    sub: 'Thought, Expression, Belief & Worship',
    desc: 'Freedom of conscience and individual dignity anchored in unshakeable constitutional guarantees.'
  },
  {
    id: 'equality',
    title: 'EQUALITY',
    sub: 'Status and Opportunity',
    desc: 'Abolition of Untouchability (Article 17) and affirmative equality before the supreme law.'
  },
  {
    id: 'fraternity',
    title: 'FRATERNITY',
    sub: 'Assuring the Dignity of the Individual',
    desc: '"Without fraternity, liberty and equality could not become a natural course of things." — Dr. Ambedkar'
  }
];

export default function ConstitutionExperience() {
  const [activeSection, setActiveSection] = useState('justice');
  const [isPageTurned, setIsPageTurned] = useState(false);

  const currentPillar = PILLARS.find(p => p.id === activeSection) || PILLARS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070d', overflow: 'hidden' }}>
      {/* 3D Scene Viewport */}
      <ThreeCanvas>
        <ConstitutionScene
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          isPageTurned={isPageTurned}
          onTogglePageTurn={() => setIsPageTurned(!isPageTurned)}
        />
      </ThreeCanvas>

      {/* Exit Experience Navigation Bar */}
      <ExitExperience
        title="Illuminated Constitutional Discovery"
        returnUrl="/constitution.html"
        returnLabel="Return to Constitution Portal"
      />

      {/* Floating Header HUD */}
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
          <span>⚖️</span>
          <span>1947–1950 National Heritage Folio</span>
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
            text="The Constitution of India"
            speed={35}
            maxIterations={8}
            animateOn="view"
          />
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          margin: '4px 0 0',
          maxWidth: '440px',
          lineHeight: 1.5
        }}>
          Crafted under the chairmanship of Dr. B. R. Ambedkar. 251 vellum pages bound in oxblood morocco leather with 24-spoke gold foil Ashoka Chakra.
        </p>
      </div>

      {/* Interactive Page View Toggle */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        zIndex: 140,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setIsPageTurned(!isPageTurned)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            border: 'none',
            color: '#05070d',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{isPageTurned ? '📖 View Bound Cover' : '📜 Open Preamble Pages'}</span>
        </button>

        {/* Pillar Switcher Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(9, 12, 22, 0.8)',
          padding: '6px',
          borderRadius: '9999px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {PILLARS.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveSection(p.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: activeSection === p.id ? '#f59e0b' : 'transparent',
                color: activeSection === p.id ? '#05070d' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: activeSection === p.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Dossier Card (React Bits SpotlightCard) */}
      <aside style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '420px',
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
              Constitutional Foundation
            </span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>
              <ShinyText text="1950" speed={3} color="#f59e0b" shineColor="#fef08a" />
            </span>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            marginBottom: '4px',
            color: '#ffffff'
          }}>
            {currentPillar.title}
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '12px', fontWeight: 600 }}>
            {currentPillar.sub}
          </div>

          <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
            {currentPillar.desc}
          </p>

          {/* Archival Citation Box */}
          <div style={{
            marginBottom: '16px',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              Primary Archival Source
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
              BAWS Vol. 13: Principal Architect of the Constitution
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Constituent Assembly Debates & Final Presentation Draft
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
              href="/constitution.html"
              style={{
                fontSize: '0.82rem',
                color: '#94a3b8',
                textDecoration: 'none'
              }}
            >
              ← 2D Constitution Portal
            </a>

            <a
              href="/archive.html?vol=13"
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
                text="Read BAWS Vol. 13 ↗"
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
