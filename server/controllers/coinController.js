const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

exports.getCoins = async (req, res) => {
  try {
    const { data } = await axios.get(COINGECKO_URL);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching coins:', error.message);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};

exports.saveHistory = async (req, res) => {
  try {
    const { data } = await axios.get(COINGECKO_URL);

    const formatted = data.map((coin) => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      percentChange24h: coin.price_change_percentage_24h,
      lastUpdated: new Date(coin.last_updated),
    }));

    await CurrentData.deleteMany();
    await CurrentData.insertMany(formatted);
    await HistoryData.insertMany(formatted);

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving history:', error.message);
    res.status(500).json({ error: 'Failed to save history' });
  }
};

exports.getCoinHistory = async (req, res) => {
  try {
    const { coinId } = req.params;
    const history = await HistoryData.find({ coinId }).sort({ lastUpdated: 1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
