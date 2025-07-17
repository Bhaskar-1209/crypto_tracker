require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const coinRoutes = require('./routes/coinRoutes');
const startCronJob = require('./cron/fetchCoins');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', coinRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startCronJob();
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Server running'));
  })
  .catch(err => console.error('❌ DB Error:', err));