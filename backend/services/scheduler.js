/**
 * Schedules periodic checks for all monitors.
 * Uses node-cron for scheduling and p-limit to control concurrency.
 * Stores historical logs and triggers notifications when status changes.
 */

const cron = require('node-cron');
const pLimit = require('p-limit');
const axios = require('axios');
const { Op } = require('sequelize');

const Monitor = require('../models/Monitor');
const MonitorLog = require('../models/MonitorLog');

const CONCURRENCY_LIMIT = process.env.CONCURRENCY_LIMIT || 10;
const limit = pLimit(CONCURRENCY_LIMIT);

/**
 * Checks a single monitor, updates its status, records a log entry,
 * and returns the old/new status for notification triggers.
 */
async function checkMonitor(monitor) {
  const start = Date.now();
  let success = false;
  let newStatus = 'DOWN';
  let responseTime = null;

  const axiosConfig = {
    method: monitor.method,
    url: monitor.url,
    headers: monitor.headers || {},
    timeout: 10000, // 10s
  };

  if (monitor.authentication && monitor.authentication.type === 'basic') {
    axiosConfig.auth = {
      username: monitor.authentication.username,
      password: monitor.authentication.password,
    };
  }

  try {
    const response = await axios(axiosConfig);
    responseTime = Date.now() - start;
    newStatus = response.status === monitor.expectedStatusCode ? 'UP' : 'DOWN';
    success = newStatus === 'UP';
  } catch {
    newStatus = 'DOWN';
  }

  const oldStatus = monitor.status;
  await monitor.update({
    status: newStatus,
    lastCheckedAt: new Date(),
    lastResponseTime: responseTime,
  });

  await MonitorLog.create({
    monitorId: monitor.id,
    status: newStatus,
    responseTime,
    checkedAt: new Date(),
    success,
  });

  return { oldStatus, newStatus };
}

/**
 * Main scheduling function:
 * - Runs every minute (* * * * *) by default.
 * - Fetches monitors that are due for a check.
 * - Executes checks in parallel with concurrency control.
 * - Triggers notifications when status changes.
 */
function scheduleMonitoring(notifyCallback) {
  cron.schedule('* * * * *', async () => {
    const now = Math.floor(Date.now() / 1000);

    // We fetch all monitors. Then we check if each one is due for a poll.
    const monitors = await Monitor.findAll();
    if (!monitors || monitors.length === 0) return;

    const checks = [];
    for (const m of monitors) {
      const lastCheckedTime = m.lastCheckedAt
        ? Math.floor(m.lastCheckedAt.getTime() / 1000)
        : 0;
      const delta = now - lastCheckedTime;

      if (delta >= m.interval) {
        checks.push(
          limit(async () => {
            const { oldStatus, newStatus } = await checkMonitor(m);
            if (oldStatus !== newStatus && notifyCallback) {
              await notifyCallback(m);
            }
          })
        );
      }
    }

    // Run checks in parallel (with concurrency limit)
    await Promise.all(checks);
  });
}

module.exports = { scheduleMonitoring };
