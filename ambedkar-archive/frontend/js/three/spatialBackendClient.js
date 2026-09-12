/**
 * Ambedkar Digital Archive — 3D Spatial Backend Client
 * Connects frontend Three.js spatial viewports with Express backend APIs.
 */

window.SpatialBackendClient = (function () {
  const API_BASE = '/api/three';

  async function getExperience() {
    try {
      const res = await fetch(`${API_BASE}/experience`);
      const data = await res.json();
      return data.success ? data : null;
    } catch (err) {
      console.warn('SpatialBackendClient: Failed to fetch experience config:', err);
      return null;
    }
  }

  async function getArtifacts() {
    try {
      const res = await fetch(`${API_BASE}/artifacts`);
      const data = await res.json();
      return data.success ? data.artifacts : [];
    } catch (err) {
      console.warn('SpatialBackendClient: Failed to fetch artifacts:', err);
      return [];
    }
  }

  async function getAnnotations(exhibitId) {
    try {
      const url = exhibitId ? `${API_BASE}/annotations?exhibitId=${encodeURIComponent(exhibitId)}` : `${API_BASE}/annotations`;
      const res = await fetch(url);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('SpatialBackendClient: Failed to fetch annotations:', err);
      return [];
    }
  }

  async function createAnnotation(pinData) {
    try {
      const res = await fetch(`${API_BASE}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pinData)
      });
      return await res.json();
    } catch (err) {
      console.error('SpatialBackendClient: Failed to create annotation:', err);
      return { success: false, error: err.message };
    }
  }

  function logTelemetry(event, exhibitId) {
    try {
      fetch(`${API_BASE}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, exhibitId, timestamp: Date.now() })
      }).catch(() => {});
    } catch (e) {}
  }

  async function searchSpatial(query) {
    try {
      const res = await fetch(`${API_BASE}/spatial-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      return data.success ? data.matches : [];
    } catch (err) {
      return [];
    }
  }

  return {
    getExperience,
    getArtifacts,
    getAnnotations,
    createAnnotation,
    logTelemetry,
    searchSpatial
  };
})();
