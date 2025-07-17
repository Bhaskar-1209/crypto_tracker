const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

exports.getCurrentCoins = async (req, res) => {
  try {
    const data = await CurrentData.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current data' });
  }
};

exports.getHistoryCoins = async (req, res) => {
  try {
    const data = await HistoryData.find({}).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
};
