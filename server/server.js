const express = require('express');
const app = express();
const coinRoutes = require('./routes/coinRoutes');

// Middleware
app.use(express.json());

// Use the routes
app.use('/api', coinRoutes);

// Optional: fallback for unknown routes
app.use('*', (req, res) => {
  res.status(404).send('❌ Route not found.');
});

// Start server
const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
