/**
 * QualityManager.js — Adaptive 3D Quality Profiles
 */

import { detectDeviceCapabilities } from './DeviceDetection';

export const QUALITY_PROFILES = {
  HIGH: {
    dpr: [1, 2],
    antialias: true,
    shadows: true,
    shadowMapSize: 1024,
    particlesCount: 1500,
    anisotropy: 8,
    bloom: true
  },
  MEDIUM: {
    dpr: [1, 1.5],
    antialias: true,
    shadows: false,
    shadowMapSize: 512,
    particlesCount: 750,
    anisotropy: 4,
    bloom: false
  },
  MOBILE: {
    dpr: [1, 1.25],
    antialias: false,
    shadows: false,
    shadowMapSize: 256,
    particlesCount: 300,
    anisotropy: 1,
    bloom: false
  },
  FALLBACK_2D: {
    is2D: true
  }
};

export function getRecommendedQuality() {
  const caps = detectDeviceCapabilities();
  const profile = QUALITY_PROFILES[caps.tier] || QUALITY_PROFILES.MEDIUM;
  return {
    tier: caps.tier,
    caps,
    profile
  };
}
