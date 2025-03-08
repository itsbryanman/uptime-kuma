/**
 * Main entry point for the Uptime Kuma backend.
 * Includes secure headers, concurrency-based scheduling,
 * validation logic, and robust error handling.
 */

require('dotenv').config({ path: './config/config.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDatabase } = require('./utils/database');
const monitorRoutes = require('./routes/monitorRoutes');
const { scheduleMonitoring } = require('./services/scheduler');
const notificationService = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Initialize DB (sync models, migrations, etc.)
initDatabase();

// Routes
app.use('/api/monitors', monitorRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  return res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Uptime Kuma backend is running on port ${PORT}`);
  
  // Start the monitoring scheduler
  scheduleMonitoring(notificationService.triggerNotifications);
});
