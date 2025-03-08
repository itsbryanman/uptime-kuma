<template>
  <div>
    <h1>Monitor Logs</h1>
    <div v-if=\"logs.length\">
      <table class=\"logs-table\">
        <thead>
          <tr>
            <th>Checked At</th>
            <th>Status</th>
            <th>Response Time (ms)</th>
            <th>Success</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for=\"log in logs\" :key=\"log.id\">
            <td>{{ formatDate(log.checkedAt) }}</td>
            <td>{{ log.status }}</td>
            <td>{{ log.responseTime !== null ? log.responseTime : 'N/A' }}</td>
            <td>{{ log.success }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No logs found.</p>
    <router-link to=\"/\">Back to Dashboard</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMonitorLogs } from '../api/monitors';

export default {
  name: 'Logs',
  setup() {
    const route = useRoute();
    const logs = ref([]);

    async function loadLogs() {
      const { id } = route.params;
      logs.value = await getMonitorLogs(id);
    }

    function formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }

    onMounted(loadLogs);

    return {
      logs,
      formatDate,
    };
  },
};
</script>

<style scoped>
.logs-table {
  border-collapse: collapse;
  width: 100%;
}
.logs-table th,
.logs-table td {
  border: 1px solid #ccc;
  padding: 0.5em;
}
.logs-table th {
  background-color: #f7f7f7;
}
</style>
