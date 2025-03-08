const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

/**
 * MonitorLog model stores historical checks for each monitor.
 * Useful for uptime/downtime analysis over time.
 */
const MonitorLog = sequelize.define('MonitorLog', {
  monitorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  checkedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = MonitorLog;
