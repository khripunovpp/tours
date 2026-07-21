/** SPA demo on React + react-router (HashRouter). Isolated package. */
import '@tours/demo-shared/demo.css';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { wireDemoPanel, spaDraft, seedDemoTour, playDemoTour, resumeDemoTour } from '@tours/demo-shared';

const ID = 'demo-spa-react';
// Seed an editable starter tour — open the builder (?tours-edit=1) to tweak it.
void seedDemoTour(spaDraft(ID, 'React'));

function Home(): JSX.Element {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>A React SPA (react-router). The nav switches views without reloading.</p>
      <div className="card">
        <h2>Getting started</h2>
        <p>
          <button id="spa-home-cta" className="btn-primary" onClick={() => void playDemoTour(ID)}>
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
    void resumeDemoTour(ID);
  }, []);
  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">Community</Link>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/profile">Profile</NavLink>
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
