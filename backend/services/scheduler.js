/**
 * Schedules periodic checks for all monitors.
 * Uses node-cron for scheduling and p-limit to control concurrency.
 * Stores historical logs and triggers notifications when status changes.
 */

const cron = require('node-cron');
const pLimit = require('p-limit');
const axios = require('axios');
const Monitor = require('../models/Monitor');
const MonitorLog = require('../models/MonitorLog');
const { Op } = require('sequelize');

// Concurrency limit (configurable via ENV)
const CONCURRENCY_LIMIT = process.env.CONCURRENCY_LIMIT || 10;
const limit = pLimit(CONCURRENCY_LIMIT);

/**
 * Checks a single monitor, updates its status, and records a log entry.
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
    timeout: 10000, // 10 seconds
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
  } catch (err) {
    // request failed or timed out
    newStatus = 'DOWN';
  }

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

  return { oldStatus: monitor.status, newStatus };
}

/**
 * Main scheduling function:
 *  - Runs every minute by default (* * * * *).
 *  - Fetches all monitors due for a check.
 *  - Parallelizes checks with concurrency limit.
 */
function scheduleMonitoring(notifyCallback) {
  // Running the job every minute
  cron.schedule('* * * * *', async () => {
    const now = Math.floor(Date.now() / 1000);

    // Get monitors that are due for checks based on interval
    const monitors = await Monitor.findAll({
      where: {
        [Op.or]: [
          { lastCheckedAt: null },
          {
            lastCheckedAt: {
              [Op.lte]: new Date(Date.now() - 1000), // ensure at least 1s offset
            },
          },
        ],
      },
    });

    if (!monitors.length) return;

    // For each monitor, check if it's time to run (interval-based)
    const checks = [];
    for (const m of monitors) {
      const lastCheckedTime = m.lastCheckedAt ? Math.floor(m.lastCheckedAt.getTime() / 1000) : 0;
      const delta = now - lastCheckedTime;
      // If last check time + interval has passed, we do a check
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
    await Promise.all(checks);
  });
}

module.exports = { scheduleMonitoring };
