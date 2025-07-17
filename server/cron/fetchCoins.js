// ==== server/cron/fetchCoins.js ====
const cron = require('node-cron');
const axios = require('axios');
const HistoryData = require('../models/HistoryData');

const fetchAndSave = async () => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
      },
    });

    const timestamp = new Date();
    const records = data.map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      marketCap: coin.market_cap,
      change24h: coin.price_change_percentage_24h,
      timestamp,
    }));

    await HistoryData.insertMany(records);
    console.log('📈 Historical data saved');
  } catch (err) {
    console.error('❌ Cron job failed:', err);
  }
};

module.exports = function startCronJob() {
  cron.schedule('0 * * * *', fetchAndSave); // every hour
};

