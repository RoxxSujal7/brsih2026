const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'Copy .env.example to .env and set a strong random secret (min 32 chars). ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
    );
  }
  if (secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long for security.');
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
