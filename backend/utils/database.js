/**
 * Database initialization utility using Sequelize.
 * Supports SQLite, PostgreSQL, or MySQL based on ENV.
 */

const { Sequelize } = require('sequelize');

let sequelize;

function initDatabase() {
  const dbUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';
  
  sequelize = new Sequelize(dbUrl, {
    logging: process.env.NODE_ENV !== 'production',  // Log only in dev
  });

  // Test connection & sync models
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected successfully.');
      return sequelize.sync(); // sync all models
    })
    .then(() => {
      console.log('Models synchronized.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

function getSequelizeInstance() {
  if (!sequelize) {
    throw new Error('Sequelize instance not initialized. Call initDatabase() first.');
  }
  return sequelize;
}

module.exports = {
  initDatabase,
  getSequelizeInstance,
};
