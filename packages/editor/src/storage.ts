/**
 * Draft persistence for the builder. The builder always writes to localStorage
 * (the default, offline-safe store) and, when a secondary strategy is
 * configured, also tries to save there best-effort. Stores persist the full
 * DraftTour[] (authoring state), not just the shipped Tour.
 *
 * Available secondary strategy for now: WordPress (`createWordPressStore`).
 */
import { normalizeTours, type DraftTour } from './state.js';

export interface DraftStore {
  /** Load stored drafts, or null when there is nothing / it is unavailable. */
  load(): Promise<DraftTour[] | null>;
  save(tours: DraftTour[]): Promise<void>;
}

/** Default store: browser localStorage. Never throws — degrades to a no-op. */
export function createLocalStore(key = 'tours:drafts'): DraftStore {
  return {
    async load() {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return normalizeTours(JSON.parse(raw));
      } catch {
        return null;
      }
    },
    async save(tours) {
      try {
        localStorage.setItem(key, JSON.stringify(tours));
      } catch {
        // Storage disabled or over quota — ignore; the secondary store may work.
      }
    },
  };
}

export interface WordPressStoreConfig {
  /** REST route that accepts GET (load) and POST (save) of the draft array. */
  url: string;
  /** WordPress nonce, sent as `X-WP-Nonce` when present. */
  nonce?: string;
}

/**
 * WordPress secondary strategy: persist drafts through a REST route. Errors
 * propagate so the builder can log them; localStorage remains the safety net.
 */
export function createWordPressStore(config: WordPressStoreConfig): DraftStore {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.nonce) headers['X-WP-Nonce'] = config.nonce;
  return {
    async load() {
      const res = await fetch(config.url, { headers, credentials: 'same-origin' });
      if (!res.ok) throw new Error(`WordPress load failed: ${res.status}`);
      return normalizeTours(await res.json());
    },
    async save(tours) {
      const res = await fetch(config.url, {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify(tours),
      });
      if (!res.ok) throw new Error(`WordPress save failed: ${res.status}`);
    },
  };
}
