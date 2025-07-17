const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

// ✅ Base Route: GET /
exports.baseRoute = (req, res) => {
  res.send(`
    <h2>🚀 Crypto Tracker Backend</h2>
    <p>This is the backend server. Please use a frontend or call <code>/api/coins</code>.</p>
  `);
};

// ✅ GET /api/coins
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
        },
        timeout: 5000 // ⏱ Timeout after 5 seconds
      }
    );

    const data = response.data;

    // Prepare data
    const docs = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(coin.last_updated)
    }));

    // Use upsert instead of delete + insert
    const ops = docs.map(doc => ({
      updateOne: {
        filter: { coinId: doc.coinId },
        update: { $set: doc },
        upsert: true
      }
    }));

    await CurrentData.bulkWrite(ops);

    res.json(docs);
  } catch (err) {
    console.error('❌ Failed to fetch coins:', err.message || err);
    if (err.response) {
      console.error('🔍 CoinGecko response:', err.response.data);
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ POST /api/history
exports.saveHistory = async (req, res) => {
  try {
    const currentData = await CurrentData.find();
    if (!currentData.length) {
      return res.status(404).json({ message: 'No current data to save' });
    }

    const now = new Date();

    const historyDocs = currentData.map((coin) => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      lastUpdated: now
    }));

    await HistoryData.insertMany(historyDocs);
    res.json({ message: 'History saved successfully' });
  } catch (err) {
    console.error('❌ Failed to save history:', err.message || err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ GET /api/history/:coinId
exports.getHistory = async (req, res) => {
  try {
    let { coinId } = req.params;

    if (!coinId) {
      return res.status(400).json({ message: 'Coin ID is required' });
    }

    // Normalize coinId to lowercase for consistency
    coinId = coinId.toLowerCase();

    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: 1 });

    if (!history.length) {
      return res.status(404).json({ message: `No historical data found for "${coinId}"` });
    }

    const formatted = history.map((entry) => ({
      timestamp: entry.lastUpdated,
      price: entry.price
    }));

    res.status(200).json({
      coinId,
      count: formatted.length,
      history: formatted
    });
  } catch (err) {
    console.error(`❌ Error fetching history for ${req.params.coinId}:`, err.message || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};