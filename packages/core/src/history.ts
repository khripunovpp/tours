/**
 * Location-change detection that also covers SPAs. Browsers fire `popstate`
 * only for back/forward, not for `pushState`/`replaceState`, so we patch those
 * once to emit an event. Together with `hashchange` this lets the player
 * continue a multi-page tour when navigation happens without a full reload.
 */
const CHANGE_EVENT = 'tours:locationchange';
let patched = false;

function patchHistory(): void {
  if (patched) return;
  patched = true;
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method];
    history[method] = function patchedMethod(this: History, ...args: unknown[]) {
      const result = original.apply(this, args as Parameters<History['pushState']>);
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return result;
    } as History[typeof method];
  }
}

/** Call `cb` whenever the URL changes (SPA or otherwise). Returns an unsubscribe. */
export function onLocationChange(cb: () => void): () => void {
  patchHistory();
  window.addEventListener('popstate', cb);
  window.addEventListener('hashchange', cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener('hashchange', cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}
