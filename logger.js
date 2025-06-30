// logger.js (ou similaire)
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = path.join(__dirname, 'logs');

// S’assurer que le dossier logs existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Logger principal pour le back-end
const backendLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'backend.log') })
  ],
});

// Logger dédié aux logs envoyés par le front-end
const frontendLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'frontend.log') })
  ],
});

module.exports = { backendLogger, frontendLogger };
