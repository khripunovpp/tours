/**
 * A DraftStore backed by chrome.storage.local. Unlike localStorage this is
 * shared across all origins the extension runs on, so a multi-domain tour's
 * draft survives navigating from site A to site B while authoring.
 */
import { normalizeTours, type DraftStore, type DraftTour } from '@tours/editor';

export function createChromeStore(key = 'tours:drafts'): DraftStore {
  return {
    async load(): Promise<DraftTour[] | null> {
      try {
        const bag = await chrome.storage.local.get(key);
        const raw = bag[key];
        if (!raw) return null;
        return normalizeTours(typeof raw === 'string' ? JSON.parse(raw) : raw);
      } catch {
        return null;
      }
    },
    async save(tours: DraftTour[]): Promise<void> {
      try {
        await chrome.storage.local.set({ [key]: tours });
      } catch {
        // storage unavailable — ignore
      }
    },
  };
}
