const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

/**
 * Monitor model defines the configuration for each monitor
 * and tracks current status, intervals, etc.
 * Also references separate logs in MonitorLog for historical data.
 */
const Monitor = sequelize.define('Monitor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interval: {
    type: DataTypes.INTEGER,
    defaultValue: 60, // in seconds
  },
  method: {
    type: DataTypes.STRING,
    defaultValue: 'GET',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
  },
  lastCheckedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  lastResponseTime: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  expectedStatusCode: {
    type: DataTypes.INTEGER,
    defaultValue: 200,
  },
  authentication: {
    type: DataTypes.JSON,
    allowNull: true, // e.g., { type: 'basic', username: '', password: '' }
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: true, // e.g., { 'X-Custom-Header': 'value' }
  },
});

module.exports = Monitor;
