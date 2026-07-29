/**
 * Rules engine — decides whether a tour may auto-start right now. A tour's
 * `rules` are OR-ed: it may start if any rule's condition holds (or there are
 * no rules). Conditions cover URL, visitor tags, first visit, device and
 * frequency.
 */
import type { Rule, Condition } from '@tours/schema';
import { matchUrl } from './url.js';

export type Device = 'mobile' | 'tablet' | 'desktop';

/**
 * Labels the host attaches to the current visitor — `admin`, `authenticated`,
 * `firstVisit`, `hasPurchases`, `level:gold`. Matched against `Condition.tags`.
 *
 * A flat set rather than key/value pairs: matching is equality only, so a pair
 * never said more than a `key:value` tag, and a set is something a tour author
 * can pick from a list instead of typing blind.
 */
export type ViewerTags = readonly string[];

export interface RuleContext {
  url: string;
  /**
   * A tag the host does not report is simply absent, so a rule requiring it
   * fails closed. The alternative — unknown means "matches" — would leak tours
   * to exactly the visitors a rule was written to exclude.
   */
  tags?: ViewerTags;
  device: Device;
  /** True when the visitor has not seen this tour before. */
  firstVisit: boolean;
  /** How many times this tour has already been shown to the visitor. */
  seenCount: number;
}

/** Coarse device class from the viewport width. */
export function detectDevice(width: number = window.innerWidth): Device {
  if (width <= 640) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

function matchCondition(cond: Condition, ctx: RuleContext): boolean {
  if (cond.url && !matchUrl(cond.url, ctx.url)) return false;
  if (cond.tags && cond.tags.length > 0) {
    // All required — an "any of these" rule is expressed as separate rules,
    // which are OR-ed.
    const has = ctx.tags ?? [];
    for (const tag of cond.tags) if (!has.includes(tag)) return false;
  }
  if (cond.firstVisitOnly && !ctx.firstVisit) return false;
  if (cond.device && cond.device !== ctx.device) return false;
  if (cond.unlessSeen && ctx.seenCount > 0) return false;
  if (cond.maxShows !== undefined && ctx.seenCount >= cond.maxShows) return false;
  return true;
}

/** True if a single condition holds — exported for per-step gating. */
export function matchesCondition(cond: Condition | undefined, ctx: RuleContext): boolean {
  return !cond || matchCondition(cond, ctx);
}

/** True if the tour may start given the context (no rules ⇒ always). */
export function matchRules(rules: Rule[] | undefined, ctx: RuleContext): boolean {
  if (!rules || rules.length === 0) return true;
  return rules.some((rule) => matchCondition(rule.when, ctx));
}
