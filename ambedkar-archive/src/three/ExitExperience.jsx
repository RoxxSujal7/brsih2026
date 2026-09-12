import React, { useEffect } from 'react';

export default function ExitExperience({
  title = '3D Timeline Experience',
  returnUrl = '/timeline.html',
  returnLabel = 'Return to 2D Timeline'
}) {
  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        window.location.href = returnUrl;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnUrl]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, rgba(5, 7, 13, 0.85) 0%, rgba(5, 7, 13, 0) 100%)'
    }}>
      {/* Left: Brand & Return link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
        <a
          href={returnUrl}
          id="exit-experience-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#f8fafc',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.18)';
            e.currentTarget.style.borderColor = '#f59e0b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
          }}
        >
          <span>←</span>
          <span>{returnLabel}</span>
        </a>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          paddingLeft: '14px'
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#f59e0b'
          }}>
            Ambedkar Digital Heritage Archive
          </span>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 500,
            color: '#cbd5e1'
          }}>
            {title}
          </span>
        </div>
      </div>

      {/* Right: Controls & Hints */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.72rem',
          color: '#94a3b8',
          fontFamily: 'monospace'
        }}>
          <span>⌨️ [← / →] Navigate</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>[ESC] Exit</span>
        </div>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}
        >
          ⛶
        </button>
      </div>
    </header>
  );
}
