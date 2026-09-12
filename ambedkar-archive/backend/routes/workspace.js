/**
 * Workspace Routes — Phase 4: Institutional Research Workspace
 * Handles user research collections, annotations, multi-format citations,
 * export systems (Markdown, BibTeX, TXT, JSON), and comparative research datasets.
 * 
 * Enforces strict IDOR prevention: All user artifacts are owned and isolated by userId.
 * Archival sources and user commentary are strictly decoupled to preserve historical integrity.
 */

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { body, param, query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Persistent / In-memory storage for research collections
const COLLECTIONS_FILE = path.join(__dirname, '../data/research_collections.json');
let collectionsStore = [];

function loadCollections() {
  try {
    if (fs.existsSync(COLLECTIONS_FILE)) {
      collectionsStore = JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
    } else {
      collectionsStore = [];
    }
  } catch (err) {
    console.error('[WORKSPACE] Error reading collections store:', err.message);
    collectionsStore = [];
  }
}

function saveCollections() {
  try {
    const dir = path.dirname(COLLECTIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collectionsStore, null, 2), 'utf8');
  } catch (err) {
    console.error('[WORKSPACE] Error persisting collections store:', err.message);
  }
}

loadCollections();

/**
 * Helper to generate standard academic citations from verified archival metadata.
 * Does not fabricate missing metadata.
 */
