'use strict';

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const createError = require('http-errors');
require('dotenv').config();

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Middlewares de sécurité
const { verifyApiKey, verifyUserAgent } = require('./middleware/auth.middleware');

// Initialisation de l'application
const app = express();

// Configuration CORS sécurisée
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : ['http://localhost:4200', 'http://127.0.0.1:4200'];

    // Permettre les requêtes sans origine en développement
    if (process.env.NODE_ENV === 'development' && !origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware essentiels
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middlewares de sécurité appliqués aux routes API
app.use('/api', verifyUserAgent);
app.use('/api', verifyApiKey);

// Routes API
app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// Initialisation de la base de données
const db = require('./models');
db.sequelize.sync()
  .then(() => {
    console.log("Base de données synchronisée avec succès.");
  })
  .catch((err) => {
    console.error("Échec de la synchronisation de la base de données:", err);
  });

// Gestion des erreurs 404
app.use((req, res, next) => {
  next(createError(404));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const errorDetails = req.app.get('env') === 'development'
    ? { message: err.message, error: err }
    : { message: err.message };

  res.status(status).json(errorDetails);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});


module.exports = app;
