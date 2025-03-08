<template>
  <form @submit.prevent=\"handleSubmit\">
    <div class=\"form-group\">
      <label for=\"name\">Name</label>
      <input
        type=\"text\"
        id=\"name\"
        v-model=\"formData.name\"
        required
      />
    </div>

    <div class=\"form-group\">
      <label for=\"url\">URL</label>
      <input
        type=\"url\"
        id=\"url\"
        v-model=\"formData.url\"
        required
      />
    </div>

    <div class=\"form-group\">
      <label for=\"interval\">Interval (s)</label>
      <input
        type=\"number\"
        id=\"interval\"
        v-model.number=\"formData.interval\"
        min=\"5\"
        max=\"3600\"
        required
      />
    </div>

    <div class=\"form-group\">
      <label for=\"method\">Method</label>
      <select id=\"method\" v-model=\"formData.method\">
        <option value=\"GET\">GET</option>
        <option value=\"POST\">POST</option>
        <option value=\"HEAD\">HEAD</option>
        <option value=\"PUT\">PUT</option>
        <option value=\"DELETE\">DELETE</option>
      </select>
    </div>

    <div class=\"form-group\">
      <label for=\"expectedStatusCode\">Expected Status Code</label>
      <input
        type=\"number\"
        id=\"expectedStatusCode\"
        v-model.number=\"formData.expectedStatusCode\"
        required
      />
    </div>

    <div class=\"form-group\">
      <label for=\"headers\">Headers (JSON)</label>
      <textarea
        id=\"headers\"
        v-model=\"rawHeaders\"
        placeholder='{\"X-Custom-Header\": \"value\"}'
      ></textarea>
    </div>

    <div class=\"form-group\">
      <label for=\"authType\">Auth Type</label>
      <select id=\"authType\" v-model=\"formData.authentication.type\">
        <option value=\"\">None</option>
        <option value=\"basic\">Basic</option>
      </select>
    </div>

    <div
      v-if=\"formData.authentication.type === 'basic'\"
      class=\"form-group-sub\"
    >
      <label>Username</label>
      <input
        type=\"text\"
        v-model=\"formData.authentication.username\"
        placeholder=\"Username\"
      />

      <label>Password</label>
      <input
        type=\"password\"
        v-model=\"formData.authentication.password\"
        placeholder=\"Password\"
      />
    </div>

    <button type=\"submit\">
      {{ isEditing ? 'Update' : 'Create' }} Monitor
    </button>
  </form>
</template>

<script>
export default {
  name: 'MonitorForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
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
      }),
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: { ...this.initialData },
      rawHeaders: JSON.stringify(this.initialData.headers || {}, null, 2),
    };
  },
  watch: {
    rawHeaders(newVal) {
      try {
        this.formData.headers = JSON.parse(newVal);
      } catch (error) {
        // If JSON parsing fails, do nothing or handle it gracefully
      }
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData);
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
.form-group-sub {
  margin-left: 2em;
  display: flex;
  gap: 1em;
}
label {
  margin-bottom: 0.3em;
  font-weight: 600;
}
button {
  margin-top: 1em;
  padding: 0.5em 1em;
  cursor: pointer;
}
</style>
