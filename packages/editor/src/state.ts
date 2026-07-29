/**
 * Builder draft model and its mapping to the shipped @tours/schema. The draft
 * is richer than a Tour: it keeps steps that are toggled off (not shipped yet)
 * and per-card authoring state. `toTour` compiles a draft into a validated
 * tour; only included steps make it into the output.
 */
import type { Tour, Step, Trigger, Condition, Action } from '@tours/schema';
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
  /** Page this step belongs to, as a URL glob. Empty = any page. */
  page: string;
  placement: Placement;
  /** Alignment of the card along the placement side. */
  align: Align;
  /** Editable footer button labels. */
  backLabel: string;
  nextLabel: string;
  /** Optional interaction to advance (e.g. navigate to another page). */
  action?: Action;
  /** Dim the rest of the page for this step. Default true. */
  overlay: boolean;
  /**
   * Per-step gate. Held as the schema shape rather than a flattened copy, so
   * fields the form does not render survive a round-trip untouched instead of
   * being silently dropped on save.
   */
  condition?: Condition;
}

export type TourStatus = 'draft' | 'published';

/** A draft is either a real tour or a reusable template. */
export type TourKind = 'tour' | 'template';

/** Who may see the tour. */
export type Audience = 'all' | 'auth' | 'guest';

/** Auto-start conditions (map to schema Rule/Condition). */
export interface DraftConditions {
  firstVisitOnly: boolean;
  /** 0 = no limit. */
  maxShows: number;
  device: 'any' | 'mobile' | 'tablet' | 'desktop';
  /** Host-supplied facts the visitor must match — role, plan, group, anything. */
  traits: Record<string, string>;
}

export type { Trigger };

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
  /** How the tour auto-starts. */
  trigger: Trigger;
  /** Who may see the tour. */
  audience: Audience;
  /** Auto-start conditions. */
  conditions: DraftConditions;
  /**
   * What the card's × does: end the tour, or set it aside with an invitation to
   * carry on. Stored flat because the builder edits it as three plain fields.
   */
  dismissMode: 'end' | 'minimize';
  resumeText: string;
  resumeButton: string;
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
    page: '',
    placement: 'auto',
    align: 'center',
    backLabel: 'Back',
    nextLabel: 'Next',
    overlay: true,
  };
}

/** A fresh, empty tour (or template) with one starter step. */
export function createDraftTour(kind: TourKind = 'tour'): DraftTour {
  return {
    id: uid(kind),
    kind,
    name: kind === 'template' ? 'Untitled template' : 'Untitled tour',
    status: 'draft',
    trigger: { type: 'manual' },
    audience: 'all',
    conditions: { firstVisitOnly: true, maxShows: 0, device: 'any', traits: {} },
    dismissMode: 'end',
    resumeText: '',
    resumeButton: '',
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
    trigger: { ...src.trigger },
    audience: src.audience,
    conditions: { ...src.conditions, traits: { ...src.conditions.traits } },
    dismissMode: src.dismissMode ?? 'end',
    resumeText: src.resumeText ?? '',
    resumeButton: src.resumeButton ?? '',
    steps: src.steps.map((s) => ({ ...s, id: uid('step'), selectors: [...s.selectors] })),
    display: { ...src.display },
  };
}

/** Coerce an unknown value into a valid Trigger (defaults to manual). */
function normalizeTrigger(value: unknown): Trigger {
  if (value && typeof value === 'object') {
    const t = value as {
      type?: unknown;
      selector?: unknown;
      delay?: unknown;
      text?: unknown;
      button?: unknown;
      corner?: unknown;
      offset?: unknown;
    };
    if (t.type === 'load') return { type: 'load' };
    if (t.type === 'selector' && typeof t.selector === 'string') return { type: 'selector', selector: t.selector };
    if (t.type === 'timer' && typeof t.delay === 'number') return { type: 'timer', delay: t.delay };
    if (t.type === 'cta' && typeof t.text === 'string' && typeof t.button === 'string') {
      const corners = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
      return {
        type: 'cta',
        text: t.text,
        button: t.button,
        corner: corners.includes(t.corner as string) ? (t.corner as 'bottom-right') : 'bottom-right',
        offset: typeof t.offset === 'number' ? t.offset : undefined,
      };
    }
  }
  return { type: 'manual' };
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
      trigger: normalizeTrigger(t.trigger),
      audience: t.audience === 'auth' || t.audience === 'guest' ? t.audience : 'all',
      dismissMode: t.dismissMode === 'minimize' ? 'minimize' : 'end',
      resumeText: typeof t.resumeText === 'string' ? t.resumeText : '',
      resumeButton: typeof t.resumeButton === 'string' ? t.resumeButton : '',
      conditions: {
        firstVisitOnly: (t.conditions?.firstVisitOnly ?? true) === true,
        maxShows: numOr(t.conditions?.maxShows, 0),
        device: ['mobile', 'tablet', 'desktop'].includes(t.conditions?.device as string)
          ? (t.conditions!.device as DraftConditions['device'])
          : 'any',
        traits: stringMap(t.conditions?.traits),
      },
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
 * Build the shipped Tour object from a draft, WITHOUT validating. Only included
 * steps with at least one selector are shipped. Used both by `toTour` (which
 * then validates) and by JSON export (which must never be blocked by a
 * work-in-progress draft).
 */
export function compileTour(draft: DraftTour): Tour {
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
      ...(s.page ? { pageUrl: { glob: s.page } } : {}),
      ...(s.action ? { action: s.action } : {}),
      // Only emitted when it differs from the default, to keep stored tours lean.
      ...(s.overlay === false ? { overlay: false } : {}),
      ...(s.condition && Object.keys(s.condition).length > 0 ? { condition: s.condition } : {}),
    }));

  // Auto-start conditions → a single rule (omit when all are defaults).
  const when: Condition = {};
  if (draft.conditions.firstVisitOnly) when.firstVisitOnly = true;
  if (draft.conditions.maxShows > 0) when.maxShows = draft.conditions.maxShows;
  if (draft.conditions.device !== 'any') when.device = draft.conditions.device;
  if (Object.keys(draft.conditions.traits).length > 0) when.traits = { ...draft.conditions.traits };
  const rules = Object.keys(when).length > 0 ? [{ when }] : undefined;

  return {
    id: draft.id,
    schemaVersion: SCHEMA_VERSION,
    title: { default: draft.name },
    steps,
    trigger: draft.trigger,
    audience: draft.audience,
    ...(rules ? { rules } : {}),
    // Only emitted when it differs from the default, so stored tours stay lean.
    ...(draft.dismissMode === 'minimize'
      ? {
          dismiss: {
            mode: 'minimize' as const,
            ...(draft.resumeText || draft.resumeButton
              ? {
                  resume: {
                    text: draft.resumeText || 'Carry on with the tour?',
                    button: draft.resumeButton || 'Resume',
                  },
                }
              : {}),
          },
        }
      : {}),
    display: {
      padding: draft.display.padding,
      radius: draft.display.radius,
      cardRadius: draft.display.cardRadius,
      offset: draft.display.offset,
      alignOffset: draft.display.alignOffset,
    },
  };
}

