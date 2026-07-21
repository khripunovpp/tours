<script lang="ts">
  import Router, { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { wireDemoPanel, resumeDemoTour } from '@tours/demo-shared';
  import Home from './components/Home.svelte';
  import Profile from './components/Profile.svelte';

  const routes = { '/': Home, '/profile': Profile };

  onMount(() => {
    wireDemoPanel();
    void resumeDemoTour('demo-spa-svelte');
  });
</script>

<header class="site-header">
  <a class="logo" href="/" use:link>Community</a>
  <nav class="site-nav">
    <a href="/" use:link>Home</a>
    <a href="/profile" use:link>Profile</a>
  </nav>
</header>

<main>
  <Router {routes} />
</main>
