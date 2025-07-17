const express = require('express');
const router = express.Router();
const {
  getCurrentCoins,
  getHistoryCoins,
  getCoinHistory, //  Add this
} = require('../controllers/coinController');

// Routes
router.get('/coins', getCurrentCoins);
router.get('/history', getHistoryCoins);
router.get('/history/:coinId', getCoinHistory); //  Route for chart history

module.exports = router;
