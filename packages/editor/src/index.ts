/**
 * Public entry point for @tours/editor — the tour builder. Include just this
 * package on a page to author tours; it bundles the core picker/player it needs
 * and outputs a validated @tours/schema Tour.
 */
/**
 * The shipped tour model, re-exported from @tours/schema — `toTour()` returns a
 * `Tour`, so callers need to be able to name it. The schema is bundled into this
 * package rather than being a dependency, so without this they could not.
 *
 * `Trigger` is deliberately absent: this package exports its own draft-level
 * `Trigger` from ./state.js, and re-exporting the schema's would collide.
 * Import that one from @tours/core if you need it.
 */
export type {
  Tour,
  Step,
  Rule,
  Condition,
  Action,
  UrlMatch,
  DisplaySettings,
  LocalizedText,
} from '@tours/schema';

export { TourBuilder } from './builder.js';
export type {
  TourBuilderOptions,
  NavPosition,
  PanelPosition,
} from './builder.js';
export { toTour, createDraftTour, createDraftStep, cloneDraft, normalizeTours } from './state.js';
export type { DraftTour, DraftStep, DraftDisplay, CardType, TourStatus, TourKind, Trigger, Placement, Align } from './state.js';
export { createLocalStore, createWordPressStore } from './storage.js';
export type { DraftStore, WordPressStoreConfig } from './storage.js';
