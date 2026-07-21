/**
 * Auto-start triggers. `armTrigger` wires a tour's trigger to a `fire` callback
 * that runs once when the condition is met — element appears, a delay elapses,
 * or on load. `manual` never fires (shortcode / API only). Returns a cancel
 * function.
 */
import type { Tour } from '@tours/schema';
import { waitForElement } from './selector.js';
import { showCta } from './cta.js';

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
    case 'cta': {
      // Show a corner invitation; its button starts the tour.
      let dismiss = (): void => {};
      dismiss = showCta({
        text: trigger.text,
        button: trigger.button,
        corner: trigger.corner,
        offset: trigger.offset,
        onStart: once,
      });
      return dismiss;
    }
    case 'manual':
    default:
      return () => {};
  }
}
