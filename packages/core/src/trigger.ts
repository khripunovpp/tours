/**
 * Auto-start triggers. `armTrigger` wires a tour's trigger to a `fire` callback
 * that runs once when the condition is met — element appears, a delay elapses,
 * or on load. `manual` never fires (shortcode / API only). Returns a cancel
 * function.
 */
import type { RuntimeTour } from './player.js';
import { waitForElement } from './selector.js';
import { showCta } from './cta.js';
import { isBuilderMounted } from './player.js';

export function armTrigger(tour: RuntimeTour, fire: () => void): () => void {
  // Nothing should auto-start underneath the builder. `start()` already refuses,
  // but a `cta` trigger paints a corner popover *before* anything starts, so
  // that has to be suppressed here rather than in the player.
  if (isBuilderMounted()) return () => {};

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