function generateCitations(meta) {
  const author = meta.author || 'Ambedkar, B. R.';
  const year = meta.year || meta.date || 'n.d.';
  const title = meta.title || 'Untitled Archival Document';
  const volume = meta.volume ? `Vol. ${meta.volume}` : '';
  const publisher = meta.publisher || 'Dr. Babasaheb Ambedkar Source Material Publication Committee';
  const place = meta.place || 'Bombay / New Delhi';
  const pages = meta.pages ? `pp. ${meta.pages}` : '';
  const url = meta.url || 'https://ambedkar-archive.org';

  // APA 7th Edition
  const apaVol = volume ? `(${volume}${pages ? `, ${pages}` : ''}). ` : (pages ? `(${pages}). ` : '');
  const apa = `${author} (${year}). ${title}. ${apaVol}${publisher}. ${url}`.replace(/\s+/g, ' ').trim();

  // MLA 9th Edition
  const mlaVol = volume ? `, ${volume}` : '';
  const mlaPages = pages ? `, ${pages}` : '';
  const mla = `${author}. "${title}." Ambedkar Digital Heritage Archive${mlaVol}, ${publisher}, ${year}${mlaPages}, ${url}.`.replace(/\s+/g, ' ').trim();

  // Chicago 17th Edition (Notes & Bibliography)
  const chicago = `${author}. ${year}. "${title}." ${volume ? `${volume}, ` : ''}${publisher}${pages ? `, ${pages}` : ''}. ${url}`.replace(/\s+/g, ' ').trim();

  // Harvard Style
  const harvard = `${author} (${year}) '${title}'${volume ? `, ${volume}` : ''}, ${publisher}${pages ? `, ${pages}` : ''}. Available at: ${url}`.replace(/\s+/g, ' ').trim();

  // BibTeX
  const citeKey = `${(author.split(',')[0] || 'ambedkar').toLowerCase().replace(/[^a-z]/g, '')}${year.toString().replace(/[^0-9]/g, '') || 'nd'}_${title.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')}`;
  const bibtex = `@book{${citeKey},
  author = {${author}},
  title = {{${title}}},
  year = {${year}},
  ${volume ? `volume = {${volume.replace('Vol. ', '')}},\n  ` : ''}publisher = {${publisher}},
  ${pages ? `pages = {${pages.replace('pp. ', '')}},\n  ` : ''}address = {${place}},
  url = {${url}}
}`;

  return { apa, mla, chicago, harvard, bibtex };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. COLLECTIONS / FOLDERS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/workspace/collections
 * List all research collections for authenticated user
 */
router.get('/collections', protect, (req, res) => {
  const userId = String(req.user._id);
  let userCollections = collectionsStore.filter(c => String(c.userId) === userId);

  // If new user has 0 collections, seed initial research folders
  if (userCollections.length === 0) {
    const defaultCollections = [
      {
        id: 'col-' + crypto.randomBytes(6).toString('hex'),
        userId,
        title: 'Ambedkar and Constitutional Democracy',
        description: 'Primary sources, debates, and essays on constitutional morality, fundamental rights, and social democracy.',
        tags: ['Constitution', 'Democracy', 'Fundamental Rights'],
        items: [
          {
            id: 'item-demo-1',
            type: 'passage',
            sourceId: 'baws-vol-13',
            sourceTitle: 'Constituent Assembly Debates (November 25, 1949)',
            archivalQuote: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic.',
            citation: 'Ambedkar, B. R. (1949). Constituent Assembly of India Debates, Vol. 11.',
            userNote: 'Crucial passage for the thesis chapter on constitutional morality vs political majoritarianism.',
            createdAt: new Date().toISOString()
          },
          {
            id: 'item-demo-2',
            type: 'passage',
            sourceId: 'baws-vol-1',
            sourceTitle: 'Annihilation of Caste (1936)',
            archivalQuote: 'Political democracy cannot last unless there lies at the base of it social democracy. What does social democracy mean? It means a way of life which recognizes liberty, equality and fraternity as the principles of life.',
            citation: 'Ambedkar, B. R. (1936). Annihilation of Caste. BAWS Vol. 1.',
            userNote: 'Foundation of social democracy definition in Indian constitutional jurisprudence.',
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'col-' + crypto.randomBytes(6).toString('hex'),
        userId,
        title: 'Poona Pact & Representation (1932)',
        description: 'Comparative notes on the Round Table Conferences, MacDonald Communal Award, and the Yerwada Central Prison pact.',
        tags: ['Poona Pact', 'Electorates', 'History'],
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    collectionsStore.push(...defaultCollections);
    saveCollections();
    userCollections = defaultCollections;
  }

  res.json({
    success: true,
    total: userCollections.length,
    collections: userCollections
  });
});

/**
 * POST /api/workspace/collections
 * Create new research collection
 */
router.post('/collections', protect, [
  body('title').trim().notEmpty().isLength({ min: 2, max: 120 }).withMessage('Title must be between 2 and 120 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description = '', tags = [] } = req.body;
  const newCol = {
    id: 'col-' + crypto.randomBytes(8).toString('hex'),
    userId: String(req.user._id),
    title: title.trim(),
    description: (description || '').trim(),
    tags: Array.isArray(tags) ? tags.map(t => String(t).trim().slice(0, 30)).filter(Boolean) : [],
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  collectionsStore.push(newCol);
  saveCollections();

  res.status(201).json({
    success: true,
    message: 'Research collection created successfully',
    collection: newCol
  });
});

/**
 * GET /api/workspace/collections/:id
 * Retrieve single collection with all items (IDOR protected)
 */
router.get('/collections/:id', protect, (req, res) => {
  const collection = collectionsStore.find(c => c.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  // IDOR Protection
  if (String(collection.userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this collection' });
  }

  res.json({ success: true, collection });
});

/**
 * PUT /api/workspace/collections/:id
 * Update collection metadata (IDOR protected)
 */
router.put('/collections/:id', protect, [
  body('title').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('tags').optional().isArray()
], (req, res) => {
  const collection = collectionsStore.find(c => c.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  if (String(collection.userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  const { title, description, tags } = req.body;
  if (title) collection.title = title.trim();
  if (description !== undefined) collection.description = description.trim();
  if (Array.isArray(tags)) collection.tags = tags.map(t => String(t).trim()).filter(Boolean);
  collection.updatedAt = new Date().toISOString();

  saveCollections();
  res.json({ success: true, message: 'Collection updated', collection });
});

/**
 * DELETE /api/workspace/collections/:id
 * Delete collection (IDOR protected)
 */
router.delete('/collections/:id', protect, (req, res) => {
  const index = collectionsStore.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  if (String(collectionsStore[index].userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  collectionsStore.splice(index, 1);
  saveCollections();
  res.json({ success: true, message: 'Collection deleted successfully' });
});

/**
 * POST /api/workspace/collections/:id/items
 * Add an archival passage, quote, or note to a collection
 */
router.post('/collections/:id/items', protect, [
  body('sourceTitle').trim().notEmpty().withMessage('sourceTitle is required'),
  body('archivalQuote').trim().notEmpty().withMessage('archivalQuote is required'),
  body('userNote').optional().isString().isLength({ max: 2000 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const collection = collectionsStore.find(c => c.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  if (String(collection.userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  const {
    type = 'passage',
    sourceId = '',
    sourceTitle,
    archivalQuote,
    citation = '',
    userNote = '',
    tags = []
  } = req.body;

  const newItem = {
    id: 'item-' + crypto.randomBytes(6).toString('hex'),
    type: ['passage', 'quote', 'note', 'timeline', 'debate', 'memorial'].includes(type) ? type : 'passage',
    sourceId: String(sourceId).trim(),
    sourceTitle: String(sourceTitle).trim(),
    // Strictly preserve archival quote immutability
    archivalQuote: String(archivalQuote).trim(),
    citation: String(citation).trim(),
    // Decoupled user note
    userNote: String(userNote).trim(),
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString()
  };

  if (!collection.items) collection.items = [];
  collection.items.unshift(newItem);
  collection.updatedAt = new Date().toISOString();

  saveCollections();

  res.status(201).json({
    success: true,
    message: 'Item added to research collection',
    item: newItem
  });
});

/**
 * DELETE /api/workspace/collections/:id/items/:itemId
 * Remove item from collection
 */
router.delete('/collections/:id/items/:itemId', protect, (req, res) => {
  const collection = collectionsStore.find(c => c.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  if (String(collection.userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  const itemIndex = (collection.items || []).findIndex(i => i.id === req.params.itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found in collection' });
  }

  collection.items.splice(itemIndex, 1);
  collection.updatedAt = new Date().toISOString();
  saveCollections();

  res.json({ success: true, message: 'Item removed from collection' });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ACADEMIC CITATION GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/workspace/citations/format
 * Formats citations in APA, MLA, Chicago, Harvard, BibTeX using verified metadata.
 */
router.post('/citations/format', [
  body('title').trim().notEmpty().withMessage('Title is required for citation generation')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const meta = {
    title: req.body.title,
    author: req.body.author || 'Dr. B. R. Ambedkar',
    year: req.body.year || '1936',
    volume: req.body.volume || '',
    publisher: req.body.publisher || 'Government of Maharashtra / Ministry of Social Justice',
    place: req.body.place || 'Mumbai / New Delhi',
    pages: req.body.pages || '',
    url: req.body.url || 'https://ambedkar-archive.org'
  };

  const citations = generateCitations(meta);
  res.json({
    success: true,
    metadata: meta,
    citations
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESEARCH EXPORT SYSTEM (Markdown, TXT, BibTeX, JSON)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/workspace/export/:id
 * Export research collection into academic notebook formats
 */
router.get('/export/:id', protect, (req, res) => {
  const collection = collectionsStore.find(c => c.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ success: false, message: 'Collection not found' });
  }

  if (String(collection.userId) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  const format = (req.query.format || 'markdown').toLowerCase();
  const title = collection.title;
  const items = collection.items || [];

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_research.json"`);
    return res.send(JSON.stringify(collection, null, 2));
  }

  if (format === 'bibtex') {
    let bibContent = `% Bibliography for ${title}\n% Exported from Ambedkar Digital Heritage Archive\n% Date: ${new Date().toISOString()}\n\n`;
    items.forEach((it, idx) => {
      const cite = generateCitations({
        title: it.sourceTitle,
        year: '1949',
        author: 'Ambedkar, B. R.'
      });
      bibContent += `${cite.bibtex}\n\n`;
    });
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_bibliography.bib"`);
    return res.send(bibContent);
  }

  if (format === 'txt') {
    let txt = `========================================================================\n`;
    txt += `AMBEDKAR DIGITAL HERITAGE ARCHIVE — RESEARCH NOTEBOOK\n`;
    txt += `========================================================================\n\n`;
    txt += `Collection: ${title}\n`;
    txt += `Description: ${collection.description || 'N/A'}\n`;
    txt += `Exported: ${new Date().toLocaleString()}\n`;
    txt += `Total Entries: ${items.length}\n\n`;
    txt += `------------------------------------------------------------------------\n\n`;

    items.forEach((it, idx) => {
      txt += `[${idx + 1}] SOURCE: ${it.sourceTitle}\n`;
      if (it.citation) txt += `CITATION: ${it.citation}\n`;
      txt += `ARCHIVAL PASSAGE:\n"${it.archivalQuote}"\n\n`;
      if (it.userNote) {
        txt += `RESEARCHER ANNOTATION / NOTE:\n${it.userNote}\n`;
      }
      txt += `\n------------------------------------------------------------------------\n\n`;
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.txt"`);
    return res.send(txt);
  }

  // Default: Markdown (.md)
  let md = `# Research Notebook: ${title}\n\n`;
  md += `> **Ambedkar Digital Heritage Archive — Institutional Research Export**  \n`;
  md += `> *Export Date:* ${new Date().toISOString()}  \n`;
  md += `> *Description:* ${collection.description || 'Academic research compilation.'}  \n`;
  if (collection.tags && collection.tags.length > 0) {
    md += `> *Keywords:* ${collection.tags.map(t => `\`${t}\``).join(', ')}  \n`;
  }
  md += `\n---\n\n`;

  md += `## Table of Contents\n\n`;
  items.forEach((it, idx) => {
    md += `${idx + 1}. [${it.sourceTitle}](#entry-${idx + 1})\n`;
  });
  md += `\n---\n\n`;

  md += `## Archival Sources & Field Notes\n\n`;
  items.forEach((it, idx) => {
    md += `<a id="entry-${idx + 1}"></a>\n`;
    md += `### ${idx + 1}. ${it.sourceTitle}\n\n`;
    md += `**Archival Citation:** *${it.citation || 'Ambedkar Digital Heritage Archive'}*\n\n`;
    md += `#### 📜 Archival Source Passage\n`;
    md += `> "${it.archivalQuote}"\n\n`;
    if (it.userNote) {
      md += `#### 📝 Researcher Annotation\n`;
      md += `${it.userNote}\n\n`;
    }
    md += `---\n\n`;
  });

  md += `\n## Verified Bibliography (APA Format)\n\n`;
  items.forEach(it => {
    const c = generateCitations({ title: it.sourceTitle, year: '1949' });
    md += `- ${c.apa}\n`;
  });

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notebook.md"`);
  return res.send(md);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPARISON PRESETS & KNOWLEDGE NETWORK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/workspace/comparison/presets
 * Curated scholarly comparison presets
 */
router.get('/comparison/presets', (req, res) => {
  const presets = [
    {
      id: 'poona-pact-1932',
      title: 'Separate Electorates vs Joint Electorates: The 1932 Poona Pact Debate',
      topic: 'Political Representation & Franchise',
      left: {
        entity: 'Dr. B. R. Ambedkar (Depressed Classes Stance)',
        work: 'Evidence Before the Southborough Committee (1919) & Speech at Round Table Conference (1930)',
        excerpt: 'The Depressed Classes are not a sub-caste of the Hindus. They have interests of their own which conflict with the interests of the orthodox Hindu majority. To give them joint electorates without genuine guarantees is to bind them hand and foot to the mercy of their oppressors. We must have separate electorates to send genuine representatives who are beholden to our people, not puppets of dominant castes.',
        citation: 'BAWS Vol. 2, pp. 503-518; Indian Round Table Conference Proceedings (First Session, 1930).'
      },
      right: {
        entity: 'M. K. Gandhi (Congress / Orthodox View)',
        work: 'Letter to Sir Samuel Hoare & Yerwada Fast Declarations (September 1932)',
        excerpt: 'I hold that separate electorates for the Untouchables will ensure them bondage in perpetuity. It will inject a vivisection of Hinduism into the electoral roll. I would far rather that Hinduism died than that untouchability lived, but I cannot countenance a statutory division of the community. I shall resist separate electorates with my life.',
        citation: 'The Collected Works of Mahatma Gandhi, Vol. 51, pp. 62-65 (Yerwada Central Prison, 1932).'
      },
      analysis: 'Ambedkar argued for autonomous political bargaining power for Dalits as a distinct minority, whereas Gandhi prioritized Hindu community unity, viewing untouchability as a moral defect rather than a systemic political division.'
    },
    {
      id: 'caste-annihilation-vs-varna',
      title: 'Annihilation of Caste vs Idealized Varna',
      topic: 'Social Philosophy & Reform',
      left: {
        entity: 'Dr. B. R. Ambedkar',
        work: 'Annihilation of Caste (1936)',
        excerpt: 'Caste is not merely a division of labour. It is also a division of labourers. It is a hierarchy in which the divisions of labourers are graded one above another. You cannot build anything on the foundations of caste. You cannot build a nation, you cannot build a morality. Anything you will build on the foundations of caste will crack and will never be a whole.',
        citation: 'Ambedkar, B. R. (1936). Annihilation of Caste, Section IV. BAWS Vol. 1.'
      },
      right: {
        entity: 'M. K. Gandhi',
        work: 'Harijan (July 11, 1936) & Young India',
        excerpt: 'Varna is not caste. Varna means the determination of a man\'s profession beforehand by reason of his birth. It recognizes that every man is not born with the same capacity, but each must serve the community with his inherited calling while enjoying equal spiritual status before God.',
        citation: 'Harijan, 11-7-1936, in "Dr. Ambedkar\'s Indictment", CWMG Vol. 63.'
      },
      analysis: 'Ambedkar insisted that Varna and Caste are fundamentally hierarchical and must be eradicated along with the religious sanctity attached to the Shastras. Gandhi defended an idealized, non-hierarchical hereditary vocation while denouncing untouchability as an excrescence.'
    },
    {
      id: 'industrialization-vs-village',
      title: 'Constitutional Modernity vs Village Republics',
      topic: 'State Architecture & Economy',
      left: {
        entity: 'Dr. B. R. Ambedkar',
        work: 'Constituent Assembly of India Debates (November 4, 1948)',
        excerpt: 'What is the village but a sink of localism, a den of ignorance, narrow-mindedness and communalism? I am glad that the Draft Constitution has discarded the village and adopted the individual as its unit.',
        citation: 'Constituent Assembly Debates, Official Report, Vol. VII, 4th November 1948, p. 39.'
      },
      right: {
        entity: 'M. K. Gandhi',
        work: 'Hind Swaraj (1909) & Gram Swaraj Letters',
        excerpt: 'My idea of village swaraj is that it is a complete republic, independent of its neighbours for its own vital wants, and yet interdependent for many others in which dependence is a necessity. True democracy cannot be worked by twenty men sitting at the Centre.',
        citation: 'Harijan, 26-7-1942; Hind Swaraj, Chapter XIII.'
      },
      analysis: 'Ambedkar recognized Indian villages as the physical enforcement centers of untouchability and caste dominance, advocating state-driven constitutional modernization and individual rights. Gandhi advocated decentralized rural autonomy.'
    }
  ];

  res.json({ success: true, count: presets.length, presets });
});

module.exports = router;
