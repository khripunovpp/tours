/** SPA demo on Vue 3 — SFCs + vue-router (hash history), the idiomatic setup. */
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './vue/App.vue';
import Home from './vue/Home.vue';
import Profile from './vue/Profile.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/profile', component: Profile },
  ],
});

createApp(App).use(router).mount('#root');
