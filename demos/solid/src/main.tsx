/** SPA demo on Solid — @solidjs/router (HashRouter). Isolated package. */
import '@tours/demo-shared/demo.css';
import { render } from 'solid-js/web';
import { onMount } from 'solid-js';
import { HashRouter, Route, A, type RouteSectionProps } from '@solidjs/router';
import { createPlayer, resumeTour } from '@tours/core';
import { playerState, wireDemoPanel, makeSpaTour } from '@tours/demo-shared';

const tour = makeSpaTour('demo-spa-solid', 'Solid');
const start = (): void => {
  createPlayer(tour, { state: playerState }).start();
};

function Layout(props: RouteSectionProps) {
  onMount(() => {
    wireDemoPanel();
    resumeTour(tour, { state: playerState });
  });
  return (
    <>
      <header class="site-header">
        <A class="logo" href="/">Community</A>
        <nav class="site-nav">
          <A href="/" end activeClass="active">Home</A>
          <A href="/profile" activeClass="active">Profile</A>
        </nav>
      </header>
      <main>{props.children}</main>
    </>
  );
}

function Home() {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>A Solid SPA (@solidjs/router). The nav switches views without reloading.</p>
      <div class="card">
        <h2>Getting started</h2>
        <p><button id="spa-home-cta" class="btn-primary" onClick={start}>Start SPA tour</button></p>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section>
      <h1>Profile</h1>
      <div class="card">
        <div class="form-field">
          <label for="spa-profile-field">Display name</label>
          <input id="spa-profile-field" type="text" placeholder="Your name" />
        </div>
        <button class="btn-primary" type="button">Save</button>
      </div>
    </section>
  );
}

render(
  () => (
    <HashRouter root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
    </HashRouter>
  ),
  document.getElementById('root')!,
);
