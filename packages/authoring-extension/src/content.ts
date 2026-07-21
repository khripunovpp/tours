/**
 * Injected on demand (from the toolbar button) to toggle the tour builder on
 * the current page. Re-running toggles it off. The builder persists drafts in
 * chrome.storage so they survive cross-domain navigation.
 */
import { TourBuilder } from '@tours/editor';
import { createChromeStore } from './chrome-store.js';

interface Holder {
  __toursAuthoring?: TourBuilder | null;
}

const holder = window as unknown as Holder;

if (holder.__toursAuthoring) {
  holder.__toursAuthoring.destroy();
  holder.__toursAuthoring = null;
} else {
  const builder = new TourBuilder({ mode: 'edit', store: createChromeStore() });
  builder.mount();
  holder.__toursAuthoring = builder;
}
