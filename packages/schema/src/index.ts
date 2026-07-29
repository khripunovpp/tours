/**
 * Tour data model and validation for @tours/schema. This is the single source
 * of truth for the shape of a tour; every other component depends on it. The
 * schema is versioned (SCHEMA_VERSION) so stored tours can be migrated across
 * releases and stay portable between platforms (WordPress, extensions, JSON).
 */

/** Text with a required default and optional per-language variants (i18n). */
export type LocalizedText = { default: string; [lang: string]: string };

/**
 * Matches a page URL for multi-page and cross-domain tours. At least one of
 * `glob`/`regex` must be set; `regex` (matched against the full URL) wins when
 * both are present. Globs use `*` within a path segment and `**` across them.
 */
export interface UrlMatch {
  glob?: string;
  regex?: string;
}

/** The device classes a condition can target. */
export type DeviceClass = 'mobile' | 'tablet' | 'desktop';

/**
 * Declarative predicate evaluated at runtime by the rules engine (in `core`).
 * All present fields must hold for the condition to pass. Used both to gate an
 * individual step (`Step.condition`) and to auto-start a tour (`Rule.when`).
 */
export interface Condition {
  /** Current page URL must match. */
  url?: UrlMatch;
  /**
   * Labels the visitor must carry. All listed tags must be present.
   *
   *     tags: ['authenticated', 'level:gold']
   *
   * A flat set rather than key/value pairs, because matching was only ever
   * equality — `{ level: 'gold' }` said nothing that the tag `level:gold` does
   * not. Pairs bought no expressiveness and cost the author two fields to fill
   * in blind; a set is something they can pick from a list.
   *
   * Deliberately without dedicated `role` or `audience` fields: a role is a tag,
   * being logged in is a tag, having purchased is a tag. Naming each in the
   * schema is a list that never ends, and two mechanisms for one idea always
   * raise "which do I use".
   */
  tags?: string[];
  /** Only on the visitor's first visit. */
  firstVisitOnly?: boolean;
  /** Only on this device class. */
  device?: DeviceClass;
  /** Skip if the tour/step was already seen by this visitor. */
  unlessSeen?: boolean;
  /** Show at most this many times. */
  maxShows?: number;
}

/** What a step does to advance, beyond the visitor clicking "next". */
export interface Action {
  type: 'click' | 'input' | 'navigate' | 'none';
  /** Destination for `navigate`. */
  url?: string;
  /** Value to type for `input`. */
  value?: string;
}

export interface Step {
  id: string;
  /**
   * Ranked candidates for the step's target, most stable first. The player
   * tries each in turn, so a redeploy that breaks one still resolves.
   *
   * Strings only, deliberately: this is the **stored** format, and a DOM node
   * cannot be serialised. A host that already holds the element can pass it
   * directly at runtime — see `RuntimeStep` in `@tours/core`, which widens this
   * to accept nodes and ref getters. `validate` rejects anything but strings.
   */
  selectors: string[];
  content: LocalizedText;
  /** Which side of the target the card sits on, or 'auto'. Defaults to 'bottom'. */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  /** Alignment along that side. Defaults to 'center'. */
  align?: 'start' | 'center' | 'end';
  /** Custom label for the back button. Defaults to 'Back'. */
  backLabel?: string;
  /** Custom label for the next button. Defaults to 'Next' (or 'Done' on the last step). */
  nextLabel?: string;
  /** Page this step belongs to (multi-page / cross-domain tours). */
  pageUrl?: UrlMatch;
  /** Runtime gate: only show this step when the condition holds. */
  condition?: Condition;
  /** Interaction the step performs or expects to advance. */
  action?: Action;
  /**
   * Dim the rest of the page for this step. Defaults to true.
   *
   * `false` leaves the page fully usable and merely outlines the target — for a
   * step that explains something the visitor should be free to poke at. Users of
   * other tour libraries fake this with an enormous spotlight padding; it is a
   * flag here.
   *
   * Distinct from `action: { type: 'click' }`: that also changes how the step
   * *advances*. This only changes how it *looks*.
   */
  overlay?: boolean;
}

/** Auto-start rule: trigger a tour when `when` holds. */
export interface Rule {
  /** Tour to trigger; defaults to the enclosing tour. */
  tourId?: string;
  when: Condition;
}

/**
 * How a tour auto-starts. `manual` (default) only starts via a shortcode/API
 * call; the others fire once when their condition is met.
 */
export type CtaCorner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type Trigger =
  | { type: 'manual' }
  | { type: 'load' }
  | { type: 'selector'; selector: string }
  | { type: 'timer'; delay: number }
  | {
      /** A small greeting popover in a corner; its button starts the tour. */
      type: 'cta';
      text: string;
      button: string;
      corner: CtaCorner;
      /** Distance from the corner edges in px (default 24). */
      offset?: number;
    };

