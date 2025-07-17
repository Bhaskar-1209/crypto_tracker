const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

// Get all current coins + last updated timestamp
exports.getCurrentCoins = async (req, res) => {
  try {
    const data = await CurrentData.find({});

    // Get the latest timestamp (assuming all docs have same time)
    const lastUpdatedDoc = await CurrentData.findOne().sort({ timestamp: -1 });

    res.json({
      lastUpdated: lastUpdatedDoc?.timestamp || null,
      data
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch current data' });
  }
};

// Get all history data (sorted by time)
exports.getHistoryCoins = async (req, res) => {
  try {
    const data = await HistoryData.find({}).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
};
