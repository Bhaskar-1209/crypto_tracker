const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

// GET /api/coins — fetch top 10 coins from CoinGecko and store them in CurrentData
exports.getCoins = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
      },
    });

    const lastUpdated = new Date();

    // Clear previous CurrentData
    await CurrentData.deleteMany({});

    const coins = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      lastUpdated,
    }));

    await CurrentData.insertMany(coins);
    res.json(coins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch coins', error: err });
  }
};

// POST /api/history — save current data snapshot into HistoryData
exports.postHistory = async (req, res) => {
  try {
    const currentCoins = await CurrentData.find();
    console.log('📦 CurrentData count:', currentCoins.length);

    if (currentCoins.length === 0) {
      return res.status(400).json({ message: 'No current data to save in history.' });
    }

    const historySnapshot = currentCoins.map((coin) => ({
      coinId: coin.coinId,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      marketCap: coin.marketCap,
      change24h: coin.change24h,
      lastUpdated: coin.lastUpdated || new Date(),
    }));

    console.log('🕒 Saving history:', historySnapshot);

    await HistoryData.insertMany(historySnapshot);
    res.json({ message: 'History saved' });
  } catch (err) {
    console.error('❌ Error in postHistory:', err);
    res.status(500).json({ message: 'Failed to save history', error: err });
  }
};

// GET /api/history/:coinId — fetch history of a coin by ID and return readable date format
exports.getHistoryByCoin = async (req, res) => {
  try {
    const { coinId } = req.params;

    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: 1 });

    const formatted = history.map((entry) => ({
      coinId: entry.coinId,
      name: entry.name,
      symbol: entry.symbol,
      price: entry.price,
      marketCap: entry.marketCap,
      change24h: entry.change24h,
      lastUpdated: entry.lastUpdated, // frontend should handle formatting
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err });
  }
};