/**
 * What the card's × does.
 *
 * Closing is always allowed — a visitor who has lost interest must be able to
 * get the overlay off the screen at any point. This only decides whether that
 * ends the tour or merely puts it aside.
 */
export interface DismissPolicy {
  /**
   * `end` (default) — finish for good: progress is cleared and the tour does
   * not come back.
   * `minimize` — set aside: progress is kept and a small invitation offers to
   * pick it up again, on this page and on later ones.
   */
  mode: 'end' | 'minimize';
  /**
   * The invitation shown after minimizing. Same shape as the `cta` trigger,
   * because it is the same popover — one component for "start this tour" and
   * "carry on with this tour".
   */
  resume?: {
    text: string;
    button: string;
    corner?: CtaCorner;
    offset?: number;
  };
}

/** Tour-level visual settings, read by both the player and the editor. */
export interface DisplaySettings {
  /**
   * Gap in pixels between the target element and the spotlight/highlight
   * outline. Applies everywhere the target is framed. Defaults to 6.
   */
  padding?: number;
  /** Corner radius (px) of the spotlight/highlight outline. Defaults to 6. */
  radius?: number;
  /** Corner radius (px) of the visitor tooltip card. Defaults to 10. */
  cardRadius?: number;
  /** Distance (px) from the target to the card. Defaults to 12. */
  offset?: number;
  /**
   * Inset (px) along the alignment edge for start/end alignment — nudges the
   * card in from the aligned edge. No effect on centre alignment. Defaults to 0.
   */
  alignOffset?: number;
}

export interface Tour {
  id: string;
  schemaVersion: number;
  title: LocalizedText;
  steps: Step[];
  /** Optional auto-start rules. */
  rules?: Rule[];
  /** How the tour auto-starts (defaults to manual). */
  trigger?: Trigger;
  /** Optional visual settings shared by player and editor. */
  display?: DisplaySettings;
  /** What the card's × does. Defaults to ending the tour. */
  dismiss?: DismissPolicy;
}

/** Default gap between a framed target and its outline, in pixels. */
export const DEFAULT_PADDING = 6;
/** Default corner radius of the outline, in pixels. */
export const DEFAULT_RADIUS = 6;
/** Default corner radius of the visitor tooltip card, in pixels. */
export const DEFAULT_CARD_RADIUS = 10;
/** Default distance from the target to the card, in pixels. */
export const DEFAULT_OFFSET = 12;

export const SCHEMA_VERSION = 2;

/** True for a plain object (not null, not an array). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** True for a LocalizedText — an object with a string `default`. */
function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.default === 'string';
}

const PLACEMENTS = ['top', 'bottom', 'left', 'right', 'auto'];
const ALIGNS = ['start', 'center', 'end'];
const DEVICES = ['mobile', 'tablet', 'desktop'];
const ACTION_TYPES = ['click', 'input', 'navigate', 'none'];

/** Validate a `UrlMatch`, pushing errors under `path`. */
function validateUrlMatch(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  const hasGlob = typeof value.glob === 'string' && value.glob.length > 0;
  const hasRegex = typeof value.regex === 'string' && value.regex.length > 0;
  if (!hasGlob && !hasRegex) {
    errors.push(`${path} must have a non-empty "glob" or "regex"`);
  }
  if (hasRegex) {
    try {
      new RegExp(value.regex as string);
    } catch {
      errors.push(`${path}.regex is not a valid regular expression`);
    }
  }
}

/** Validate a `Condition`, pushing errors under `path`. */
function validateCondition(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (value.url !== undefined) validateUrlMatch(value.url, `${path}.url`, errors);
  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags) || !value.tags.every((t) => typeof t === 'string' && t.length > 0)) {
      errors.push(`${path}.tags must be an array of non-empty strings`);
    }
  }
  if (value.firstVisitOnly !== undefined && typeof value.firstVisitOnly !== 'boolean') {
    errors.push(`${path}.firstVisitOnly must be a boolean`);
  }
  if (value.device !== undefined && !DEVICES.includes(value.device as string)) {
    errors.push(`${path}.device must be one of ${DEVICES.join('|')}`);
  }
  if (value.unlessSeen !== undefined && typeof value.unlessSeen !== 'boolean') {
    errors.push(`${path}.unlessSeen must be a boolean`);
  }
  if (
    value.maxShows !== undefined &&
    (typeof value.maxShows !== 'number' || value.maxShows < 0)
  ) {
    errors.push(`${path}.maxShows must be a non-negative number`);
  }
}

