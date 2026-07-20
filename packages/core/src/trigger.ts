/**
 * Auto-start triggers. `armTrigger` wires a tour's trigger to a `fire` callback
 * that runs once when the condition is met — element appears, a delay elapses,
 * a matching request completes, or on load. `manual` never fires (shortcode /
 * API only). Returns a cancel function.
 */
import type { Tour } from '@tours/schema';
import { waitForElement } from './selector.js';

export function armTrigger(tour: Tour, fire: () => void): () => void {
  const trigger = tour.trigger ?? { type: 'manual' };
  let fired = false;
  const once = (): void => {
    if (fired) return;
    fired = true;
    fire();
  };

  switch (trigger.type) {
    case 'load': {
      const id = setTimeout(once, 0);
      return () => clearTimeout(id);
    }
    case 'timer': {
      const id = setTimeout(once, Math.max(0, trigger.delay));
      return () => clearTimeout(id);
    }
    case 'selector': {
      let cancelled = false;
      void waitForElement([trigger.selector], { timeout: 0 }).then((el) => {
        if (el && !cancelled) once();
      });
      return () => {
        cancelled = true;
      };
    }
    case 'request':
      return onRequestComplete(trigger.url, once);
    case 'manual':
    default:
      return () => {};
  }
}

/**
 * Fire `cb` when a fetch/XHR whose URL contains `urlPart` completes (any
 * request if `urlPart` is empty). Patches fetch/XHR; the returned function
 * restores them.
 */
export function onRequestComplete(urlPart: string | undefined, cb: () => void): () => void {
  const matches = (url: string): boolean => !urlPart || url.includes(urlPart);
  let active = true;

  const originalFetch = window.fetch;
  window.fetch = function patchedFetch(this: unknown, ...args: Parameters<typeof fetch>) {
    const promise = originalFetch.apply(this as typeof globalThis, args);
    const input = args[0];
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url ?? '';
    promise.then(
      () => {
        if (active && matches(url)) cb();
      },
      () => {},
    );
    return promise;
  } as typeof window.fetch;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const URL_KEY = '__toursUrl';
  XMLHttpRequest.prototype.open = function patchedOpen(this: XMLHttpRequest, method: string, url: string | URL) {
    (this as unknown as Record<string, string>)[URL_KEY] = String(url);
    // eslint-disable-next-line prefer-rest-params
    return originalOpen.apply(this, arguments as unknown as Parameters<XMLHttpRequest['open']>);
  } as XMLHttpRequest['open'];
  XMLHttpRequest.prototype.send = function patchedSend(this: XMLHttpRequest, ...args: Parameters<XMLHttpRequest['send']>) {
    this.addEventListener('loadend', () => {
      const url = (this as unknown as Record<string, string>)[URL_KEY] ?? '';
      if (active && matches(url)) cb();
    });
    return originalSend.apply(this, args);
  } as XMLHttpRequest['send'];

  return () => {
    active = false;
    window.fetch = originalFetch;
    XMLHttpRequest.prototype.open = originalOpen;
    XMLHttpRequest.prototype.send = originalSend;
  };
}
