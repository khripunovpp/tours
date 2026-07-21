<script setup lang="ts">
import { createPlayer } from '@tours/core';
import { playerState, makeSpaTour } from '@tours/demo-shared';

const tour = makeSpaTour('demo-spa-vue', 'Vue');
const start = (): void => {
  createPlayer(tour, { state: playerState }).start();
};
</script>

<template>
  <section>
    <h1>Dashboard</h1>
    <p>A Vue SPA (vue-router + single-file components). The nav switches views without reloading.</p>
    <div class="card">
      <h2>Getting started</h2>
      <p><button id="spa-home-cta" class="btn-primary" @click="start">Start SPA tour</button></p>
    </div>
  </section>
</template>
