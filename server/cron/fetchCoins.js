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

    // Format data
    const formatted = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp: new Date()
    }));

    // Overwrite current data
    await CurrentData.deleteMany({});
    await CurrentData.insertMany(formatted);

    // Append to history
    await HistoryData.insertMany(formatted);

    console.log(`✅ Data synced at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('❌ Error syncing data:', err.message);
  }
};

const startCronJob = () => {
  cron.schedule('*/5 * * * *', fetchAndSave); // every 5 minutes
  fetchAndSave(); // run once immediately on start
};

module.exports = startCronJob;
