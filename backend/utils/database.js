/**
 * Database initialization using Sequelize.
 * Exports a 'sequelize' instance and an async 'initDatabase' function
 * that authenticates and syncs all models.
 */

const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

// Create Sequelize instance immediately
const sequelize = new Sequelize(dbUrl, {
  logging: process.env.NODE_ENV !== 'production', // Log only in dev
});

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync all models (Monitor, MonitorLog, etc.)
    await sequelize.sync();
    console.log('Models synchronized.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
  }
}

module.exports = {
  sequelize,
  initDatabase,
};
