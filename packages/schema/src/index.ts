/**
 * Tour data model and validation for @tours/schema. This is the single source
 * of truth for the shape of a tour; every other component depends on it. The
 * schema is versioned (SCHEMA_VERSION) so stored tours can be migrated.
 */

/** Text with a required default and optional per-language variants (i18n). */
export type LocalizedText = { default: string; [lang: string]: string };

export interface Step {
  id: string;
  selectors: string[];
  content: LocalizedText;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Tour {
  id: string;
  schemaVersion: number;
  title: LocalizedText;
  steps: Step[];
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

/**
 * Validate arbitrary JSON against the tour schema. Returns the typed tour on
 * success, or a list of human-readable errors on failure. Used when importing
 * tours from files or untrusted sources.
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
        !['top', 'bottom', 'left', 'right'].includes(step.placement as string)
      ) {
        errors.push(`steps[${i}].placement must be one of top|bottom|left|right`);
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, tour: json as unknown as Tour };
}
