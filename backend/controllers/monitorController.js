/**
 * Controller with advanced validation, error handling,
 * and updated logic for monitors.
 */

const { validationResult } = require('express-validator');
const Monitor = require('../models/Monitor');
const MonitorLog = require('../models/MonitorLog');

exports.getAllMonitors = async (req, res, next) => {
  try {
    const monitors = await Monitor.findAll();
    res.json(monitors);
  } catch (err) {
    next(err);
  }
};

exports.createMonitor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const monitor = await Monitor.create(req.body);
    return res.status(201).json(monitor);
  } catch (err) {
    next(err);
  }
};

exports.getMonitorById = async (req, res, next) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    return res.json(monitor);
  } catch (err) {
    next(err);
  }
};

exports.updateMonitor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    await monitor.update(req.body);
    return res.json(monitor);
  } catch (err) {
    next(err);
  }
};

exports.deleteMonitor = async (req, res, next) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) {
      return res.status(404).json({ error: 'Monitor not found' });
    }
    await monitor.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getMonitorLogs = async (req, res, next) => {
  try {
    const logs = await MonitorLog.findAll({ where: { monitorId: req.params.id } });
    return res.json(logs);
  } catch (err) {
    next(err);
  }
};
