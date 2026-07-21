<script lang="ts">
  import { playDemoTour } from '@tours/demo-shared';

  const start = () => void playDemoTour('demo-spa-svelte');
</script>

<section>
  <h1>Dashboard</h1>
  <p>A Svelte SPA (svelte-spa-router + components). The nav switches views without reloading.</p>
  <div class="card">
    <h2>Getting started</h2>
    <p><button id="spa-home-cta" class="btn-primary" onclick={start}>Start SPA tour</button></p>
  </div>
</section>
