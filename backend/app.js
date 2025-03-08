/**
 * Main entry point for the Uptime Kuma backend.
 * We load environment variables, initialize the DB,
 * and only then require routes, services, etc.
 */

require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { initDatabase } = require('./utils/database');

async function startApp() {
  // Initialize database FIRST
  await initDatabase();

  // Now that DB is ready, we can safely require everything else
  const monitorRoutes = require('./routes/monitorRoutes');
  const notificationService = require('./services/notificationService');
  const { scheduleMonitoring } = require('./services/scheduler');

  const app = express();
  const PORT = process.env.PORT || 4000;

  // Middlewares
  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  // Routes
  app.use('/api/monitors', monitorRoutes);

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    return res.status(err.statusCode || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Uptime Kuma backend is running on port ${PORT}`);
    // Kick off the monitoring scheduler
    scheduleMonitoring(notificationService.triggerNotifications);
  });
}

// Start the app
startApp().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
