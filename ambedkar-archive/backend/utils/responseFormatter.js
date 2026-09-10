/**
 * responseFormatter.js — ECC Standardized API Response Utilities
 */

const sendSuccess = (res, data = null, message = 'Operation successful', statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    code: 'OK',
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
};

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const details = error.details || null;

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: error.timestamp || new Date().toISOString(),
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
