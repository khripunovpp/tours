/** SPA demo on Vue 3 — SFCs + vue-router (hash history). Isolated package. */
import '@tours/demo-shared/demo.css';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './components/App.vue';
import Home from './components/Home.vue';
import Profile from './components/Profile.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/profile', component: Profile },
  ],
});

createApp(App).use(router).mount('#root');
