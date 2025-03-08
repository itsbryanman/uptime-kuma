/**
 * Monitor model defines the configuration for each monitor
 * and tracks current status, intervals, etc.
 * Also references a separate MonitorLog model for historical data.
 */
const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../utils/database');

const sequelize = getSequelizeInstance();

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
    defaultValue: 200, // e.g., 200 means 'OK'
  },
  authentication: {
    type: DataTypes.JSON,
    allowNull: true, // e.g., { type: 'basic', username: '', password: '' }
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: true, // e.g., { 'Custom-Header': 'value' }
  },
});

module.exports = Monitor;
