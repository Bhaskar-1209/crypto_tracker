require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const coinRoutes = require('./routes/coinRoutes');
const startCronJob = require('./cron/fetchCoins');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api', coinRoutes);

// ✅ Welcome Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Crypto Tracker</h1>
    <p>This is the backend server for the Crypto Price Tracker project.</p>
  `);
});

// ✅ Mongo Connection & Cron Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startCronJob();
    app.listen(process.env.PORT || 7070, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 7070}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
