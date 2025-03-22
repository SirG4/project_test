require('dotenv').config();

const securityConfig = {
  apiSecretKey: process.env.API_SECRET_KEY,
  judge0: {
    apiUrl: process.env.JUDGE0_API_URL || 'http://localhost:2358',
    authHeader: process.env.JUDGE0_API_AUTH_HEADER || 'X-Auth-Token',
    authKey: process.env.JUDGE0_API_AUTH_KEY
  },
  rateLimiting: {
    windowMs: process.env.RATE_LIMIT_WINDOW || '15m',
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  validation: {
    enabled: process.env.ENABLE_REQUEST_VALIDATION === 'true'
  }
};

module.exports = securityConfig;
