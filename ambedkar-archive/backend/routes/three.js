/**
 * Ambedkar Digital Archive — 3D Spatial Experience API
 * Powers Apple-style scrollytelling, Nike-style 3D exhibit showcase,
 * spatial annotations, telemetry, and 3D camera vector search.
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SpatialAnnotation = require('../models/SpatialAnnotation');

// In-memory fallback store for spatial annotations if MongoDB is offline
const inMemoryAnnotations = [
  {
    _id: 'ann-1',
    exhibitId: 'constitution',
    position: { x: 0.15, y: 0.85, z: 0.42 },
    author: 'Dr. S. Radhakrishnan (Constituent Assembly)',
    title: 'Preamble Calligraphy & Philosophy',
    content: 'The Constitution is not a mere lawyer\'s document, it is a vehicle of Life, and its spirit is always the spirit of Age.',
    category: 'constitutional_quote',
    likes: 42,
    verified: true,
    createdAt: new Date('2026-01-26T10:00:00Z')
  },
  {
    _id: 'ann-2',
    exhibitId: 'constitution',
    position: { x: -0.32, y: 0.48, z: 0.25 },
    author: 'Prof. Upendra Baxi',
    title: 'Part III — Fundamental Rights',
    content: 'Article 21 and Article 32 form the bedrock of constitutional morality and judicial protection in Dr. Ambedkar\'s vision.',
    category: 'scholarly_note',
    likes: 29,
    verified: true,
    createdAt: new Date('2026-02-14T14:30:00Z')
  },
  {
    _id: 'ann-3',
    exhibitId: 'bust',
    position: { x: 0.0, y: 1.45, z: 0.35 },
    author: 'Columbia University Archives',
    title: 'Scholarship & Intellectual Mastery',
    content: 'Dr. Ambedkar completed his thesis "The Evolution of Provincial Finance in British India" at Columbia under Prof. Edwin Seligman.',
    category: 'historical_fact',
    likes: 38,
    verified: true,
    createdAt: new Date('2026-03-01T09:15:00Z')
  },
  {
    _id: 'ann-4',
    exhibitId: 'mahad',
    position: { x: 0.05, y: 0.95, z: 0.5 },
    author: 'Historical Record (20 March 1927)',
    title: 'Chavdar Tale Water Satyagraha',
    content: 'Not for drinking water alone, but to assert that we too are human beings with natural and equal rights.',
    category: 'historical_fact',
    likes: 54,
    verified: true,
    createdAt: new Date('2026-03-20T11:00:00Z')
  },
  {
    _id: 'ann-5',
    exhibitId: 'quill',
    position: { x: 0.22, y: 0.35, z: -0.15 },
    author: 'Archival Collection',
    title: 'The Drafting Desk Instruments',
    content: 'Used during marathon sessions in the Constitution House, New Delhi, between August 1947 and November 1949.',
    category: 'scholarly_note',
    likes: 19,
    verified: true,
    createdAt: new Date('2026-04-14T08:00:00Z')
  }
];

// Telemetry in-memory aggregator
const telemetryStats = {
  totalViews: 1482,
  rotations360: 4230,
  hotspotClicks: 1895,
  exhibitViews: {
    constitution: 620,
    bust: 412,
    mahad: 284,
    quill: 166
  },
  lastUpdated: new Date()
};

/**
 * GET /api/three/experience
 * Returns scene camera choreography milestones, lighting systems, and presets
 */
