const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This feature requires a ${roles.join(' or ')} account.`,
        requiredRole: roles,
        currentRole: req.user.role,
      });
    }
    next();
  };
};

module.exports = { requireRole };
