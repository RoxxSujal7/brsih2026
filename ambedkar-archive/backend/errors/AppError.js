/**
 * AppError.js — Essential Typed Error Classes
 */

class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = '') {
    const msg = id ? `${resource} not found with ID '${id}'` : `${resource} not found`;
    super(msg, 'NOT_FOUND', 404);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden: Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ForbiddenError,
};