/** Validate an `Action`, pushing errors under `path`. */
function validateAction(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (!ACTION_TYPES.includes(value.type as string)) {
    errors.push(`${path}.type must be one of ${ACTION_TYPES.join('|')}`);
  }
  if (value.url !== undefined && typeof value.url !== 'string') {
    errors.push(`${path}.url must be a string`);
  }
  if (value.value !== undefined && typeof value.value !== 'string') {
    errors.push(`${path}.value must be a string`);
  }
}

/**
 * Validate arbitrary JSON against the tour schema. Returns the typed tour on
 * success, or a list of human-readable errors on failure. Used when importing
 * tours from files or untrusted sources. Does not migrate — call `migrate`
 * first for data that may be from an older schema version.
 */
export function validate(
  json: unknown,
): { ok: true; tour: Tour } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(json)) {
    return { ok: false, errors: ['tour must be an object'] };
  }

  if (typeof json.id !== 'string' || json.id.length === 0) {
    errors.push('tour.id must be a non-empty string');
  }

  if (typeof json.schemaVersion !== 'number') {
    errors.push('tour.schemaVersion must be a number');
  }

  if (!isLocalizedText(json.title)) {
    errors.push('tour.title must be a localized text with a string "default"');
  }

  if (!Array.isArray(json.steps)) {
    errors.push('tour.steps must be an array');
  } else if (json.steps.length === 0) {
    errors.push('tour.steps must contain at least one step');
  } else {
    json.steps.forEach((step, i) => {
      if (!isRecord(step)) {
        errors.push(`steps[${i}] must be an object`);
        return;
      }
      if (typeof step.id !== 'string' || step.id.length === 0) {
        errors.push(`steps[${i}].id must be a non-empty string`);
      }
      if (
        !Array.isArray(step.selectors) ||
        step.selectors.length === 0 ||
        !step.selectors.every((s) => typeof s === 'string' && s.length > 0)
      ) {
        errors.push(`steps[${i}].selectors must be a non-empty array of non-empty strings`);
      }
      if (!isLocalizedText(step.content)) {
        errors.push(`steps[${i}].content must be a localized text with a string "default"`);
      }
      if (
        step.placement !== undefined &&
        !PLACEMENTS.includes(step.placement as string)
      ) {
        errors.push(`steps[${i}].placement must be one of ${PLACEMENTS.join('|')}`);
      }
      if (step.align !== undefined && !ALIGNS.includes(step.align as string)) {
        errors.push(`steps[${i}].align must be one of ${ALIGNS.join('|')}`);
      }
      if (step.backLabel !== undefined && typeof step.backLabel !== 'string') {
        errors.push(`steps[${i}].backLabel must be a string`);
      }
      if (step.nextLabel !== undefined && typeof step.nextLabel !== 'string') {
        errors.push(`steps[${i}].nextLabel must be a string`);
      }
      if (step.pageUrl !== undefined) {
        validateUrlMatch(step.pageUrl, `steps[${i}].pageUrl`, errors);
      }
      if (step.condition !== undefined) {
        validateCondition(step.condition, `steps[${i}].condition`, errors);
      }
      if (step.action !== undefined) {
        validateAction(step.action, `steps[${i}].action`, errors);
      }

      if (step.overlay !== undefined && typeof step.overlay !== 'boolean') {
        errors.push(`steps[${i}].overlay must be a boolean`);
      }
    });
  }

  if (json.trigger !== undefined) {
    const tr = json.trigger;
    const types = ['manual', 'load', 'selector', 'timer', 'cta'];
    const corners = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    if (!isRecord(tr) || typeof tr.type !== 'string' || !types.includes(tr.type)) {
      errors.push(`tour.trigger.type must be one of ${types.join('|')}`);
    } else if (tr.type === 'selector' && (typeof tr.selector !== 'string' || tr.selector.length === 0)) {
      errors.push('tour.trigger.selector must be a non-empty string');
    } else if (tr.type === 'timer' && (typeof tr.delay !== 'number' || tr.delay < 0)) {
      errors.push('tour.trigger.delay must be a non-negative number');
    } else if (tr.type === 'cta') {
      if (typeof tr.text !== 'string') errors.push('tour.trigger.text must be a string');
      if (typeof tr.button !== 'string') errors.push('tour.trigger.button must be a string');
      if (!corners.includes(tr.corner as string)) errors.push(`tour.trigger.corner must be one of ${corners.join('|')}`);
      if (tr.offset !== undefined && (typeof tr.offset !== 'number' || tr.offset < 0)) {
        errors.push('tour.trigger.offset must be a non-negative number');
      }
    }
  }


  if (json.display !== undefined) {
    if (!isRecord(json.display)) {
      errors.push('tour.display must be an object');
    } else {
      for (const key of ['padding', 'radius', 'cardRadius', 'offset', 'alignOffset'] as const) {
        const v = json.display[key];
        if (v !== undefined && (typeof v !== 'number' || v < 0)) {
          errors.push(`tour.display.${key} must be a non-negative number`);
        }
      }
    }
  }

  if (json.rules !== undefined) {
    if (!Array.isArray(json.rules)) {
      errors.push('tour.rules must be an array');
    } else {
      json.rules.forEach((rule, i) => {
        if (!isRecord(rule)) {
          errors.push(`rules[${i}] must be an object`);
          return;
        }
        if (rule.tourId !== undefined && typeof rule.tourId !== 'string') {
          errors.push(`rules[${i}].tourId must be a string`);
        }
        if (rule.when === undefined) {
          errors.push(`rules[${i}].when is required`);
        } else {
          validateCondition(rule.when, `rules[${i}].when`, errors);
        }
      });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, tour: json as unknown as Tour };
}

