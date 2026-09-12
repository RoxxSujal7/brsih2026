---
name: lenis
description: Guide for Darkroom Engineering Lenis — high-performance smooth scrolling for modern web applications, React Three Fiber, GSAP ScrollTrigger, and WebGL sync.
---

# Lenis Smooth Scroll by Darkroom Engineering

**Lenis** is the modern, lightweight, robust smooth scroll library developed by Darkroom Engineering. It provides buttery smooth inertial scrolling with complete keyboard accessibility, touch support, and synchronization with GSAP and WebGL render loops.

## Core Features
- **Lightweight & Fast**: Zero unnecessary dependencies, hardware accelerated.
- **GSAP ScrollTrigger Sync**: Perfect 1:1 synchronization between Lenis scroll position and ScrollTrigger updates.
- **R3F & Three.js Integration**: Allows smooth camera scrollytelling driven by Lenis scroll progress.
- **Accessibility Respectful**: Respects `prefers-reduced-motion` and keyboard navigation.

## Installation

```bash
npm install lenis
```

## Basic Setup (Vanilla / Global)

```javascript
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

## GSAP ScrollTrigger Integration

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

// Update ScrollTrigger on every Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Direct GSAP ticker to drive Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Turn off lag smoothing for tight WebGL sync
gsap.ticker.lagSmoothing(0);
```

## React Hook Setup (`useLenis`)

```jsx
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis(onScroll) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true
    });
    lenisRef.current = lenis;

    if (onScroll) {
      lenis.on('scroll', onScroll);
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [onScroll]);

  return lenisRef;
}
```
