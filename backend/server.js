const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createTables } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
createTables();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/results', require('./routes/resultsRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Christmas Crib Evaluation API is running' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🎄 Server running on port ${PORT}`);
  console.log(`🎅 API URL: http://localhost:${PORT}/api`);
});