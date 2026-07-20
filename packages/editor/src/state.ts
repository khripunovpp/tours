/**
 * Builder draft model and its mapping to the shipped @tours/schema. The draft
 * is richer than a Tour: it keeps steps that are toggled off (not shipped yet)
 * and per-card authoring state. `toTour` compiles a draft into a validated
 * tour; only included steps make it into the output.
 */
import type { Tour, Step } from '@tours/schema';
import { SCHEMA_VERSION, DEFAULT_PADDING, validate } from '@tours/schema';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

/** The kind of card, shown as a badge on the card's control row. */
export type CardType = 'step' | 'action';

export interface DraftStep {
  id: string;
  type: CardType;
  /**
   * Included in the shipped tour. When false the step is kept in the draft but
   * excluded from `toTour`.
   * TODO: revisit — visitors probably should not receive excluded steps at all,
   * so this may need to be stripped server-side before it reaches the client.
   */
  included: boolean;
  /** Candidate CSS selectors for the target element (first that resolves wins). */
  selectors: string[];
  /** Plain-text step content. Rich formatting (WYSIWYG) is deferred. */
  content: string;
  placement: Placement;
  /** Editable footer button labels. */
  backLabel: string;
  nextLabel: string;
}

export type TourStatus = 'draft' | 'published';

export interface DraftDisplay {
  /** Gap in px between the target element and the outline (player + editor). */
  padding: number;
}

export interface DraftTour {
  id: string;
  name: string;
  status: TourStatus;
  steps: DraftStep[];
  display: DraftDisplay;
}

let idCounter = 0;

/** A collision-resistant id, preferring crypto.randomUUID when available. */
function uid(prefix: string): string {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${idCounter++}`;
  return `${prefix}-${rnd}`;
}

/** A fresh, empty step (included by default, per the spec). */
export function createDraftStep(type: CardType = 'step'): DraftStep {
  return {
    id: uid('step'),
    type,
    included: true,
    selectors: [],
    content: '',
    placement: 'bottom',
    backLabel: 'Back',
    nextLabel: 'Next',
  };
}

/** A fresh, empty tour with one starter step. */
export function createDraftTour(): DraftTour {
  return {
    id: uid('tour'),
    name: 'Untitled tour',
    status: 'draft',
    steps: [createDraftStep()],
    display: { padding: DEFAULT_PADDING },
  };
}

/**
 * Compile a draft into a validated Tour. Only included steps with at least one
 * selector are shipped. Returns validation errors instead of throwing so the
 * builder can surface them.
 */
export function toTour(
  draft: DraftTour,
): { ok: true; tour: Tour } | { ok: false; errors: string[] } {
  const steps: Step[] = draft.steps
    .filter((s) => s.included && s.selectors.length > 0)
    .map((s) => ({
      id: s.id,
      selectors: s.selectors,
      content: { default: s.content },
      placement: s.placement,
    }));

  const candidate: Tour = {
    id: draft.id,
    schemaVersion: SCHEMA_VERSION,
    title: { default: draft.name },
    steps,
    display: { padding: draft.display.padding },
  };

  return validate(candidate);
}
