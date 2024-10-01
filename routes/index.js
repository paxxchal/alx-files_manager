// routes/index.js

const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

// GET /status => AppController.getStatus
router.get('/status', AppController.getStatus);

// GET /stats => AppController.getStats
router.get('/stats', AppController.getStats);

module.exports = router;
