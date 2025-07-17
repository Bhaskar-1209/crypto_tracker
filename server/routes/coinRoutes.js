const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

// Base route message
router.get('/', coinController.baseRoute);

// Other API routes
router.get('/coins', coinController.getCoins);
router.post('/history', coinController.saveHistory);
router.get('/history/:coinId', coinController.getHistory);

module.exports = router;
