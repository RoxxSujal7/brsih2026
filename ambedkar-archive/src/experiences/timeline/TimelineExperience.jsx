import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ThreeCanvas from '../../three/ThreeCanvas';
import LightingSystem from '../../three/LightingSystem';
import EnvironmentSystem from '../../three/EnvironmentSystem';
import ExitExperience from '../../three/ExitExperience';
import SceneLoader from '../../three/SceneLoader';
import TimelineScene from './TimelineScene';
import TimelineControls from './TimelineControls';
import MilestoneCard from './MilestoneCard';
import { TIMELINE_EVENTS } from '../../data/timelineData';

export default function TimelineExperience() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Filter events by selected category
  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return TIMELINE_EVENTS;
    return TIMELINE_EVENTS.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  // Ensure activeIndex is within bounds when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // Audio synthesis feedback (gentle acoustic click)
  const playClickSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }, []);

  const handleSelectMilestone = useCallback((idx) => {
    setActiveIndex(idx);
    playClickSound();
  }, [playClickSound]);

  const handleNext = useCallback(() => {
    if (activeIndex < filteredEvents.length - 1) {
      setActiveIndex(prev => prev + 1);
      playClickSound();
    }
  }, [activeIndex, filteredEvents.length, playClickSound]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      playClickSound();
    }
  }, [activeIndex, playClickSound]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Space for tour)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Auto-tour timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev >= filteredEvents.length - 1) return 0;
        return prev + 1;
      });
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredEvents.length]);

  const currentEvent = filteredEvents[activeIndex] || filteredEvents[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#05070d' }}>
      {/* Top Experience Exit Bar */}
      <ExitExperience
        title="3D Chronological Milestones"
        returnUrl="/timeline.html"
        returnLabel="Return to 2D Timeline"
      />

      {/* R3F Canvas Scene */}
      <ThreeCanvas>
        <LightingSystem />
        <EnvironmentSystem />
        <TimelineScene
          events={filteredEvents}
          activeIndex={activeIndex}
          onSelectMilestone={handleSelectMilestone}
        />
      </ThreeCanvas>

      {/* 2D HUD Overlays */}
      <TimelineControls
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currentIndex={activeIndex}
        totalEvents={filteredEvents.length}
        currentYear={currentEvent ? currentEvent.year : 1891}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying(prev => !prev)}
      />

      {/* Milestone Inspection Detail Card */}
      <MilestoneCard
        event={currentEvent}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={activeIndex < filteredEvents.length - 1}
        hasPrev={activeIndex > 0}
      />

      {/* Loading Progress */}
      <SceneLoader />
    </div>
  );
}
