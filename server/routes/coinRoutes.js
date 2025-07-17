const express = require('express');
const router = express.Router();
const { getCoins, postHistory, getHistoryByCoin } = require('../controllers/coinController');

router.get('/coins', getCoins);
router.post('/history', postHistory);
router.get('/history/:coinId', getHistoryByCoin);

module.exports = router;
