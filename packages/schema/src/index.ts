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
  /** Visitor role must equal this (e.g. "admin", "guest"). */
  role?: string;
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
  selectors: string[];
  content: LocalizedText;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Page this step belongs to (multi-page / cross-domain tours). */
  pageUrl?: UrlMatch;
  /** Runtime gate: only show this step when the condition holds. */
  condition?: Condition;
  /** Interaction the step performs or expects to advance. */
  action?: Action;
}

/** Auto-start rule: trigger a tour when `when` holds. */
export interface Rule {
  /** Tour to trigger; defaults to the enclosing tour. */
  tourId?: string;
  when: Condition;
}

export interface Tour {
  id: string;
  schemaVersion: number;
  title: LocalizedText;
  steps: Step[];
  /** Optional auto-start rules. */
  rules?: Rule[];
}

export const SCHEMA_VERSION = 1;

/** True for a plain object (not null, not an array). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** True for a LocalizedText — an object with a string `default`. */
function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.default === 'string';
}

const PLACEMENTS = ['top', 'bottom', 'left', 'right'];
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
  if (value.role !== undefined && typeof value.role !== 'string') {
    errors.push(`${path}.role must be a string`);
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
      if (step.pageUrl !== undefined) {
        validateUrlMatch(step.pageUrl, `steps[${i}].pageUrl`, errors);
      }
      if (step.condition !== undefined) {
        validateCondition(step.condition, `steps[${i}].condition`, errors);
      }
      if (step.action !== undefined) {
        validateAction(step.action, `steps[${i}].action`, errors);
      }
    });
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
