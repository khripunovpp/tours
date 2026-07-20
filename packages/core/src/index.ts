/**
 * Public entry point for @tours/core. Re-exports the platform-agnostic pieces
 * used by adapters and apps: the element picker, the tour player, and the
 * opt-in debug logger.
 */
export { createPicker } from './picker.js';
export type { PickerHandle, PickerOptions } from './picker.js';
export { createPlayer, resumeTour } from './player.js';
export type { PlayerHandle, PlayerOptions } from './player.js';
export { matchUrl } from './url.js';
export {
  createLocalState,
  readProgress,
  writeProgress,
  clearProgress,
  PROGRESS_KEY,
} from './state.js';
export type { StateBackend, TourProgress } from './state.js';
export { createLogger, isLoggingEnabled } from './logger.js';
export type { Logger } from './logger.js';
export { placeCard, autoSide } from './position.js';
export type { Side, Align, PlaceInput } from './position.js';
export { renderCard, CARD_STYLES } from './card.js';
export type { CardOptions, CardButton } from './card.js';
export { buildSelectors, resolveElement, waitForElement } from './selector.js';
export type { WaitOptions } from './selector.js';
