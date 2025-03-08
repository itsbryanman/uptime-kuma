import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// In a larger app, you might add Vuex / Pinia here
// For now, we're just using simple composables and router
app.use(router);

app.mount('#app');
