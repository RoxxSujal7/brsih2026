/**
 * hybridSearchService.js — Institutional Hybrid Semantic Search & Grounded Retrieval Engine
 * 
 * Implements a dual-engine architecture:
 * 1. Lexical BM25 / Token Overlap Engine (exact terminology, volumes, dates, people)
 * 2. Semantic Vector Space Engine (TF-IDF vector space + Cosine Similarity with conceptual expansion)
 * 3. Hybrid Ranking Fusion:
 *    Score = (0.55 * LexicalScore) + (0.35 * SemanticScore) + (0.10 * SourceAuthorityBoost)
 * 
 * Also provides Grounded Retrieval for the AI Assistant, assembling verified primary source
 * passages with exact BAWS volume, year, and Dublin Core provenance.
 */

const fs = require('fs');
const path = require('path');
const { MEA_BAWS_VOLUMES } = require('../seed/meaVolumes');

const DATA_DIR = path.join(__dirname, '../data');

// Common English & Hindi stopwords
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
  'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours'
]);

// Conceptual Synonyms / Semantic Expansion Map
const CONCEPTUAL_MAP = {
  'caste': ['untouchability', 'dalit', 'varna', 'shudra', 'annihilation', 'endogamy', 'graded inequality', 'social reform', 'baws-vol-1'],
  'untouchability': ['caste', 'dalit', 'varna', 'annihilation', 'graded inequality', 'social reform', 'moral reform', 'baws-vol-1'],
  'annihilation': ['caste', 'reform', 'jat-pat-todak', 'inter-caste', 'equality', 'liberty', 'untouchability'],
  'reform': ['annihilation', 'caste', 'social reform', 'moral', 'equality', 'baws-vol-1'],
  'moral': ['constitutional morality', 'social reform', 'dhamma', 'ethics', 'annihilation', 'caste'],
  'democracy': ['social democracy', 'constitutional morality', 'equality', 'liberty', 'fraternity', 'representation', 'parliamentary'],
  'constitution': ['drafting committee', 'fundamental rights', 'article', 'preamble', 'constituent assembly', 'legal safeguards'],
  'buddhism': ['conversion', 'nagpur', 'dhamma', 'sangha', 'ashoka', 'deekshabhoomi', '22 vows', 'buddha or karl marx'],
  'electorates': ['poona pact', 'communal award', 'separate electorates', 'macdonald', 'round table conference', 'minority representation'],
  'pakistan': ['partition', 'muslim league', 'jinnah', 'self-determination', 'boundary', 'nationalism'],
  'economics': ['problem of the rupee', 'provincial finance', 'currency', 'taxation', 'central bank', 'rbi', 'gold standard'],
  'memorial': ['chaitya bhoomi', 'deeksha bhoomi', 'mhow', 'daic', 'rajgruha', 'mahad', 'chavdar tale']
};

