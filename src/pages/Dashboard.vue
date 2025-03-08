<template>
  <div>
    <h1>Dashboard</h1>
    <MonitorList :monitors=\"monitors\" @delete-monitor=\"deleteMonitor\" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MonitorList from '../components/MonitorList.vue';
import { getAllMonitors, deleteMonitor } from '../api/monitors';

export default {
  name: 'Dashboard',
  components: {
    MonitorList,
  },
  setup() {
    const monitors = ref([]);

    async function loadMonitors() {
      monitors.value = await getAllMonitors();
    }

    async function removeMonitor(id) {
      if (confirm('Are you sure you want to delete this monitor?')) {
        await deleteMonitor(id);
        await loadMonitors();
      }
    }

    onMounted(loadMonitors);

    return {
      monitors,
      deleteMonitor: removeMonitor,
    };
  },
};
</script>
