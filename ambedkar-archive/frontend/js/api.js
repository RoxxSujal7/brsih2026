/**
 * API Client — fetch wrapper with JWT auth headers
 * All API calls go through this module
 */

const API_BASE = (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' && window.location.protocol.startsWith('http')) 
  ? `${window.location.origin}/api` 
  : 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('auth_token');

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Token expired — clear session
    if (response.status === 401) {
      clearAuthSession();
    }
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
};

const clearAuthSession = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// ── Auth ──────────────────────────────────────────
const api = {
  auth: {
    register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    googleLogin: (body) => apiFetch('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
    sendOtp: (body) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify(body) }),
    verifyOtp: (body) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
    me: () => apiFetch('/auth/me'),
    updateProfile: (body) => apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  },

  // ── Documents ─────────────────────────────────
  documents: {
    list: (params = {}) => apiFetch('/documents?' + new URLSearchParams(params)),
    get: (id) => apiFetch(`/documents/${id}`),
    search: (q, params = {}) => apiFetch('/documents/search?' + new URLSearchParams({ q, ...params })),
    featured: () => apiFetch('/documents/featured'),
  },

  // ── Progress ──────────────────────────────────
  progress: {
    getAll: () => apiFetch('/progress'),
    get: (docId) => apiFetch(`/progress/${docId}`),
    save: (docId, body) => apiFetch(`/progress/${docId}`, { method: 'POST', body: JSON.stringify(body) }),
    reset: (docId) => apiFetch(`/progress/${docId}`, { method: 'DELETE' }),
  },

  // ── Bookmarks ─────────────────────────────────
  bookmarks: {
    getAll: () => apiFetch('/bookmarks'),
    add: (body) => apiFetch('/bookmarks', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => apiFetch(`/bookmarks/${id}`, { method: 'DELETE' }),
  },

  // ── Media ─────────────────────────────────────
  media: {
    list: (params = {}) => apiFetch('/media?' + new URLSearchParams(params)),
    featured: () => apiFetch('/media/featured'),
    get: (id) => apiFetch(`/media/${id}`),
  },

  // ── Letters (361 Historical Letters) ──────────
  letters: {
    list: (params = {}) => apiFetch('/letters?' + new URLSearchParams(params)),
    get: (id) => apiFetch(`/letters/${id}`),
  },

  // ── 22 Vows (11 Languages) ────────────────────
  vows: {
    languages: () => apiFetch('/vows'),
    get: (lang) => apiFetch(`/vows/${lang}`),
  },

  // ── BAWS 20 Volumes & Writings ────────────────
  volumes: {
    list: () => apiFetch('/volumes'),
    writings: (params = {}) => apiFetch('/volumes/writings?' + new URLSearchParams(params)),
    getDownloadUrl: (code) => `/books/${code}.pdf`,
  },

  // ── Search (unified) ──────────────────────────────
  search: (q, params = {}) => apiFetch('/search?' + new URLSearchParams({ q, ...params })),

  // ── Health ────────────────────────────────────────
  health: () => apiFetch('/health'),
};

window.api = api;
window.clearAuthSession = clearAuthSession;
// HIGH-03 FIX: Export apiFetch directly so search.js and other scripts can call window.apiFetch()
window.apiFetch = apiFetch;
