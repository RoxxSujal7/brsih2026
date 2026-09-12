/**
 * DeviceDetection.js — Hardware, GPU, and Accessibility Capability Assessment
 */

export function detectDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      hasWebGL: true,
      hasWebGL2: true,
      isMobile: false,
      isTouch: false,
      prefersReducedMotion: false,
      tier: 'HIGH'
    };
  }

  // 1. Accessibility: prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Touch and screen geometry
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // 3. WebGL Support
  let hasWebGL = false;
  let hasWebGL2 = false;
  try {
    const canvas = document.createElement('canvas');
    hasWebGL2 = !!canvas.getContext('webgl2');
    hasWebGL = hasWebGL2 || !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    hasWebGL = false;
    hasWebGL2 = false;
  }

  // 4. Hardware concurrency & device memory
  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;

  let tier = 'HIGH';
  if (!hasWebGL) {
    tier = 'FALLBACK_2D';
  } else if (isMobile || concurrency <= 2 || memory <= 2) {
    tier = 'MOBILE';
  } else if (concurrency <= 4 || memory <= 4) {
    tier = 'MEDIUM';
  }

  return {
    hasWebGL,
    hasWebGL2,
    isMobile,
    isTouch,
    concurrency,
    memory,
    prefersReducedMotion,
    tier
  };
}
