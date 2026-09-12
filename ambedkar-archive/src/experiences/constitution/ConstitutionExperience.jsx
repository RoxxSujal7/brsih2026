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
    desc: 'The paramount pillar securing equality of opportunity, eliminating hereditary privilege, and dismantling caste oppression.',
    article: 'Article 14, 15 & 16',
    quote: '"Justice is another name for liberty, equality and fraternity."'
  },
  {
    id: 'liberty',
    title: 'LIBERTY',
    sub: 'Thought, Expression, Belief & Worship',
    desc: 'Freedom of conscience and individual speech anchored in unshakeable fundamental constitutional guarantees.',
    article: 'Article 19 & 25',
    quote: '"Constitutional morality is not a natural sentiment. It has to be cultivated."'
  },
  {
    id: 'equality',
    title: 'EQUALITY',
    sub: 'Status & Equal Protection',
    desc: 'Absolute abolition of Untouchability (Article 17) and affirmative equality before the supreme law of the Republic.',
    article: 'Article 17 & 18',
    quote: '"Equality may be a fiction but nonetheless one must accept it as the governing principle."'
  },
  {
    id: 'fraternity',
    title: 'FRATERNITY',
    sub: 'Assuring the Dignity of the Individual',
    desc: 'The spiritual cement uniting the democratic body politic. Without fraternity, liberty and equality cannot survive.',
    article: 'Preamble Solemn Pledge',
    quote: '"Fraternity means a sense of common brotherhood of all Indians."'
  }
];

export default function ConstitutionExperience() {
  const [activeSection, setActiveSection] = useState('justice');
  const [isPageTurned, setIsPageTurned] = useState(false);

  const currentPillar = PILLARS.find(p => p.id === activeSection) || PILLARS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070d', overflow: 'hidden' }}>
      {/* 3D Scene Viewport with museum eye-level focal length */}
      <ThreeCanvas camera={{ position: [0, 1.05, 4.6], fov: 42, near: 0.1, far: 100 }}>
        <ConstitutionScene
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          isPageTurned={isPageTurned}
          onTogglePageTurn={() => setIsPageTurned(!isPageTurned)}
        />
      </ThreeCanvas>

      {/* Exit Experience Navigation Bar */}
      <ExitExperience
        title="National Archives • The Constitution of India"
        returnUrl="/constitution.html"
        returnLabel="Return to Constitution Portal"
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
        {/* Outer Double-Bezel Enclosure */}
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
              <span>⚖️</span>
              <span>1947–1950 National Archival Treasure</span>
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
                text="The Constitution of India"
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
              Authored under Dr. B. R. Ambedkar’s drafting chairmanship. Bound in oxblood morocco leather with hand-embossed 24k gold leaf and illuminated Shantiniketan vellum folios.
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
              <span>🏛️ National Archives of India</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span>251 Illuminated Vellum Folios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Control Island (Button-in-Button & Segmented Pillars) */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '32px',
        zIndex: 140,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Master Folio State Toggle: Button-in-Button Architecture */}
        <button
          onClick={() => setIsPageTurned(!isPageTurned)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 20px 6px 8px',
            borderRadius: '9999px',
            background: isPageTurned
              ? 'linear-gradient(135deg, #b45309, #78350f)'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: isPageTurned ? '#ffffff' : '#05070d',
            fontWeight: 800,
            fontSize: '0.82rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
          }}
        >
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>
            {isPageTurned ? '📖' : '📜'}
          </span>
          <span>{isPageTurned ? 'Inspect Bound Cover' : 'Open Illuminated Leaves'}</span>
        </button>

        {/* Four Constitutional Pillars Segmented Selector */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(9, 12, 22, 0.85)',
          padding: '5px',
          borderRadius: '9999px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}>
          {PILLARS.map(p => {
            const isSelected = activeSection === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveSection(p.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isSelected
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'transparent',
                  color: isSelected ? '#05070d' : '#94a3b8',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 800 : 600,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Curatorial Dossier Card (React Bits SpotlightCard with Double-Bezel) */}
      <aside style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '420px',
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
                Constitutional Foundation
              </span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b' }}>
                <ShinyText text="1950" speed={3} color="#f59e0b" shineColor="#fef08a" />
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.45rem',
                fontWeight: 800,
                margin: 0,
                color: '#ffffff'
              }}>
                {currentPillar.title}
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                {currentPillar.article}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px', marginBottom: '10px', fontWeight: 500 }}>
              {currentPillar.sub}
            </div>

            <p style={{ fontSize: '0.84rem', lineHeight: 1.6, color: '#94a3b8', margin: '0 0 14px 0' }}>
              {currentPillar.desc}
            </p>

            {/* Dr. Ambedkar Quote */}
            <div style={{
              padding: '10px 14px',
              background: 'rgba(245, 158, 11, 0.06)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 8px 8px 0',
              marginBottom: '14px'
            }}>
              <p style={{
                fontSize: '0.78rem',
                fontStyle: 'italic',
                color: '#fde68a',
                lineHeight: 1.5,
                margin: 0
              }}>
                {currentPillar.quote}
              </p>
            </div>

            {/* Archival Citation Box */}
            <div style={{
              marginBottom: '14px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px', fontWeight: 700 }}>
                Primary Archival Source
              </div>
              <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                BAWS Vol. 13: Principal Architect of the Constitution
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Constituent Assembly Debates & Final Presentation Draft (1949)
              </div>
            </div>

            {/* Links */}
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
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>←</span> <span>2D Constitution Portal</span>
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
        </div>
      </aside>
    </div>
  );
}
