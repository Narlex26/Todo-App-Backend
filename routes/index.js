var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: 'Bienvenue sur l\'API Todo App',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    }
  });
});

module.exports = router;
