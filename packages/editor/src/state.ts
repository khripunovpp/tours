/**
 * Builder draft model and its mapping to the shipped @tours/schema. The draft
 * is richer than a Tour: it keeps steps that are toggled off (not shipped yet)
 * and per-card authoring state. `toTour` compiles a draft into a validated
 * tour; only included steps make it into the output.
 */
import type { Tour, Step } from '@tours/schema';
import {
  SCHEMA_VERSION,
  DEFAULT_PADDING,
  DEFAULT_RADIUS,
  DEFAULT_CARD_RADIUS,
  DEFAULT_OFFSET,
  validate,
} from '@tours/schema';

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type Align = 'start' | 'center' | 'end';

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
  /** Alignment of the card along the placement side. */
  align: Align;
  /** Editable footer button labels. */
  backLabel: string;
  nextLabel: string;
}

export type TourStatus = 'draft' | 'published';

/** A draft is either a real tour or a reusable template. */
export type TourKind = 'tour' | 'template';

export interface DraftDisplay {
  /** Gap in px between the target element and the outline (player + editor). */
  padding: number;
  /** Corner radius (px) of the outline. */
  radius: number;
  /** Corner radius (px) of the visitor tooltip card. */
  cardRadius: number;
  /** Distance (px) from the target to the card. */
  offset: number;
  /** Inset (px) along the alignment edge for start/end alignment. */
  alignOffset: number;
}

export interface DraftTour {
  id: string;
  kind: TourKind;
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
    placement: 'auto',
    align: 'center',
    backLabel: 'Back',
    nextLabel: 'Next',
  };
}

/** A fresh, empty tour (or template) with one starter step. */
export function createDraftTour(kind: TourKind = 'tour'): DraftTour {
  return {
    id: uid(kind),
    kind,
    name: kind === 'template' ? 'Untitled template' : 'Untitled tour',
    status: 'draft',
    steps: [createDraftStep()],
    display: {
      padding: DEFAULT_PADDING,
      radius: DEFAULT_RADIUS,
      cardRadius: DEFAULT_CARD_RADIUS,
      offset: DEFAULT_OFFSET,
      alignOffset: 0,
    },
  };
}

/**
 * Deep-copy a draft into a new one of the given kind, with fresh ids so it is
 * independent of the source. Used for save-as-template and create-from-template.
 */
export function cloneDraft(src: DraftTour, kind: TourKind, name?: string): DraftTour {
  return {
    id: uid(kind),
    kind,
    name: name ?? src.name,
    status: 'draft',
    steps: src.steps.map((s) => ({ ...s, id: uid('step'), selectors: [...s.selectors] })),
    display: { ...src.display },
  };
}

/**
 * Coerce loaded (possibly older or partial) data into well-formed drafts,
 * filling in fields added since it was stored. Drops anything unrecognizable so
 * a corrupt entry can never crash the builder.
 */
export function normalizeTours(input: unknown): DraftTour[] {
  if (!Array.isArray(input)) return [];
  const out: DraftTour[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const t = raw as Partial<DraftTour>;
    if (typeof t.id !== 'string' || !Array.isArray(t.steps)) continue;
    out.push({
      id: t.id,
      kind: t.kind === 'template' ? 'template' : 'tour',
      name: typeof t.name === 'string' ? t.name : 'Untitled tour',
      status: t.status === 'published' ? 'published' : 'draft',
      display: {
        padding: numOr(t.display?.padding, DEFAULT_PADDING),
        radius: numOr(t.display?.radius, DEFAULT_RADIUS),
        cardRadius: numOr(t.display?.cardRadius, DEFAULT_CARD_RADIUS),
        offset: numOr(t.display?.offset, DEFAULT_OFFSET),
        alignOffset: numOr(t.display?.alignOffset, 0),
      },
      steps: t.steps
        .filter((s): s is DraftStep => !!s && typeof s === 'object')
        .map((s) => ({
          ...createDraftStep(s.type === 'action' ? 'action' : 'step'),
          ...s,
        })),
    });
  }
  return out;
}

function numOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && value >= 0 ? value : fallback;
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
      align: s.align,
      backLabel: s.backLabel,
      nextLabel: s.nextLabel,
    }));

  const candidate: Tour = {
    id: draft.id,
    schemaVersion: SCHEMA_VERSION,
    title: { default: draft.name },
    steps,
    display: {
      padding: draft.display.padding,
      radius: draft.display.radius,
      cardRadius: draft.display.cardRadius,
      offset: draft.display.offset,
      alignOffset: draft.display.alignOffset,
    },
  };

  return validate(candidate);
}
