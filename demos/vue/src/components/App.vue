<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { resumeTour } from '@tours/core';
import { playerState, wireDemoPanel, makeSpaTour } from '@tours/demo-shared';

onMounted(() => {
  wireDemoPanel();
  resumeTour(makeSpaTour('demo-spa-vue', 'Vue'), { state: playerState });
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