router.get('/experience', (req, res) => {
  res.json({
    success: true,
    version: '3.0.0',
    experienceTitle: 'Ambedkar Digital Heritage Spatial Universe',
    rendererConfig: {
      antialias: true,
      powerPreference: 'high-performance',
      toneMapping: 'ACESFilmicToneMapping',
      toneMappingExposure: 1.15,
      pixelRatioLimit: 2,
      shadowMapEnabled: true
    },
    lightingPresets: {
      studio_dark: {
        ambient: { color: '#161b26', intensity: 0.8 },
        keyLight: { color: '#ffffff', intensity: 2.2, pos: [6, 12, 8] },
        fillLight: { color: '#2563eb', intensity: 1.4, pos: [-8, 6, -4] },
        rimLight: { color: '#f59e0b', intensity: 2.8, pos: [0, 8, -10] },
        fog: { color: '#07090e', near: 10, far: 55 }
      },
      museum_gold: {
        ambient: { color: '#1a140b', intensity: 1.0 },
        keyLight: { color: '#fde68a', intensity: 2.6, pos: [5, 10, 7] },
        fillLight: { color: '#d97706', intensity: 1.6, pos: [-6, 4, -3] },
        rimLight: { color: '#fef3c7', intensity: 3.2, pos: [0, 9, -8] },
        fog: { color: '#0c0a06', near: 8, far: 50 }
      },
      cyber_monochrome: {
        ambient: { color: '#111111', intensity: 0.6 },
        keyLight: { color: '#ffffff', intensity: 3.0, pos: [4, 14, 6] },
        fillLight: { color: '#555555', intensity: 1.0, pos: [-7, 3, -5] },
        rimLight: { color: '#ffffff', intensity: 3.5, pos: [0, 10, -9] },
        fog: { color: '#000000', near: 12, far: 60 }
      }
    },
    scrollWaypoints: [
      {
        id: 'hero',
        selector: '.hero',
        cameraPos: { x: 0, y: 1.2, z: 6.5 },
        lookAt: { x: 0, y: 0.4, z: 0 },
        activeExhibit: 'bust',
        particleSpeed: 0.6,
        description: 'Monumental Memorial & Constellation'
      },
      {
        id: 'archive',
        selector: '.stats-bar, .featured-sec',
        cameraPos: { x: 2.8, y: 2.0, z: 5.2 },
        lookAt: { x: 0, y: 0.6, z: 0 },
        activeExhibit: 'quill',
        particleSpeed: 0.4,
        description: 'Library of 60 BAWS Volumes'
      },
      {
        id: 'constitution',
        selector: '#interactive-showcase, .constitution-preview',
        cameraPos: { x: -0.2, y: 1.6, z: 4.2 },
        lookAt: { x: 0, y: 0.8, z: 0 },
        activeExhibit: 'constitution',
        particleSpeed: 0.8,
        description: 'Architect of the Republic'
      },
      {
        id: 'timeline',
        selector: '.timeline-preview',
        cameraPos: { x: -3.2, y: 1.4, z: 5.6 },
        lookAt: { x: -0.5, y: 0.5, z: 0 },
        activeExhibit: 'mahad',
        particleSpeed: 0.5,
        description: 'Chrono-Spatial Historic Ribbon'
      },
      {
        id: 'philosophy',
        selector: '.vows-preview, .quotes-carousel',
        cameraPos: { x: 0, y: 2.8, z: 6.0 },
        lookAt: { x: 0, y: 0.2, z: 0 },
        activeExhibit: 'constitution',
        particleSpeed: 1.0,
        description: 'Ashoka Chakra & Volumetric Rays'
      }
    ]
  });
});

/**
 * GET /api/three/artifacts
 * Returns museum metadata for all 4 3D exhibits
 */
