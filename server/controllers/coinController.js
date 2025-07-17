const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

// GET /api/coins
exports.getCoins = async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
        },
      }
    );

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(500).json({ message: 'No data received from API' });
    }

    // Clear and insert new current data
    await CurrentData.deleteMany({});

    const docs = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(coin.last_updated),
    }));

    await CurrentData.insertMany(docs);

    res.status(200).json(docs);
  } catch (err) {
    console.error('Error fetching or saving coin data:', err.message);
    res.status(500).json({ message: 'Failed to fetch coin data' });
  }
};

// POST /api/history
exports.saveHistory = async (req, res) => {
  try {
    const currentData = await CurrentData.find();

    if (currentData.length === 0) {
      return res.status(404).json({ message: 'No current data to save' });
    }

    const historyDocs = currentData.map((coin) => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      lastUpdated: new Date(), // Timestamp when history is saved
    }));

    await HistoryData.insertMany(historyDocs);

    res.status(201).json({ message: 'History saved successfully' });
  } catch (err) {
    console.error('Error saving history:', err.message);
    res.status(500).json({ message: 'Failed to save history' });
  }
};

// GET /api/history/:coinId
exports.getHistory = async (req, res) => {
  try {
    const { coinId } = req.params;

    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No history found for this coin' });
    }

    res.status(200).json(history);
  } catch (err) {
    console.error(`Error fetching history for coin ${req.params.coinId}:`, err.message);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};
