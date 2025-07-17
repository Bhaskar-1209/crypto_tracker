const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

//  Get all current coins + last updated timestamp
exports.getCurrentCoins = async (req, res) => {
  try {
    const data = await CurrentData.find({});
    const lastUpdatedDoc = await CurrentData.findOne().sort({ timestamp: -1 });

    res.json({
      lastUpdated: lastUpdatedDoc?.timestamp || null,
      data
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current data' });
  }
};

//  Get all history data (for all coins)
exports.getHistoryCoins = async (req, res) => {
  try {
    const data = await HistoryData.find({}).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
};

//  Get history for a specific coin (for chart)
exports.getCoinHistory = async (req, res) => {
  try {
    const { coinId } = req.params;

    const history = await HistoryData.find({ coinId }).sort({ timestamp: 1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ error: 'No history data found for this coin.' });
    }

    res.json(history);
  } catch (err) {
    console.error('Error fetching coin history:', err.message);
    res.status(500).json({ error: 'Failed to fetch coin history.' });
  }
};
