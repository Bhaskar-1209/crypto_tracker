const express = require('express');
const router = express.Router();
const { baseRoute, getCoins, saveHistory, getHistory } = require('../controllers/coinController');

// Base route
router.get('/', baseRoute);

router.get('/coins', getCoins);
router.post('/history', saveHistory);
router.get('/history/:coinId', getHistory);

module.exports = router;
