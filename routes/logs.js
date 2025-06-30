const express = require('express');
const router = express.Router();
const { frontendLogger } = require('../logger');

router.post('/', (req, res) => {
  const { level, message, data, error, timestamp } = req.body;

  frontendLogger.log({
    level: level || 'info',
    message,
    timestamp: timestamp || new Date(),
    ...(data && { data }),
    ...(error && { error }),
  });

  res.status(200).json({ message: 'Log reçu' });
});

module.exports = router;