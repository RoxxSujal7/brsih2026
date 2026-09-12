/**
 * roles.js — Robust Institutional Role-Based Access Control (RBAC) Middleware
 * Enforces least-privilege authorization across Visitor, Researcher,
 * Content Editor, Archivist, Admin, and Super Admin roles.
 */

const ROLE_PERMISSIONS = {
  super_admin: [
    'browse_public',
    'access_workspace',
    'save_bookmarks',
    'export_citations',
    'edit_content',
    'edit_metadata',
    'upload_records',
    'publish_records',
    'verify_ocr',
    'manage_preservation',
    'delete_records',
    'manage_users',
    'manage_roles',
    'manage_system'
  ],
  admin: [
    'browse_public',
    'access_workspace',
    'save_bookmarks',
    'export_citations',
    'edit_content',
    'edit_metadata',
    'upload_records',
    'publish_records',
    'verify_ocr',
    'manage_preservation',
    'delete_records',
    'manage_users',
    'manage_roles',
    'manage_system'
  ],
  archivist: [
    'browse_public',
    'access_workspace',
    'save_bookmarks',
    'export_citations',
    'edit_content',
    'edit_metadata',
    'upload_records',
    'publish_records',
    'verify_ocr',
    'manage_preservation'
  ],
  content_editor: [
    'browse_public',
    'access_workspace',
    'save_bookmarks',
    'export_citations',
    'edit_content',
    'edit_metadata'
  ],
  researcher: [
    'browse_public',
    'access_workspace',
    'save_bookmarks',
    'export_citations'
  ],
  visitor: [
    'browse_public'
  ]
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const currentRole = req.user.role || 'visitor';
    const effectiveRoles = [currentRole];
    if (currentRole === 'super_admin') effectiveRoles.push('admin');
    if (currentRole === 'admin') effectiveRoles.push('super_admin');

    const hasAccess = allowedRoles.some(r => effectiveRoles.includes(r));
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Operation requires one of: [${allowedRoles.join(', ')}].`,
        requiredRoles: allowedRoles,
        currentRole: currentRole,
      });
    }
    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const currentRole = req.user.role || 'visitor';
    const permissions = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.visitor;

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role "${currentRole}" lacks required permission: "${permission}".`,
        requiredPermission: permission,
        currentRole: currentRole,
      });
    }
    next();
  };
};

module.exports = { requireRole, requirePermission, ROLE_PERMISSIONS };

