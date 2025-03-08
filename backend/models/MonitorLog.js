/**
 * MonitorLog model captures historical checks for trending and analysis.
 * For each check, a record is inserted detailing the status, response time, etc.
 */
const { DataTypes } = require('sequelize');
const { getSequelizeInstance } = require('../utils/database');

const sequelize = getSequelizeInstance();

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