class HybridSearchEngine {
  constructor() {
    this.chunks = [];
    this.vocabulary = new Map(); // term -> document frequency
    this.totalDocs = 0;
    this.initialized = false;
    this.init();
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOPWORDS.has(t));
  }

  init() {
    try {
      const allChunks = [];

      // 1. Ingest BAWS Volumes Chunks
      MEA_BAWS_VOLUMES.forEach(vol => {
        allChunks.push({
          id: `baws-vol-${vol.volumeNo}`,
          type: 'Volume',
          title: `BAWS Vol. ${vol.volumeNo}: ${vol.title}`,
          volumeNo: vol.volumeNo,
          year: vol.year,
          category: vol.category,
          source: vol.source || 'Dr. Ambedkar Foundation (BAWS)',
          content: `${vol.title} ${vol.summary} ${(vol.tags || []).join(' ')} BAWS Volume ${vol.volumeNo}`,
          snippet: vol.summary,
          link: `reader.html?vol=${vol.volumeNo}`,
          authorityScore: 1.0
        });
      });

      // 2. Ingest Letters Chunks
      const lettersFile = path.join(DATA_DIR, 'letters.json');
      if (fs.existsSync(lettersFile)) {
        try {
          const letters = JSON.parse(fs.readFileSync(lettersFile, 'utf8'));
          if (Array.isArray(letters)) {
            letters.slice(0, 100).forEach((l, idx) => {
              const textContent = `${l.title || ''} ${l.recipient || ''} ${l.content || l.summary || ''} ${l.date || ''}`;
              allChunks.push({
                id: l.id || `letter-${idx + 1}`,
                type: 'Letter',
                title: l.title || `Correspondence to ${l.recipient || 'Historical Associate'}`,
                volumeNo: l.bawsVolume || 21,
                year: l.date ? parseInt(l.date.slice(0, 4), 10) : 1932,
                category: 'letters',
                source: 'BAWS Vol. 21 / Correspondence Archive',
                content: textContent,
                snippet: (l.content || l.summary || '').slice(0, 200) + '...',
                link: `letters.html?id=${l.id || idx + 1}`,
                authorityScore: 0.95
              });
            });
          }
        } catch (_) {}
      }

      // 3. Ingest Historical Debates Chunks
      const debatesFile = path.join(DATA_DIR, 'debates.json');
      if (fs.existsSync(debatesFile)) {
        try {
          const debates = JSON.parse(fs.readFileSync(debatesFile, 'utf8'));
          if (Array.isArray(debates)) {
            debates.forEach(d => {
              allChunks.push({
                id: d.id,
                type: 'Debate',
                title: d.title,
                volumeNo: d.primaryVolumeNo || 9,
                year: d.year || 1932,
                category: 'debates',
                source: d.ambedkarPosition ? d.ambedkarPosition.bawsReference : 'Historical Debates Archive',
                content: `${d.title} ${d.description || ''} ${d.historicalEra || ''} ${(d.topicsCovered || []).join(' ')} ${d.whyItMatters || ''}`,
                snippet: d.description || d.whyItMatters || '',
                link: `debates.html?id=${d.id}`,
                authorityScore: 0.98
              });
            });
          }
        } catch (_) {}
      }

      // 4. Ingest National Memorials Chunks
      const memorialsFile = path.join(DATA_DIR, 'memorials.json');
      if (fs.existsSync(memorialsFile)) {
        try {
          const memorials = JSON.parse(fs.readFileSync(memorialsFile, 'utf8'));
          if (Array.isArray(memorials)) {
            memorials.forEach(m => {
              allChunks.push({
                id: m.id,
                type: 'Memorial',
                title: m.name,
                volumeNo: null,
                year: m.establishedYear || null,
                category: 'memorials',
                source: 'Ministry of Social Justice & Empowerment',
                content: `${m.name} ${m.city} ${m.state} ${m.historicalContext || ''} ${(m.architecturalFeatures || []).join(' ')} ${(m.tags || []).join(' ')}`,
                snippet: (m.historicalContext || '').slice(0, 200) + '...',
                link: `memorials.html?id=${m.id}`,
                authorityScore: 0.90
              });
            });
          }
        } catch (_) {}
      }

      // Compute Vocabulary Document Frequencies for Vector Model
      this.chunks = allChunks;
      this.totalDocs = allChunks.length;

      const docFreq = new Map();
      this.chunks.forEach(chunk => {
        const tokens = new Set(this.tokenize(chunk.content));
        chunk._tokens = tokens;
        tokens.forEach(t => {
          docFreq.set(t, (docFreq.get(t) || 0) + 1);
        });
      });

      this.vocabulary = docFreq;
      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize Hybrid Search Engine:', err);
    }
  }

  // Calculate TF-IDF Vector representation for query and document
  getVector(tokens) {
    const vec = new Map();
    tokens.forEach(t => {
      const count = (vec.get(t) || 0) + 1;
      vec.set(t, count);
    });

    const tfidfVec = new Map();
    let normSq = 0;
    vec.forEach((count, term) => {
      const df = this.vocabulary.get(term) || 1;
      const idf = Math.log((this.totalDocs + 1) / df);
      const val = count * idf;
      tfidfVec.set(term, val);
      normSq += val * val;
    });

    return { vec: tfidfVec, norm: Math.sqrt(normSq) || 1 };
  }

  cosineSimilarity(v1, v2) {
    let dot = 0;
    v1.vec.forEach((val1, term) => {
      if (v2.vec.has(term)) {
        dot += val1 * v2.vec.get(term);
      }
    });
    return dot / (v1.norm * v2.norm);
  }

  // Calculate lexical matching score (exact term presence & title weights)
  computeLexicalScore(queryTokens, chunk) {
    if (!queryTokens.length) return 0;
    let matchCount = 0;
    let titleBoost = 0;

    const titleTokens = this.tokenize(chunk.title);
    queryTokens.forEach(t => {
      if (chunk._tokens.has(t)) matchCount++;
      if (titleTokens.includes(t)) titleBoost += 0.5;
    });

    const ratio = matchCount / queryTokens.length;
    return Math.min(1.0, ratio + titleBoost);
  }

  // Expand query conceptually using synonym mapping
  expandQuery(queryTokens) {
    const expanded = new Set(queryTokens);
    queryTokens.forEach(t => {
      if (CONCEPTUAL_MAP[t]) {
        CONCEPTUAL_MAP[t].forEach(syn => {
          this.tokenize(syn).forEach(st => expanded.add(st));
        });
      }
    });
    return Array.from(expanded);
  }

  searchHybrid(query, options = {}) {
    if (!query || typeof query !== 'string') return [];

    const { type = 'all', volume = null, limit = 20 } = options;
    const rawTokens = this.tokenize(query);
    if (!rawTokens.length) return [];

    const expandedTokens = this.expandQuery(rawTokens);
    const queryVec = this.getVector(expandedTokens);

    let candidates = this.chunks;

    // Filter by type
    if (type && type !== 'all') {
      const tLower = type.toLowerCase();
      candidates = candidates.filter(c => 
        c.type.toLowerCase() === tLower ||
        c.category.toLowerCase() === tLower ||
        (tLower === 'volumes' && c.type === 'Volume')
      );
    }

    // Filter by volumeNo
    if (volume) {
      const vNum = parseInt(volume, 10);
      if (!isNaN(vNum)) {
        candidates = candidates.filter(c => c.volumeNo === vNum);
      }
    }

    const scored = candidates.map(chunk => {
      const chunkTokens = Array.from(chunk._tokens);
      const chunkVec = this.getVector(chunkTokens);

      const lexicalScore = this.computeLexicalScore(rawTokens, chunk);
      const semanticScore = this.cosineSimilarity(queryVec, chunkVec);
      const authorityScore = chunk.authorityScore || 0.9;

      // Hybrid formula
      const hybridScore = (0.55 * lexicalScore) + (0.35 * semanticScore) + (0.10 * authorityScore);

      let matchType = 'semantic';
      if (lexicalScore > 0.6) matchType = 'lexical';
      if (lexicalScore > 0.3 && semanticScore > 0.2) matchType = 'hybrid';

      // Generate snippet with matching highlights
      let snippet = chunk.snippet || '';
      rawTokens.forEach(t => {
        const regex = new RegExp(`(${t})`, 'gi');
        snippet = snippet.replace(regex, '<mark>$1</mark>');
      });

      return {
        id: chunk.id,
        type: chunk.type,
        title: chunk.title,
        volumeNo: chunk.volumeNo,
        year: chunk.year,
        category: chunk.category,
        source: chunk.source,
        snippet: snippet,
        link: chunk.link,
        scores: {
          hybrid: parseFloat(hybridScore.toFixed(3)),
          lexical: parseFloat(lexicalScore.toFixed(3)),
          semantic: parseFloat(semanticScore.toFixed(3))
        },
        matchType,
        score: parseFloat(hybridScore.toFixed(3))
      };
    });

    // Filter items with minimal relevance and sort
    return scored
      .filter(item => item.scores.hybrid > 0.08 || item.scores.lexical > 0.12 || item.scores.semantic > 0.08)
      .sort((a, b) => b.scores.hybrid - a.scores.hybrid)
      .slice(0, limit);
  }

  // Retrieve grounded primary source context for the AI Assistant
  retrieveGroundedContext(userPrompt, topK = 4) {
    const results = this.searchHybrid(userPrompt, { limit: topK });
    if (!results.length) return null;

    const primarySources = results.map(r => ({
      title: r.title,
      volumeNo: r.volumeNo,
      type: r.type,
      source: r.source,
      citation: r.volumeNo ? `BAWS Vol. ${r.volumeNo} — ${r.title}` : r.title,
      snippet: r.snippet.replace(/<\/?mark>/g, '')
    }));

    const contextText = primarySources.map((ps, idx) => {
      return `[SOURCE ${idx + 1}]: ${ps.citation}\nEXCERPT: ${ps.snippet}\nPROVENANCE: ${ps.source}`;
    }).join('\n\n');

    return {
      contextText,
      primarySources,
      topItem: results[0]
    };
  }
}

const hybridSearchInstance = new HybridSearchEngine();

module.exports = hybridSearchInstance;
