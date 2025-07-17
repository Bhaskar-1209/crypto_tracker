const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

// GET /api/coins
exports.getCoins = async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1
        }
      }
    );

    const data = response.data;

    // Update CurrentData collection
    await CurrentData.deleteMany({});
    const docs = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(coin.last_updated)
    }));
    await CurrentData.insertMany(docs);

    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
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
      lastUpdated: new Date()
    }));

    await HistoryData.insertMany(historyDocs);
    res.json({ message: 'History saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/history/:coinId
exports.getHistory = async (req, res) => {
  try {
    const { coinId } = req.params;
    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
