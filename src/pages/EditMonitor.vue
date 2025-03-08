<template>
  <div>
    <h1>{{ isEditing ? 'Edit Monitor' : 'Create Monitor' }}</h1>
    <MonitorForm
      :initialData=\"monitorData\"
      :isEditing=\"isEditing\"
      @submit=\"handleFormSubmit\"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MonitorForm from '../components/MonitorForm.vue';
import { getMonitorById, createMonitor, updateMonitor } from '../api/monitors';

export default {
  name: 'EditMonitor',
  components: {
    MonitorForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const monitorId = route.params.id;
    const monitorData = ref({
      name: '',
      url: '',
      interval: 60,
      method: 'GET',
      expectedStatusCode: 200,
      headers: {},
      authentication: {
        type: '',
        username: '',
        password: '',
      },
    });

    const isEditing = computed(() => !!monitorId);

    async function loadMonitor() {
      if (monitorId) {
        const existing = await getMonitorById(monitorId);
        monitorData.value = existing;
        // Ensure empty objects exist if not set
        monitorData.value.headers = monitorData.value.headers || {};
        monitorData.value.authentication =
          monitorData.value.authentication || {
            type: '',
            username: '',
            password: '',
          };
      }
    }

    async function handleFormSubmit(data) {
      if (isEditing.value) {
        await updateMonitor(monitorId, data);
      } else {
        await createMonitor(data);
      }
      router.push('/');
    }

    onMounted(loadMonitor);

    return {
      monitorData,
      isEditing,
      handleFormSubmit,
    };
  },
};
</script>
