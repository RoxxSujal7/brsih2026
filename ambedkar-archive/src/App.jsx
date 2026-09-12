import React, { useState, useEffect } from 'react';
import TimelineExperience from './experiences/timeline/TimelineExperience';
import ConstitutionExperience from './experiences/constitution/ConstitutionExperience';
import MuseumExperience from './experiences/museum/MuseumExperience';
import JourneyExperience from './experiences/journey/JourneyExperience';
import WebGLFallback from './three/WebGLFallback';
import { detectDeviceCapabilities } from './three/DeviceDetection';
import useLenis from './utils/useLenis';

export default function App() {
  useLenis();

  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    if (path.includes('/journey')) return 'journey';
    if (path.includes('/constitution')) return 'constitution';
    if (path.includes('/speeches')) return 'speeches';
    if (path.includes('/museum')) return 'museum';
    return 'timeline';
  });

  const caps = detectDeviceCapabilities();

  // If device doesn't support WebGL, render fallback
  if (!caps.hasWebGL) {
    return <WebGLFallback returnUrl="/timeline.html" />;
  }

  switch (currentRoute) {
    case 'constitution':
      return <ConstitutionExperience />;
    case 'museum':
      return <MuseumExperience />;
    case 'journey':
      return <JourneyExperience />;
    case 'timeline':
    default:
      return <TimelineExperience />;
  }
}
