import { createRouter, createWebHistory } from 'vue-router';

// Pages
import Dashboard from '../pages/Dashboard.vue';
import EditMonitor from '../pages/EditMonitor.vue';
import Logs from '../pages/Logs.vue';
import NotFound from '../pages/NotFound.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Dashboard },
    { path: '/create', name: 'createMonitor', component: EditMonitor },
    { path: '/edit/:id', name: 'editMonitor', component: EditMonitor, props: true },
    { path: '/logs/:id', name: 'logs', component: Logs, props: true },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
  ],
});
