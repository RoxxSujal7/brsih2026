import React from 'react';
import { TIMELINE_CATEGORIES } from '../../data/timelineData';

export default function MilestoneCard({ event, onClose, onNext, onPrev, hasPrev, hasNext }) {
  if (!event) return null;

  const category = TIMELINE_CATEGORIES[event.category] || TIMELINE_CATEGORIES.all;

  return (
    <aside
      id="milestone-inspector-card"
      role="dialog"
      aria-label={`Milestone: ${event.title}`}
      style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        width: '420px',
        maxWidth: 'calc(100vw - 64px)',
        background: 'rgba(9, 12, 22, 0.88)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '20px',
        padding: '24px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 24px rgba(197, 155, 39, 0.15)',
        zIndex: 150,
        color: '#f8fafc',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top row: Category tag and Year */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>{event.icon}</span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '3px 10px',
            borderRadius: '9999px',
            background: `${category.color}22`,
            color: category.color,
            border: `1px solid ${category.color}55`
          }}>
            {category.label}
          </span>
        </div>

        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#f59e0b',
          letterSpacing: '0.04em'
        }}>
          {event.year}
        </div>
      </div>

      {/* Title & Metadata */}
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.3rem',
        fontWeight: 700,
        lineHeight: 1.3,
        marginBottom: '6px',
        color: '#ffffff'
      }}>
        {event.title}
      </h3>

      <div style={{
        fontSize: '0.8rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '14px'
      }}>
        <span>📅 {event.exactDate}</span>
        <span>•</span>
        <span>📍 {event.location}</span>
      </div>

      {/* Quote callout if available */}
      {event.quote && (
        <blockquote style={{
          borderLeft: '2px solid #f59e0b',
          paddingLeft: '12px',
          margin: '0 0 14px 0',
          fontStyle: 'italic',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          color: '#e2e8f0',
          background: 'rgba(245, 158, 11, 0.05)',
          borderRadius: '0 8px 8px 0',
          paddingTop: '6px',
          paddingBottom: '6px'
        }}>
          "{event.quote}"
        </blockquote>
      )}

      {/* Narrative Detail */}
      <p style={{
        fontSize: '0.86rem',
        lineHeight: 1.55,
        color: '#cbd5e1',
        marginBottom: '16px',
        maxHeight: '120px',
        overflowY: 'auto'
      }}>
        {event.detail || event.desc}
      </p>

      {/* Book Reference Link */}
      {event.bookRef && (
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
            {event.bookRef.volTitle}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {event.bookRef.chapter}
          </div>
        </div>
      )}

      {/* Action and Navigation footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            title="Previous Milestone (Left Arrow)"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: hasPrev ? '#f8fafc' : '#475569',
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            ←
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            title="Next Milestone (Right Arrow)"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: hasNext ? '#f8fafc' : '#475569',
              cursor: hasNext ? 'pointer' : 'not-allowed',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            →
          </button>
        </div>

        <a
          href={event.bookRef ? `/archive.html?vol=${event.bookRef.volNo}` : '/archive.html'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#f59e0b',
            textDecoration: 'none'
          }}
        >
          <span>Read in BAWS Archive</span>
          <span>↗</span>
        </a>
      </div>
    </aside>
  );
}
