/**
 * Public entry point for @tours/editor — the tour builder. Include just this
 * package on a page to author tours; it bundles the core picker/player it needs
 * and outputs a validated @tours/schema Tour.
 */
export { TourBuilder } from './builder.js';
export type {
  TourBuilderOptions,
  NavPosition,
  PanelPosition,
} from './builder.js';
export { toTour, createDraftTour, createDraftStep } from './state.js';
export type { DraftTour, DraftStep, CardType, TourStatus, Placement } from './state.js';
