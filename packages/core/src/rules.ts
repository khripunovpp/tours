/**
 * Rules engine — decides whether a tour may auto-start right now. A tour's
 * `rules` are OR-ed: it may start if any rule's condition holds (or there are
 * no rules). Conditions cover URL, role, first visit, device, and frequency.
 */
import type { Rule, Condition } from '@tours/schema';
import { matchUrl } from './url.js';

export type Device = 'mobile' | 'tablet' | 'desktop';

export interface RuleContext {
  url: string;
  role?: string;
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
  if (cond.role !== undefined && cond.role !== ctx.role) return false;
  if (cond.firstVisitOnly && !ctx.firstVisit) return false;
  if (cond.device && cond.device !== ctx.device) return false;
  if (cond.unlessSeen && ctx.seenCount > 0) return false;
  if (cond.maxShows !== undefined && ctx.seenCount >= cond.maxShows) return false;
  return true;
}

/** True if the tour may start given the context (no rules ⇒ always). */
export function matchRules(rules: Rule[] | undefined, ctx: RuleContext): boolean {
  if (!rules || rules.length === 0) return true;
  return rules.some((rule) => matchCondition(rule.when, ctx));
}
