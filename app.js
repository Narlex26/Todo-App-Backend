'use strict';

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const createError = require('http-errors');
require('dotenv').config();

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Initialisation de l'application
const app = express();

// Middleware essentiels
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

module.exports = app;
