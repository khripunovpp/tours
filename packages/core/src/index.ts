/**
 * Public entry point for @tours/core. Re-exports the platform-agnostic pieces
 * used by adapters and apps: the element picker, the tour player, and the
 * opt-in debug logger.
 */

/**
 * The tour data model, re-exported from @tours/schema.
 *
 * These are part of this package's public API — `createPlayer` takes a `Tour`,
 * `armTrigger` takes a `Tour`, `matchRules` takes `Rule[]`. The schema is
 * bundled into this package rather than declared as a dependency, so without
 * this re-export a consumer could call those functions but could not name their
 * argument types, and would have to install @tours/schema just for that.
 */
export type {
  Tour,
  Step,
  Rule,
  Condition,
  Action,
  Trigger,
  UrlMatch,
  DisplaySettings,
  LocalizedText,
  DeviceClass,
  CtaCorner,
} from '@tours/schema';

export { createPicker } from './picker.js';
export type { PickerHandle, PickerOptions } from './picker.js';
export { createPlayer, resumeTour, isBuilderMounted } from './player.js';
export type { PlayerHandle, PlayerOptions, RuntimeStep, RuntimeTour } from './player.js';
export { matchUrl, deriveUrl } from './url.js';
export { armTrigger } from './trigger.js';
export { mountTours } from './mount.js';
export type { MountOptions } from './mount.js';
export {
  createLocalState,
  readProgress,
  writeProgress,
  clearProgress,
  seenCount,
  markSeen,
  PROGRESS_KEY,
} from './state.js';
export type { StateBackend, TourProgress } from './state.js';
export { matchRules, detectDevice } from './rules.js';
export type { RuleContext, Device, ViewerTraits } from './rules.js';
export { matchesCondition } from './rules.js';
export { createLogger, isLoggingEnabled } from './logger.js';
export type { Logger } from './logger.js';
export { placeCard, autoSide } from './position.js';
export type { Side, Align, PlaceInput } from './position.js';
export { renderCard, CARD_STYLES } from './card.js';
export type { CardOptions, CardButton } from './card.js';
export { buildSelectors, resolveElement, waitForElement } from './selector.js';
export type { WaitOptions, SelectorLike } from './selector.js';
export type { TourEventMap, TourEventName, TourEventHandlers, SkipReason, StopReason } from './events.js';
