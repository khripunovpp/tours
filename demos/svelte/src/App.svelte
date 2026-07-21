<script lang="ts">
  import Router, { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { resumeTour } from '@tours/core';
  import { playerState, wireDemoPanel, makeSpaTour } from '@tours/demo-shared';
  import Home from './components/Home.svelte';
  import Profile from './components/Profile.svelte';

  const routes = { '/': Home, '/profile': Profile };

  onMount(() => {
    wireDemoPanel();
    resumeTour(makeSpaTour('demo-spa-svelte', 'Svelte'), { state: playerState });
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
