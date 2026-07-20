/**
 * SPA demo on React + react-router (HashRouter). Proves the tour continues
 * across a real framework's client-side routing with no page reload — core
 * hooks the same history/hashchange events the router uses.
 */
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { createPlayer, resumeTour } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, wireDemoPanel } from './common.js';

const spaTour: Tour = {
  id: 'demo-spa-react',
  schemaVersion: 1,
  title: { default: 'SPA tour (React)' },
  steps: [
    {
      id: 'spa-1',
      pageUrl: { regex: '#/$' },
      selectors: ['#spa-home-cta'],
      content: { default: 'Welcome! Click Next — the tour jumps to your profile with no page reload.' },
      placement: 'bottom',
      action: { type: 'navigate', url: '#/profile' },
    },
    {
      id: 'spa-2',
      pageUrl: { regex: '#/profile' },
      selectors: ['#spa-profile-field'],
      content: { default: 'The tour continued here — React Router changed the view, the tour followed.' },
      placement: 'right',
    },
  ],
};

function Home(): JSX.Element {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>A React SPA (react-router). The nav switches views without reloading.</p>
      <div className="card">
        <h2>Getting started</h2>
        <p>
          <button id="spa-home-cta" className="btn-primary" onClick={() => createPlayer(spaTour, { state: playerState }).start()}>
            Start SPA tour
          </button>
        </p>
      </div>
    </section>
  );
}

function Profile(): JSX.Element {
  return (
    <section>
      <h1>Profile</h1>
      <div className="card">
        <div className="form-field">
          <label htmlFor="spa-profile-field">Display name</label>
          <input id="spa-profile-field" type="text" placeholder="Your name" />
        </div>
        <button className="btn-primary" type="button">Save</button>
      </div>
    </section>
  );
}

function App(): JSX.Element {
  useEffect(() => {
    wireDemoPanel();
    // Continue if the page was reloaded mid-tour.
    resumeTour(spaTour, { state: playerState });
  }, []);
  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">Community</Link>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <a href="spa.html">Vanilla</a>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