router.get('/artifacts', (req, res) => {
  res.json({
    success: true,
    artifacts: [
      {
        id: 'constitution',
        name: 'The Constitution of India (Original 1950 Edition)',
        subtitle: 'Hand-Calligraphed Parchment with Gold Leaf Embossing',
        period: '1947–1950',
        dimensions: '45.7 cm × 30.5 cm × 9.5 cm (Weight: 13 kg)',
        material: 'Parchment paper, Black ink, Gold foil, Handcrafted leather binder',
        calligrapher: 'Prem Behari Narain Raizada (Delhi)',
        illuminator: 'Nandalal Bose & Artists of Shantiniketan',
        significance: 'Adopted 26 Nov 1949, Enacted 26 Jan 1950. Dr. Ambedkar led the 7-member Drafting Committee through 141 days of deliberations.',
        hotspots: [
          {
            id: 'hs-preamble',
            label: 'The Preamble',
            pos: [0.15, 0.85, 0.42],
            text: 'WE, THE PEOPLE OF INDIA... Justice, Liberty, Equality, Fraternity.'
          },
          {
            id: 'hs-rights',
            label: 'Part III — Fundamental Rights',
            pos: [-0.32, 0.48, 0.25],
            text: 'Articles 12–35 guarantee civil liberties, outlaw untouchability (Art. 17), and mandate constitutional remedies (Art. 32).'
          },
          {
            id: 'hs-emblem',
            label: 'Ashoka Lion Capital',
            pos: [0.0, 1.25, 0.2],
            text: 'Official seal of the Republic of India symbolizing peace, courage, and truth (Satyameva Jayate).'
          }
        ]
      },
      {
        id: 'bust',
        name: 'Dr. B. R. Ambedkar Memorial Bronze Bust',
        subtitle: 'Cast in Classical Patinated Bronze with Studio Patina',
        period: '1891–1956',
        dimensions: 'Life-size heroic bronze sculpture (Scale 1:1)',
        material: 'Cast bronze, antique verdigris and burnished gold patina',
        significance: 'First Law & Justice Minister of independent India, Chief Architect of the Indian Constitution, Columbia University "Great Teacher", posthumous Bharat Ratna.',
        hotspots: [
          {
            id: 'hs-specs',
            label: 'The Scholar\'s Vision',
            pos: [0.0, 1.45, 0.35],
            text: 'Iconic round horn-rimmed spectacles symbolizing intense intellectual clarity and lifelong research.'
          },
          {
            id: 'hs-pen',
            label: 'Fountain Pen of Emancipation',
            pos: [0.35, 0.85, 0.25],
            text: 'Symbol of literacy and legal struggle: "Educate, Agitate, Organise."'
          },
          {
            id: 'hs-folio',
            label: 'Constitutional Folio',
            pos: [-0.3, 0.65, 0.35],
            text: 'Holding the completed draft presented to Dr. Rajendra Prasad on 25 November 1949.'
          }
        ]
      },
      {
        id: 'mahad',
        name: 'Mahad Satyagraha Water Pillar Monument',
        subtitle: 'Black Basalt Commemorative Obelisk of Chavdar Tale',
        period: '20 March 1927',
        dimensions: 'Basalt obelisk, square pedestal with bronze plaque',
        material: 'Deccan trap black basalt stone, water reflection pool, polished brass lettering',
        significance: 'Considered the foundational declaration of human rights in modern Indian history. Dr. Ambedkar led thousands to drink water from the public Chavdar lake.',
        hotspots: [
          {
            id: 'hs-water',
            label: 'Chavdar Tale Water Basin',
            pos: [0.0, 0.3, 0.6],
            text: 'A peaceful reclamation of civic and natural rights for all human beings.'
          },
          {
            id: 'hs-declaration',
            label: 'Human Rights Resolution',
            pos: [0.0, 0.95, 0.5],
            text: 'Resolution condemning untouchability and invoking the French Declaration of the Rights of Man.'
          }
        ]
      },
      {
        id: 'quill',
        name: 'Historical Drafting Instruments & Spectacles',
        subtitle: 'Parker 51 Fountain Pen, Brass Inkwell & Personal Journal',
        period: 'Circa 1945–1950',
        dimensions: 'Precision desktop artifact suite',
        material: 'Celluloid fountain pen with 14K gold nib, heavy brass, calfskin leather journal',
        significance: 'The physical instruments with which Dr. Ambedkar annotated thousands of constitutional amendments and drafted monumental treatises.',
        hotspots: [
          {
            id: 'hs-nib',
            label: 'Gold Pen Nib',
            pos: [0.22, 0.35, -0.15],
            text: 'Handwritten notes on the Poona Pact, States and Minorities, and the Hindu Code Bill.'
          },
          {
            id: 'hs-journal',
            label: 'Drafting Journal',
            pos: [-0.25, 0.2, 0.15],
            text: 'Daily logs and comparative analysis of US, UK, Irish, and Australian constitutions.'
          }
        ]
      }
    ]
  });
});

/**
 * GET /api/three/annotations
 * Query params: ?exhibitId=constitution
 */
