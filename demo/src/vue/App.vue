<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { resumeTour } from '@tours/core';
import { playerState, wireDemoPanel, makeSpaTour } from '../common';

onMounted(() => {
  wireDemoPanel();
  // Continue if the page was reloaded mid-tour.
  resumeTour(makeSpaTour('demo-spa-vue', 'Vue'), { state: playerState });
});
</script>

<template>
  <header class="site-header">
    <RouterLink class="logo" to="/">Community</RouterLink>
    <nav class="site-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
      <a href="spa.html">Vanilla</a>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>
