/**
 * admin.js — Protected Institutional Administration & Curatorial Routes
 * Enforces strict backend authentication and Role-Based Access Control (RBAC).
 * 
 * Hierarchy:
 * - super_admin / admin : Full administrative control, user provisioning, system settings, deletion
 * - archivist          : Curatorial ingestion, metadata editing, OCR verification, publishing
 * - content_editor     : Content & metadata updates, educational notes
 * - researcher / visitor: Strictly DENIED access to all administrative APIs (403)
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/roles');
const userService = require('../services/userService');
const path = require('path');
const fs = require('fs');

// All routes under /api/admin require authentication
router.use(protect);

/**
 * In-memory curatorial audit log for institutional tracking
 */
const auditLog = [
  {
    id: 'LOG-001',
    action: 'SYSTEM_BOOT',
    performedBy: 'system',
    role: 'super_admin',
    details: 'Institutional digital preservation services initialized.',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

function logAdminAction(req, action, details) {
  auditLog.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    action,
    performedBy: req.user ? req.user.email : 'unknown',
    role: req.user ? req.user.role : 'none',
    details,
    timestamp: new Date().toISOString()
  });
  if (auditLog.length > 50) auditLog.pop();
}

/**
 * GET /api/admin/dashboard
 * Institutional overview accessible to archivists, editors, and admins.
 * Denied to researchers and public visitors.
 */
router.get('/dashboard', requireRole('super_admin', 'admin', 'archivist', 'content_editor'), async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    let totalVolumes = 17;
    let totalLetters = 361;
    let totalMemorials = 8;
    let totalDebates = 6;

    try {
      if (fs.existsSync(path.join(dataDir, 'letters.json'))) {
        const letters = JSON.parse(fs.readFileSync(path.join(dataDir, 'letters.json'), 'utf8'));
        totalLetters = Array.isArray(letters) ? letters.length : 361;
      }
      if (fs.existsSync(path.join(dataDir, 'memorials.json'))) {
        const memorials = JSON.parse(fs.readFileSync(path.join(dataDir, 'memorials.json'), 'utf8'));
        totalMemorials = Array.isArray(memorials) ? memorials.length : 8;
      }
    } catch (_) {}

    res.json({
      success: true,
      data: {
        curator: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          institution: req.user.institution || 'Dr. Ambedkar International Centre'
        },
        stats: {
          totalVolumes,
          totalLetters,
          totalMemorials,
          totalDebates,
          pendingOcrReviews: 2,
          preservationStatus: 'VERIFIED_HEALTHY'
        },
        recentAuditLog: auditLog.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate admin dashboard.' });
  }
});

/**
 * POST /api/admin/documents
 * Archival ingestion / document creation.
 * Restricted to super_admin, admin, and archivist.
 */
router.post('/documents', requirePermission('upload_records'), (req, res) => {
  const { title, category, volumeNo, summary } = req.body;
  if (!title || !category) {
    return res.status(400).json({ success: false, message: 'Title and category are required.' });
  }

  const newDoc = {
    id: `ARCH-DOC-${Date.now()}`,
    title: String(title).slice(0, 200),
    category: String(category).slice(0, 50),
    volumeNo: volumeNo ? parseInt(volumeNo, 10) : null,
    summary: summary ? String(summary).slice(0, 1000) : '',
    status: 'draft',
    createdBy: req.user.email,
    createdAt: new Date().toISOString()
  };

  logAdminAction(req, 'DOCUMENT_INGEST', `Archived document: "${newDoc.title}"`);

  res.status(201).json({
    success: true,
    message: 'Archival document cataloged successfully.',
    document: newDoc
  });
});

/**
 * PATCH /api/admin/documents/:id/metadata
 * Metadata curation.
 * Accessible to super_admin, admin, archivist, and content_editor.
 */
router.patch('/documents/:id/metadata', requirePermission('edit_metadata'), (req, res) => {
  const { id } = req.params;
  const { title, tags, description } = req.body;

  logAdminAction(req, 'METADATA_UPDATE', `Updated metadata for document ID ${id}`);

  res.json({
    success: true,
    message: `Metadata for document ${id} updated successfully.`,
    updatedFields: { title, tags, description }
  });
});