router.get('/annotations', async (req, res) => {
  try {
    const { exhibitId } = req.query;
    const filter = exhibitId ? { exhibitId } : {};

    // Try MongoDB query if connected
    if (mongoose.connection.readyState === 1) {
      const dbAnnotations = await SpatialAnnotation.find(filter).sort({ createdAt: -1 }).limit(50);
      if (dbAnnotations.length > 0) {
        return res.json({ success: true, count: dbAnnotations.length, data: dbAnnotations });
      }
    }

    // Return in-memory fallback
    const filtered = exhibitId
      ? inMemoryAnnotations.filter((a) => a.exhibitId === exhibitId)
      : inMemoryAnnotations;
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    console.error('Error fetching spatial annotations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/three/annotations
 * Creates a new 3D spatial pin placed on an exhibit
 */
router.post('/annotations', async (req, res) => {
  try {
    const { exhibitId, position, author, title, content, category } = req.body;

    if (!exhibitId || !position || !content) {
      return res.status(400).json({
        success: false,
        error: 'exhibitId, position {x, y, z}, and content are required'
      });
    }

    const newPin = {
      _id: 'pin-' + Date.now(),
      exhibitId: exhibitId || 'constitution',
      position: {
        x: Number(position.x) || 0,
        y: Number(position.y) || 0,
        z: Number(position.z) || 0
      },
      author: (author || 'Anonymous Scholar').trim().slice(0, 100),
      title: (title || 'Historical Reflection').trim().slice(0, 140),
      content: content.trim().slice(0, 1500),
      category: category || 'visitor_reflection',
      likes: 0,
      verified: false,
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await SpatialAnnotation.create(newPin);
      return res.status(201).json({ success: true, data: saved });
    }

    // In-memory fallback
    inMemoryAnnotations.unshift(newPin);
    res.status(201).json({ success: true, data: newPin });
  } catch (err) {
    console.error('Error creating spatial annotation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/three/telemetry
 * Records visitor engagement and 3D interactions
 */
router.post('/telemetry', (req, res) => {
  try {
    const { event, exhibitId } = req.body;

    if (event === 'view') {
      telemetryStats.totalViews++;
      if (exhibitId && telemetryStats.exhibitViews[exhibitId] !== undefined) {
        telemetryStats.exhibitViews[exhibitId]++;
      }
    } else if (event === 'rotate') {
      telemetryStats.rotations360++;
    } else if (event === 'hotspot_click') {
      telemetryStats.hotspotClicks++;
    }
    telemetryStats.lastUpdated = new Date();

    res.json({ success: true, stats: telemetryStats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/three/stats
 * Real-time 3D spatial exploration statistics
 */
router.get('/stats', (req, res) => {
  res.json({ success: true, stats: telemetryStats });
});

/**
 * GET /api/three/spatial-search
 * Performs text search and returns matching 3D vector coordinates
 */
router.get('/spatial-search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) {
    return res.json({ success: true, matches: [] });
  }

  const searchable = [
    {
      id: 'constitution',
      name: 'Constitution of India',
      keywords: ['constitution', 'preamble', 'fundamental rights', 'drafting', 'article', 'law', 'republic'],
      cameraPos: { x: -0.2, y: 1.6, z: 4.2 },
      targetLookAt: { x: 0, y: 0.8, z: 0 },
      exhibitId: 'constitution'
    },
    {
      id: 'bust',
      name: 'Dr. B. R. Ambedkar Memorial Bust',
      keywords: ['ambedkar', 'babasaheb', 'statue', 'bust', 'memorial', 'columbia', 'biography', 'life'],
      cameraPos: { x: 0, y: 1.2, z: 6.5 },
      targetLookAt: { x: 0, y: 0.4, z: 0 },
      exhibitId: 'bust'
    },
    {
      id: 'mahad',
      name: 'Mahad Satyagraha Water Pillar',
      keywords: ['mahad', 'chavdar', 'water', 'satyagraha', '1927', 'human rights', 'equality', 'tank'],
      cameraPos: { x: -3.2, y: 1.4, z: 5.6 },
      targetLookAt: { x: -0.5, y: 0.5, z: 0 },
      exhibitId: 'mahad'
    },
    {
      id: 'quill',
      name: 'Historical Drafting Instruments',
      keywords: ['quill', 'pen', 'books', 'volumes', 'writings', 'baws', 'spectacles', 'notes', 'ink'],
      cameraPos: { x: 2.8, y: 2.0, z: 5.2 },
      targetLookAt: { x: 0, y: 0.6, z: 0 },
      exhibitId: 'quill'
    }
  ];

  const matches = searchable.filter((item) => {
    return item.name.toLowerCase().includes(query) || item.keywords.some((k) => k.includes(query) || query.includes(k));
  });

  res.json({
    success: true,
    query,
    count: matches.length,
    matches: matches.length > 0 ? matches : [searchable[0]]
  });
});

module.exports = router;
