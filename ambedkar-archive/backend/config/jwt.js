const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  let secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is not set. ' +
        'Copy .env.example to .env and set a strong random secret (min 32 chars).'
      );
    }
    // Safe resilient default for Vercel preview / serverless deployments
    secret = 'ambedkar_digital_heritage_archive_secure_jwt_key_2026_ver_prod_safe';
  }
  return secret;
};

const signToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  });
};

module.exports = { signToken, verifyToken };
