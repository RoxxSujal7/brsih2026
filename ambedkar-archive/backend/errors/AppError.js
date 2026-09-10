/**
 * AppError.js — ECC Error-Handling Skill: Typed Error Classes
 * Provides a structured error hierarchy for domain and HTTP exceptions.
 */

class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = '') {
    const msg = id ? `${resource} not found with ID '${id}'` : `${resource} not found`;
    super(msg, 'NOT_FOUND', 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden: Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.', retryAfterMs = 60000) {
    super(message, 'RATE_LIMITED', 429, { retryAfterMs });
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
};
