var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Suppression de la configuration du moteur de template Pug
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser la connexion à la base de données
const db = require('./models');
db.sequelize.sync()
  .then(() => {
    console.log("Base de données synchronisée avec succès.");
  })
  .catch((err) => {
    console.error("Échec de la synchronisation de la base de données:", err);
  });

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler - modifié pour envoyer JSON au lieu de rendre un template
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const errorDetails = req.app.get('env') === 'development' ? { message: err.message, error: err } : { message: err.message };

  // envoyer une réponse JSON d'erreur
  res.status(err.status || 500);
  res.json(errorDetails);
});

module.exports = app;