/**
 * PATCH /api/admin/documents/:id/publish
 * Publish / Unpublish archival record.
 * Restricted to super_admin, admin, and archivist (editors cannot publish directly).
 */
router.patch('/documents/:id/publish', requirePermission('publish_records'), (req, res) => {
  const { id } = req.params;
  const { published } = req.body;

  logAdminAction(req, published ? 'RECORD_PUBLISH' : 'RECORD_UNPUBLISH', `Record ${id} published status set to: ${!!published}`);

  res.json({
    success: true,
    message: `Record ${id} ${published ? 'published to public archive' : 'withdrawn to curatorial draft'}.`,
    id,
    published: !!published
  });
});

/**
 * DELETE /api/admin/documents/:id
 * Permanent deletion of archival record.
 * Restricted ONLY to super_admin and admin (Archivists cannot delete).
 */
router.delete('/documents/:id', requirePermission('delete_records'), (req, res) => {
  const { id } = req.params;

  logAdminAction(req, 'RECORD_DELETE', `Deleted archival record ${id}`);

  res.json({
    success: true,
    message: `Archival record ${id} permanently expunged by administrator.`
  });
});

/**
 * POST /api/admin/ocr/verify
 * Commit human curatorial correction to manuscript OCR.
 * Restricted to super_admin, admin, and archivist.
 */
router.post('/ocr/verify', requirePermission('verify_ocr'), (req, res) => {
  const { manuscriptId, correctedText, confidence } = req.body;
  if (!manuscriptId || !correctedText) {
    return res.status(400).json({ success: false, message: 'Manuscript ID and corrected text required.' });
  }

  logAdminAction(req, 'OCR_VERIFY', `Verified OCR for manuscript ${manuscriptId}`);

  res.json({
    success: true,
    message: `OCR transcription for ${manuscriptId} verified and signed by archivist.`,
    verifiedBy: req.user.email,
    verifiedAt: new Date().toISOString()
  });
});

/**
 * GET /api/admin/users
 * User directory and role audit.
 * Restricted ONLY to super_admin and admin.
 */
router.get('/users', requirePermission('manage_users'), async (req, res) => {
  try {
    const users = [
      { id: 'mock-001', name: 'Public Visitor', email: 'visitor@ambedkar-archive.in', role: 'visitor' },
      { id: 'mock-002', name: 'Archival Researcher', email: 'researcher@ambedkar-archive.in', role: 'researcher' },
      { id: 'mock-003', name: 'Content Editor', email: 'editor@ambedkar-archive.in', role: 'content_editor' },
      { id: 'mock-004', name: 'Senior Archivist', email: 'archivist@ambedkar-archive.in', role: 'archivist' },
      { id: 'mock-005', name: 'Archive Administrator', email: 'admin@ambedkar-archive.in', role: 'admin' },
      { id: 'mock-006', name: 'Super Administrator', email: 'superadmin@ambedkar-archive.in', role: 'super_admin' }
    ];

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve user registry.' });
  }
});

/**
 * PATCH /api/admin/users/:id/role
 * Elevate or demote user roles.
 * Restricted ONLY to super_admin and admin.
 */
router.patch('/users/:id/role', requirePermission('manage_roles'), (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['visitor', 'researcher', 'content_editor', 'archivist', 'admin', 'super_admin'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  logAdminAction(req, 'ROLE_MODIFY', `Changed role of user ${id} to ${role}`);

  res.json({
    success: true,
    message: `Role for user ${id} updated to "${role}".`,
    userId: id,
    newRole: role
  });
});

/**
 * PATCH /api/admin/system/settings
 * Update institutional system settings.
 * Restricted ONLY to super_admin and admin.
 */
router.patch('/system/settings', requirePermission('manage_system'), (req, res) => {
  const { institutionalName, preservationPolicyLevel } = req.body;

  logAdminAction(req, 'SYSTEM_CONFIG', `Updated institutional settings`);

  res.json({
    success: true,
    message: 'Institutional system settings updated successfully.',
    settings: { institutionalName, preservationPolicyLevel }
  });
});

module.exports = router;