/** Upgrades a tour object from one schema version to the next. */
type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

/**
 * Migration registry: `migrations[n]` upgrades a tour from version `n` to
 * `n + 1`. Data with no `schemaVersion` is treated as version 0 (pre-versioned
 * exports), so the 0→1 step simply stamps the current version. Add the next
 * entry here whenever SCHEMA_VERSION is bumped — never mutate an existing one.
 */
const migrations: Record<number, Migration> = {
  0: (data) => ({ ...data, schemaVersion: 1 }),
  /**
   * v1 → v2: `audience` and `Condition.traits` collapse into `Condition.tags`.
   *
   * `audience: 'auth'` becomes the tag `authenticated` on every rule (and on a
   * tour with no rules, a rule is created, because the audience gate applied
   * unconditionally). Trait pairs become `key:value` tags, which is exactly what
   * they meant — matching was equality-only.
   */
  1: (data) => {
    const out: Record<string, unknown> = { ...data, schemaVersion: 2 };
    const audience = out.audience;
    delete out.audience;

    const audienceTag =
      audience === 'auth' ? 'authenticated' : audience === 'guest' ? 'guest' : null;

    const convert = (cond: unknown): Record<string, unknown> => {
      const c = isRecord(cond) ? { ...cond } : {};
      const tags: string[] = Array.isArray(c.tags) ? [...(c.tags as string[])] : [];
      if (isRecord(c.traits)) {
        for (const [k, v] of Object.entries(c.traits)) tags.push(`${k}:${String(v)}`);
      }
      delete c.traits;
      // `role` predates traits and was equality-only too.
      if (typeof c.role === 'string' && c.role) tags.push(`role:${c.role}`);
      delete c.role;
      if (audienceTag) tags.push(audienceTag);
      if (tags.length > 0) c.tags = Array.from(new Set(tags));
      return c;
    };

    const rules = Array.isArray(out.rules) ? (out.rules as unknown[]) : [];
    if (rules.length > 0) {
      out.rules = rules.map((r) => {
        const rule = isRecord(r) ? { ...r } : {};
        rule.when = convert(rule.when);
        return rule;
      });
    } else if (audienceTag) {
      // No rules meant "always"; the audience gate still applied, so it needs a
      // rule of its own or the restriction would be silently dropped.
      out.rules = [{ when: { tags: [audienceTag] } }];
    }

    if (Array.isArray(out.steps)) {
      out.steps = (out.steps as unknown[]).map((st) => {
        const step = isRecord(st) ? { ...st } : {};
        if (step.condition !== undefined) step.condition = convert(step.condition);
        return step;
      });
    }
    return out;
  },
};

/** Reads a numeric schemaVersion, defaulting missing/invalid ones to 0. */
function versionOf(data: Record<string, unknown>): number {
  return typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;
}

/**
 * Bring possibly-outdated tour JSON up to the current schema version, then
 * validate it. Applies migrations in sequence (v0 → v1 → …). Fails if the data
 * is newer than this build supports or if no migration path exists — callers
 * get human-readable errors, never a throw.
 */
export function migrate(
  input: unknown,
): { ok: true; tour: Tour } | { ok: false; errors: string[] } {
  if (!isRecord(input)) {
    return { ok: false, errors: ['tour must be an object'] };
  }

  let data: Record<string, unknown> = { ...input };
  let version = versionOf(data);

  if (version > SCHEMA_VERSION) {
    return {
      ok: false,
      errors: [
        `tour.schemaVersion ${version} is newer than supported ${SCHEMA_VERSION}`,
      ],
    };
  }

  while (version < SCHEMA_VERSION) {
    const step = migrations[version];
    if (!step) {
      return { ok: false, errors: [`no migration from schema version ${version}`] };
    }
    data = step(data);
    const next = versionOf(data);
    // Guard against a migration that fails to advance the version.
    version = next > version ? next : version + 1;
  }

  return validate(data);
}
