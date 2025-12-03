const router = require('express').Router();
const mongoose = require('mongoose');

const DB_STATE = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

router.get('/health', (req, res) => {
  const dbReadyState = mongoose.connection.readyState;
  const isDbHealthy = dbReadyState === 1;

  const payload = {
    status: isDbHealthy ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: {
      status: DB_STATE[dbReadyState] || 'unknown',
      readyState: dbReadyState
    }
  };

  return res.status(isDbHealthy ? 200 : 503).json(payload);
});

module.exports = router;
