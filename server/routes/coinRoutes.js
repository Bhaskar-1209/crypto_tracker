const express = require('express');
const router = express.Router();
const { getCurrentCoins, getHistoryCoins } = require('../controllers/coinController');

router.get('/coins', getCurrentCoins);
router.get('/history', getHistoryCoins);

module.exports = router;
