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
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
