import axios from 'axios';

/**
 * All the calls go to /api/monitors, proxied in dev to port 4000.
 * In production, ensure your app is served from the same domain or
 * adjust the baseURL to your deployed backend.
 */

const API = '/api/monitors';

export async function getAllMonitors() {
  const response = await axios.get(API);
  return response.data;
}

export async function getMonitorById(id) {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
}

export async function createMonitor(monitorData) {
  const response = await axios.post(API, monitorData);
  return response.data;
}

export async function updateMonitor(id, monitorData) {
  const response = await axios.put(`${API}/${id}`, monitorData);
  return response.data;
}

export async function deleteMonitor(id) {
  await axios.delete(`${API}/${id}`);
}

export async function getMonitorLogs(id) {
  const response = await axios.get(`${API}/${id}/logs`);
  return response.data; // array of logs
}
