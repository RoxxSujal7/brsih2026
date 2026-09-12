import React from 'react';
import { TIMELINE_CATEGORIES } from '../../data/timelineData';

export default function TimelineControls({
  selectedCategory,
  onSelectCategory,
  currentIndex,
  totalEvents,
  currentYear,
  isAutoPlaying,
  onToggleAutoPlay
}) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '32px',
      left: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 140,
      pointerEvents: 'auto',
      maxWidth: 'calc(100vw - 64px)'
    }}>
      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        background: 'rgba(9, 12, 22, 0.75)',
        padding: '6px',
        borderRadius: '9999px',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {Object.entries(TIMELINE_CATEGORIES).map(([key, cat]) => {
          const isActive = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive ? cat.color : 'transparent',
                color: isActive ? '#05070d' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Progress and Scrubber Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: 'rgba(9, 12, 22, 0.75)',
        padding: '8px 16px',
        borderRadius: '9999px',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: 'fit-content'
      }}>
        <button
          onClick={onToggleAutoPlay}
          title={isAutoPlaying ? 'Pause Automated Tour' : 'Play Automated Tour'}
          style={{
            background: 'none',
            border: 'none',
            color: isAutoPlaying ? '#f59e0b' : '#94a3b8',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{isAutoPlaying ? '⏸️' : '▶️'}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{isAutoPlaying ? 'Pause' : 'Tour'}</span>
        </button>

        <div style={{
          width: '1px',
          height: '14px',
          background: 'rgba(255, 255, 255, 0.15)'
        }} />

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          color: '#cbd5e1'
        }}>
          Year: <strong style={{ color: '#f59e0b' }}>{currentYear}</strong>
        </div>

        <div style={{
          width: '1px',
          height: '14px',
          background: 'rgba(255, 255, 255, 0.15)'
        }} />

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          {currentIndex + 1} of {totalEvents}
        </div>
      </div>
    </div>
  );
}
