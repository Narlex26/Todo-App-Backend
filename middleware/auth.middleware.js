const createError = require('http-errors');

// Middleware pour vérifier l'API Key
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.error('API_KEY non configurée dans les variables d\'environnement');
    return next(createError(500, 'Configuration serveur manquante'));
  }

  if (!apiKey) {
    return next(createError(401, 'API Key manquante'));
  }

  if (apiKey !== validApiKey) {
    return next(createError(403, 'API Key invalide'));
  }

  next();
};

// Middleware pour vérifier le User-Agent
const verifyUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const blockedAgents = ['curl', 'wget', 'python-requests'];

  if (process.env.NODE_ENV === 'production' && userAgent) {
    const isBlocked = blockedAgents.some(blocked =>
      userAgent.toLowerCase().includes(blocked)
    );

    if (isBlocked) {
      return next(createError(403, 'User-Agent non autorisé'));
    }
  }

  next();
};

module.exports = {
  verifyApiKey,
  verifyUserAgent
};
