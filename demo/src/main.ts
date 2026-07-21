/**
 * Entry for the mock "Community" site pages (index.html + profile.html). Shows
 * a multi-page sample tour that spans the home and profile pages, runnable from
 * the panel and resumed automatically after navigation.
 */
import { createPlayer, resumeTour, armTrigger, matchRules, detectDevice, seenCount, markSeen } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, builtTours, wireDemoPanel } from './common.js';

wireDemoPanel();

const HOME = { regex: '/(index\\.html)?($|\\?|#)' };
const PROFILE = { regex: '/profile\\.html' };

/** Sample tour: three steps on home, navigates to profile, continues there. */
const tour: Tour = {
  id: 'community-onboarding',
  schemaVersion: 1,
  title: { default: 'Community onboarding' },
  steps: [
    { id: 'step-new-post', pageUrl: HOME, selectors: ['#btn-new-post'], content: { default: 'Click here to write your first post and share an idea.' }, placement: 'bottom' },
    { id: 'step-signup', pageUrl: HOME, selectors: ['#field-name'], content: { default: 'Fill in the short sign-up form to become a member.' }, placement: 'right' },
    { id: 'step-goto-profile', pageUrl: HOME, selectors: ['#nav-profile'], content: { default: 'Now let’s set up your profile — click Next to continue.' }, placement: 'bottom', action: { type: 'navigate', url: 'profile.html' } },
    { id: 'step-name', pageUrl: PROFILE, selectors: ['#profile-name'], content: { default: 'Enter a display name so people recognise you.' }, placement: 'right' },
    { id: 'step-avatar', pageUrl: PROFILE, selectors: ['#btn-upload'], content: { default: 'Finally, upload a photo. All set — welcome!' }, placement: 'bottom' },
  ],
};

// On load: resume a mid-flight tour (sample first, then built); otherwise arm
// any built-tour auto-start triggers.
void builtTours().then((built) => {
  const resumed = [tour, ...built].some((t) => resumeTour(t, { state: playerState }));
  if (resumed) return;
  const device = detectDevice();
  for (const t of built) {
    if (!t.trigger || t.trigger.type === 'manual') continue;
    const count = seenCount(playerState, t.id);
    const ctx = { url: window.location.href, device, firstVisit: count === 0, seenCount: count };
    if (!matchRules(t.rules, ctx)) continue;
    armTrigger(t, () => {
      markSeen(playerState, t.id);
      createPlayer(t, { state: playerState }).start();
    });
  }
});

// Run a tour: prefer the first tour built in the editor, else the sample.
document.querySelector<HTMLButtonElement>('#run-tour')?.addEventListener('click', async () => {
  const [built] = await builtTours();
  createPlayer(built ?? tour, { state: playerState }).start();
});
