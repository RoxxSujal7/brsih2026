/**
 * documentService.js — Service layer for document queries, search, and MEA catalog
 */

const Document = require('../models/Document');
const { MEA_BAWS_VOLUMES } = require('../seed/meaVolumes');
const { HINDI_BAWS_VOLUMES } = require('../seed/hindiVolumes');
const { NotFoundError } = require('../errors/AppError');

function getEnglishLocalPdf(volNo) {
  if (volNo === 14) return '/pdfs/Volume14_Part_I.pdf';
  if (volNo === 17) return '/pdfs/Volume17_Part_I.pdf';
  return `/pdfs/Volume${volNo}.pdf`;
}

function getAllCatalogVolumes() {
  const english = MEA_BAWS_VOLUMES.map((v) => ({
    _id: `doc-en-${v.volumeNo}`,
    title: `BAWS Vol. ${v.volumeNo}: ${v.title}`,
    titleHi: v.titleHi,
    titleMr: v.titleMr,
    category: v.category,
    language: ['en', 'hi', 'mr'],
    year: v.year,
    volume: `BAWS Vol. ${v.volumeNo}`,
    volumeNo: v.volumeNo,
    edition: 'English BAWS',
    summary: v.summary,
    tags: v.tags,
    isFeatured: v.isFeatured,
    localPdf: getEnglishLocalPdf(v.volumeNo),
    downloadUrl: getEnglishLocalPdf(v.volumeNo),
    externalUrl: v.downloadUrl,
  }));

  const hindi = HINDI_BAWS_VOLUMES.map((v) => ({
    _id: `doc-hi-${v.volumeNo}`,
    title: v.title,
    titleHi: v.titleHi,
    category: v.category,
    language: ['hi'],
    year: v.year,
    volume: `वाङ्मय खंड ${v.volumeNo}`,
    volumeNo: v.volumeNo,
    edition: 'Hindi BAWS',
    summary: v.summary,
    tags: v.tags,
    isFeatured: v.isFeatured,
    localPdf: v.localPdf,
    downloadUrl: v.localPdf,
    externalUrl: v.downloadUrl,
  }));

  return [...english, ...hindi];
}

class DocumentService {
  async getDocuments(query = {}) {
    const { category, language, year, edition, page = 1, limit = 24 } = query;
    let documents = [];
    let total = 0;

    try {
      const filter = { isPublic: true };
      if (category && category !== 'all') filter.category = category;
      if (language) filter.language = language;
      if (year) filter.year = parseInt(year);

      const skip = (parseInt(page) - 1) * parseInt(limit);
      [documents, total] = await Promise.all([
        Document.find(filter).skip(skip).limit(parseInt(limit)),
        Document.countDocuments(filter),
      ]);
    } catch (e) {
      documents = [];
    }

    if (documents.length === 0) {
      let catalog = getAllCatalogVolumes();
      if (edition === 'english' || language === 'en') {
        catalog = catalog.filter((d) => d.edition === 'English BAWS');
      } else if (edition === 'hindi' || language === 'hi') {
        catalog = catalog.filter((d) => d.edition === 'Hindi BAWS');
      }

      if (category && category !== 'all') {
        catalog = catalog.filter((d) => d.category.toLowerCase() === category.toLowerCase());
      }
      if (year) {
        catalog = catalog.filter((d) => d.year === parseInt(year));
      }

      total = catalog.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      documents = catalog.slice(skip, skip + parseInt(limit));
    }

    return { documents, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) };
  }

  async getFeaturedDocuments() {
    let documents = [];
    try {
      documents = await Document.find({ isFeatured: true, isPublic: true }).limit(6);
    } catch (e) {
      documents = [];
    }

    if (documents.length === 0) {
      const catalog = getAllCatalogVolumes();
      documents = catalog.filter((v) => v.isFeatured).slice(0, 6);
    }

    return documents;
  }

  async getDocumentById(id) {
    let doc = null;
    try {
      doc = await Document.findById(id);
      if (doc) await doc.incrementViews();
    } catch (e) {
      doc = null;
    }

    if (!doc) {
      const all = getAllCatalogVolumes();
      doc = all.find((d) => d._id === id || d._id === `doc-${id}`);

      if (!doc) {
        // Match numeric id like '1' or 'doc-1'
        const cleanId = id.replace('doc-', '');
        doc = all.find((d) => d.volumeNo === parseInt(cleanId)) || all[0];
      }

      if (doc) {
        doc = {
          ...doc,
          paragraphs: [
            doc.summary,
            `Official Volume ${doc.volumeNo} published by the Ministry of External Affairs and Dr. Ambedkar Foundation. Available in high-fidelity PDF format in this digital heritage repository.`,
            `This work forms a fundamental pillar of modern Indian legal, constitutional, and social history, articulating principles of Liberty, Equality, and Fraternity.`,
            `"Caste is not a physical object like a wall of bricks or a line of barbed wire. Caste is a notion; it is a state of the mind. The destruction of Caste does not mean the destruction of a physical barrier. It means a notional change."`,
            `"Democracy is not merely a form of Government. It is primarily a mode of associated living, of conjoint communicated experience. It is essentially an attitude of respect and reverence towards fellowmen."`,
            `"Educate, Agitate, Organize — have faith in yourselves. With justice on our side, I do not see how we can lose our battle."`,
          ],
        };
      }
    }

    if (!doc) {
      throw new NotFoundError('Document', id);
    }

    return doc;
  }

  getMeaCatalog() {
    return {
      source: 'Ministry of External Affairs (MEA) & Dr. Ambedkar Foundation',
      totalCount: 61,
      englishCount: MEA_BAWS_VOLUMES.length,
      hindiCount: HINDI_BAWS_VOLUMES.length,
      englishVolumes: MEA_BAWS_VOLUMES,
      hindiVolumes: HINDI_BAWS_VOLUMES,
    };
  }
}

module.exports = new DocumentService();