/**
 * Compile a draft into a validated Tour. Returns validation errors instead of
 * throwing so the builder can surface them.
 */
export function toTour(
  draft: DraftTour,
): { ok: true; tour: Tour } | { ok: false; errors: string[] } {
  return validate(compileTour(draft));
}

/**
 * Coerce untrusted JSON into a flat string map. Numbers are kept as text: the
 * builder edits traits in text inputs, and a value's type should not depend on
 * whether it happened to look numeric.
 */
function stringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === 'string' || typeof v === 'number') out[k] = String(v);
  }
  return out;
}

/** True if a value looks like a shipped schema Tour (vs. a builder draft). */
function looksLikeSchemaTour(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return 'schemaVersion' in o || (typeof o.title === 'object' && o.title !== null);
}

/** Reverse of `compileTour`: hydrate a shipped Tour into an editable draft. */
export function fromTour(tour: Tour): DraftTour {
  const rule = (tour.rules && tour.rules[0]?.when) || {};
  const device = rule.device;
  return {
    id: typeof tour.id === 'string' && tour.id ? tour.id : uid('tour'),
    kind: 'tour',
    name: tour.title?.default ?? 'Imported tour',
    status: 'draft',
    trigger: normalizeTrigger(tour.trigger),
    audience: tour.audience === 'auth' || tour.audience === 'guest' ? tour.audience : 'all',
    // Round-trips the dismiss policy, so importing then re-exporting a tour
    // does not quietly drop it.
    dismissMode: tour.dismiss?.mode === 'minimize' ? 'minimize' : 'end',
    resumeText: tour.dismiss?.resume?.text ?? '',
    resumeButton: tour.dismiss?.resume?.button ?? '',
    conditions: {
      firstVisitOnly: rule.firstVisitOnly === true,
      maxShows: numOr(rule.maxShows, 0),
      device: device === 'mobile' || device === 'tablet' || device === 'desktop' ? device : 'any',
      traits: stringMap(rule.traits),
    },
    display: {
      padding: numOr(tour.display?.padding, DEFAULT_PADDING),
      radius: numOr(tour.display?.radius, DEFAULT_RADIUS),
      cardRadius: numOr(tour.display?.cardRadius, DEFAULT_CARD_RADIUS),
      offset: numOr(tour.display?.offset, DEFAULT_OFFSET),
      alignOffset: numOr(tour.display?.alignOffset, 0),
    },
    steps: (Array.isArray(tour.steps) ? tour.steps : []).map((s) => ({
      ...createDraftStep('step'),
      id: typeof s.id === 'string' && s.id ? s.id : uid('step'),
      selectors: Array.isArray(s.selectors) ? s.selectors.filter((x): x is string => typeof x === 'string') : [],
      content: typeof s.content?.default === 'string' ? s.content.default : '',
      page: s.pageUrl?.glob ?? '',
      placement: s.placement ?? 'auto',
      align: s.align ?? 'center',
      overlay: s.overlay !== false,
      ...(s.condition ? { condition: s.condition } : {}),
      backLabel: s.backLabel ?? 'Back',
      nextLabel: s.nextLabel ?? 'Next',
      ...(s.action ? { action: s.action } : {}),
      // Only emitted when it differs from the default, to keep stored tours lean.
      ...(s.overlay === false ? { overlay: false } : {}),
      ...(s.condition && Object.keys(s.condition).length > 0 ? { condition: s.condition } : {}),
    })),
  };
}

/**
 * Parse imported JSON (a single object or an array) into drafts. Accepts both
 * shipped schema Tours (converted via `fromTour`) and builder drafts (via
 * `normalizeTours`), so a file exported here or a hand-written tour both load.
 */
export function importDrafts(input: unknown): DraftTour[] {
  const arr = Array.isArray(input) ? input : [input];
  const out: DraftTour[] = [];
  for (const raw of arr) {
    if (looksLikeSchemaTour(raw)) {
      out.push(fromTour(raw as Tour));
    } else {
      const [draft] = normalizeTours([raw]);
      if (draft) out.push(draft);
    }
  }
  return out;
}
