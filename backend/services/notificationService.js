/**
 * Sends notifications to configured channels when a monitor's status changes.
 * Implements retry logic with exponential backoff.
 */

const axios = require('axios');
const config = require('../../config/notification.json');

// Retry config (exponential backoff)
const MAX_RETRIES = config.retryPolicy?.maxRetries || 3;
const BASE_DELAY_MS = config.retryPolicy?.baseDelayMs || 1000;

async function sendDiscordNotification(webhookUrl, message, attempt = 1) {
  try {
    await axios.post(webhookUrl, { content: message });
  } catch (err) {
    if (attempt <= MAX_RETRIES) {
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
      return sendDiscordNotification(webhookUrl, message, attempt + 1);
    }
    throw err;
  }
}

async function sendSlackNotification(webhookUrl, message, attempt = 1) {
  try {
    await axios.post(webhookUrl, { text: message });
  } catch (err) {
    if (attempt <= MAX_RETRIES) {
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
      return sendSlackNotification(webhookUrl, message, attempt + 1);
    }
    throw err;
  }
}

/**
 * Main notification method called by scheduler.
 * Summarizes the new monitor state and triggers relevant notifications.
 */
exports.triggerNotifications = async (monitor) => {
  const message = `[Uptime Kuma] Monitor '${monitor.name}' is now '${monitor.status}'. URL: ${monitor.url}`;

  // Discord
  if (config.discordWebhookUrl) {
    try {
      await sendDiscordNotification(config.discordWebhookUrl, message);
    } catch (err) {
      console.error('Discord notification failed:', err);
    }
  }

  // Slack
  if (config.slackWebhookUrl) {
    try {
      await sendSlackNotification(config.slackWebhookUrl, message);
    } catch (err) {
      console.error('Slack notification failed:', err);
    }
  }

  // Telegram
  if (config.telegramBotToken && config.telegramChatId) {
    const telegramUrl = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    const params = {
      chat_id: config.telegramChatId,
      text: message,
    };
    let attempt = 1;
    while (true) {
      try {
        await axios.post(telegramUrl, params);
        break;
      } catch (err) {
        if (attempt > MAX_RETRIES) {
          console.error('Telegram notification failed:', err);
          break;
        }
        const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
        await new Promise((res) => setTimeout(res, delay));
        attempt++;
      }
    }
  }

  // Add more channels as needed, following the same pattern (Email, SMS, etc.)
};
