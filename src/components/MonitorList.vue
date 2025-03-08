<template>
  <div>
    <h2>Monitors</h2>
    <table v-if="monitors.length" class="monitor-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>URL</th>
          <th>Status</th>
          <th>Interval</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in monitors" :key="m.id">
          <td>{{ m.name }}</td>
          <td>{{ m.url }}</td>
          <td>{{ m.status }}</td>
          <td>{{ m.interval }}s</td>
          <td>
            <router-link :to=\"`/edit/${m.id}`\">Edit</router-link> |
            <a href=\"#\" @click.prevent=\"removeMonitor(m.id)\">Delete</a> |
            <router-link :to=\"`/logs/${m.id}`\">Logs</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No monitors found.</p>
  </div>
</template>

<script>
export default {
  name: 'MonitorList',
  props: {
    monitors: {
      type: Array,
      required: true,
    },
  },
  methods: {
    removeMonitor(id) {
      this.$emit('delete-monitor', id);
    },
  },
};
</script>

<style scoped>
.monitor-table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}
.monitor-table th,
.monitor-table td {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}
.monitor-table th {
  background: #f7f7f7;
}
</style>
