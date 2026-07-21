/**
 * Entry for spa.html — a single-page app with hash routing, no framework. Seeds
 * an editable SPA tour; Start plays the stored (editable) tour, which crosses
 * the two views without a reload. Open the builder with ?tours-edit=1 to tweak.
 */
import { wireDemoPanel, spaDraft, seedDemoTour, playDemoTour, resumeDemoTour } from '@tours/demo-shared';

const ID = 'demo-spa-vanilla';
wireDemoPanel();
void seedDemoTour(spaDraft(ID, 'Vanilla'));

const home = document.getElementById('view-home');
const profile = document.getElementById('view-profile');

function route(): void {
  const onProfile = (window.location.hash || '#/').startsWith('#/profile');
  if (home) home.hidden = onProfile;
  if (profile) profile.hidden = !onProfile;
  document.getElementById('spa-nav-home')?.classList.toggle('active', !onProfile);
  document.getElementById('spa-nav-profile')?.classList.toggle('active', onProfile);
}

if (!window.location.hash) window.location.hash = '#/';
window.addEventListener('hashchange', route);
route();

document.querySelector('#spa-home-cta')?.addEventListener('click', () => void playDemoTour(ID));
// Continue if the page was reloaded mid-tour.
void resumeDemoTour(ID);
