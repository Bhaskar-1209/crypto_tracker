const express = require('express');
const router = express.Router();
const { getCoins, saveHistory, getHistory } = require('../controllers/coinController');

router.get('/coins', getCoins);
router.post('/history', saveHistory);
router.get('/history/:coinId', getHistory);

module.exports = router;
