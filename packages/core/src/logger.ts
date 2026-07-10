/**
 * Debug logger. Silent by default so production pages stay quiet; enable it by
 * adding `use_logs` to the page URL query string (e.g. `?use_logs` or
 * `?use_logs=1`). Kept in its own module so every component can log its main
 * stages through one consistent, opt-in channel.
 */

/** Cached enabled-state; the URL does not change within a page load. */
let cachedEnabled: boolean | null = null;

/** Whether logging is turned on via the `use_logs` URL parameter. */
export function isLoggingEnabled(): boolean {
  if (cachedEnabled !== null) return cachedEnabled;
  try {
    // Guard against non-browser environments (no window/location).
    cachedEnabled = new URLSearchParams(window.location.search).has('use_logs');
  } catch {
    cachedEnabled = false;
  }
  return cachedEnabled;
}

export interface Logger {
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

/**
 * Create a scoped logger. Messages are prefixed with `[tours:<scope>]` and are
 * emitted only when logging is enabled. Use it to trace the main stages of a
 * component (start/stop, step changes, captured selectors, etc.).
 */
export function createLogger(scope: string): Logger {
  const prefix = `[tours:${scope}]`;
  return {
    log: (...args) => {
      if (isLoggingEnabled()) console.log(prefix, ...args);
    },
    warn: (...args) => {
      if (isLoggingEnabled()) console.warn(prefix, ...args);
    },
    error: (...args) => {
      if (isLoggingEnabled()) console.error(prefix, ...args);
    },
  };
}
