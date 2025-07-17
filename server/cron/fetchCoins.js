const cron = require('node-cron');
const axios = require('axios');
const HistoryData = require('../models/HistoryData');

function startCronJob() {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('⏳ Cron job started');
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1
          }
        }
      );

      const timestamp = new Date();

      for (const coin of response.data) {
        const newEntry = new HistoryData({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          change24h: coin.price_change_percentage_24h,
          lastUpdated: timestamp
        });
        await newEntry.save();
      }
      console.log(`✅ Cron job completed at ${timestamp}`);
    } catch (err) {
      console.error('❌ Cron job error:', err);
    }
  });
}

module.exports = startCronJob;
