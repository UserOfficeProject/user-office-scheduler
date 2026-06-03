/**
 * Lightweight frontend logging utility.
 *
 * Centralises all diagnostic output behind a single module so that:
 *  - Every call site is easy to find (grep for `logger.`).
 *  - The implementation can be extended with remote logging / monitoring
 *    without touching call sites.
 *  - Bare `console.error` / `console.log` calls no longer leak into
 *    production builds.
 */
export const logger = {
  /** Log an error with an optional underlying cause. */
  error(message: string, error?: unknown): void {
    // Keep console output for local development; the message string
    // gives enough context to locate the source.
    console.error(
      `[Scheduler] ${message}`,
      ...(error !== undefined ? [error] : [])
    );
  },

  /** Log a warning. */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[Scheduler] ${message}`, ...args);
  },
};
