<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { wireDemoPanel, resumeDemoTour } from '@tours/demo-shared';

onMounted(() => {
  wireDemoPanel();
  void resumeDemoTour('demo-spa-vue');
});
</script>

<template>
  <header class="site-header">
    <RouterLink class="logo" to="/">Community</RouterLink>
    <nav class="site-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>
