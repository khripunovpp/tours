/**
 * Visitor state backend — where the player remembers its progress so a tour can
 * continue after the visitor navigates to another page. Within one site this is
 * localStorage (survives navigation and reloads). Cross-domain (M2) will plug a
 * chrome.storage-backed implementation into the same interface.
 */
export interface StateBackend {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** Progress record persisted between page loads. */
export interface TourProgress {
  tourId: string;
  /** Index of the step to show next. */
  index: number;
  /**
   * The visitor set the tour aside rather than finishing it. Progress is kept,
   * but nothing auto-resumes — an invitation is offered instead, so picking it
   * back up stays the visitor's choice. Survives navigation, so the invitation
   * reappears on later pages too.
   */
  minimized?: boolean;
}

export const PROGRESS_KEY = 'tours:progress';

/** localStorage-backed state; degrades to a no-op if storage is unavailable. */
export function createLocalState(): StateBackend {
  return {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore (private mode / quota)
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

/** Read the saved progress, or null if none / unreadable. */
export function readProgress(state: StateBackend): TourProgress | null {
  const raw = state.get(PROGRESS_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as TourProgress;
    if (typeof p?.tourId === 'string' && typeof p?.index === 'number') return p;
  } catch {
    // fall through
  }
  return null;
}

export function writeProgress(state: StateBackend, progress: TourProgress): void {
  state.set(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearProgress(state: StateBackend): void {
  state.remove(PROGRESS_KEY);
}

const SEEN_PREFIX = 'tours:seen:';

/** How many times a tour has been shown to this visitor. */
export function seenCount(state: StateBackend, tourId: string): number {
  const raw = state.get(SEEN_PREFIX + tourId);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}

/** Record one more showing of a tour. */
export function markSeen(state: StateBackend, tourId: string): void {
  state.set(SEEN_PREFIX + tourId, String(seenCount(state, tourId) + 1));
}
