/**
 * Entry for the mock "Community" site pages (index.html + profile.html). Seeds
 * an editable multi-page tour (Home → Profile) into the builder store; Run tour
 * plays the stored (editable) tour, which resumes after navigation. Open the
 * builder with ?tours-edit=1 to tweak it.
 */
import { createPlayer, resumeTour, armTrigger, matchRules, detectDevice, seenCount, markSeen } from '@tours/core';
import { playerState, builtTours, wireDemoPanel, communityDraft, seedDemoTour, playDemoTour } from '@tours/demo-shared';

wireDemoPanel();

// Seed the editable starter tour, then resume/arm from the store.
void seedDemoTour(communityDraft())
  .then(builtTours)
  .then((built) => {
    const resumed = built.some((t) => resumeTour(t, { state: playerState }));
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

document.querySelector<HTMLButtonElement>('#run-tour')?.addEventListener('click', () => {
  void playDemoTour('community-onboarding');
});
