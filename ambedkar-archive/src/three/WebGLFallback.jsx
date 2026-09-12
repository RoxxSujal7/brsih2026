import React from 'react';

export default function WebGLFallback({ title = '3D Experience Unavailable', returnUrl = '/timeline.html' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #07090e 0%, #0d121f 100%)',
      color: '#f8fafc',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '560px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '24px',
        padding: '40px 32px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚖️</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.85rem',
          fontWeight: 700,
          color: '#f59e0b',
          marginBottom: '12px'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: '#94a3b8',
          marginBottom: '28px'
        }}>
          Your current browser or hardware graphics environment cannot accelerate WebGL 3D scenes. The full historical archive, 60 BAWS volumes, and interactive 2D records are completely accessible.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={returnUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #c59b27, #93670c)',
              color: '#05070d',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.92rem'
            }}
          >
            ← Return to 2D Archive
          </a>
          <a
            href="/archive.html"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#f8fafc',
              textDecoration: 'none',
              fontSize: '0.92rem'
            }}
          >
            Browse 60 Volumes
          </a>
        </div>
      </div>
    </div>
  );
}
