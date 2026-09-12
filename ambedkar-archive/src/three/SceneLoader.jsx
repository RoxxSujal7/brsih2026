import React from 'react';
import { useProgress } from '@react-three/drei';

export default function SceneLoader() {
  const { active, progress, errors, item, loaded, total } = useProgress();

  if (!active) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05070d',
      zIndex: 9999,
      transition: 'opacity 0.6s ease',
      pointerEvents: 'none'
    }}>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.9rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: '#f59e0b',
        marginBottom: '16px'
      }}>
        National Heritage Preservation
      </div>

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.4rem',
        fontWeight: 600,
        color: '#f8fafc',
        marginBottom: '24px'
      }}>
        Initializing 3D Spatial Environment...
      </h3>

      <div style={{
        width: '260px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${Math.round(progress)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #c59b27, #f59e0b)',
          borderRadius: '9999px',
          transition: 'width 0.2s ease',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)'
        }} />
      </div>

      <div style={{
        marginTop: '12px',
        fontSize: '0.78rem',
        color: '#64748b',
        fontFamily: 'monospace'
      }}>
        {Math.round(progress)}% loaded
      </div>
    </div>
  );
}
