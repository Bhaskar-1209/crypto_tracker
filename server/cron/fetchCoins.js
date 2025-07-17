const cron = require('node-cron');
const axios = require('axios');
const CurrentData = require('../models/CurrentData');
const HistoryData = require('../models/HistoryData');

const fetchAndSave = async () => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1
      }
    });

    // Clear current data
    await CurrentData.deleteMany({});

    const formattedData = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date()
    }));

    // Save current data
    await CurrentData.insertMany(formattedData);

    // Save to history
    await HistoryData.insertMany(formattedData);

    console.log('✅ Synced coin data at', new Date().toLocaleString());
  } catch (err) {
    console.error('❌ Error fetching coin data:', err.message);
  }
};

const startCronJob = () => {
  cron.schedule('0 * * * *', fetchAndSave); // every hour
  fetchAndSave(); // run immediately at startup
};

module.exports = startCronJob;
