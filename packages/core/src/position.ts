/**
 * Shared card-placement math used by both the player tooltip and the editor
 * preview, so a step looks the same while authoring and when live. A placement
 * is a side (which edge of the target the card sits on), an alignment along
 * that side (start/center/end) and an offset (distance from the target).
 */
export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface PlaceInput {
  target: Rect;
  card: { width: number; height: number };
  /** A fixed side, or 'auto' to pick the side with the most room. */
  side: Side | 'auto';
  align: Align;
  /** Distance from the target, perpendicular to the side. */
  offset: number;
  /** Inset along the alignment edge for start/end alignment. Defaults to 0. */
  alignOffset?: number;
  viewport: { width: number; height: number };
}

/**
 * Choose a side in auto mode. Prefers bottom (then top, right, left) and stays
 * there as long as the card fits, only moving elsewhere when it does not; if no
 * side fits, falls back to the one with the most room (bottom on ties).
 */
export function autoSide(
  t: Rect,
  c: { width: number; height: number },
  v: { width: number; height: number },
): Side {
  const space: Record<Side, number> = {
    top: t.top,
    bottom: v.height - t.bottom,
    left: t.left,
    right: v.width - t.right,
  };
  const needed: Record<Side, number> = {
    top: c.height,
    bottom: c.height,
    left: c.width,
    right: c.width,
  };
  const order: Side[] = ['bottom', 'top', 'right', 'left'];
  const firstFit = order.find((s) => space[s] >= needed[s] + 8);
  if (firstFit) return firstFit;
  return order.reduce((best, s) => (space[s] > space[best] ? s : best), order[0]);
}

/** Compute the card's viewport position, clamped so it stays on screen. */
export function placeCard(input: PlaceInput): { top: number; left: number } {
  const { target: t, card: c, offset, viewport: v } = input;
  const auto = input.side === 'auto';
  const side = auto ? autoSide(t, c, v) : input.side;
  // Auto aims for bottom-centre, so it centres along whichever side it lands on.
  const align: Align = auto ? 'center' : input.align;
  // Inset along the edge, nudging in from the aligned end (start: forward,
  // end: backward). Ignored for centre alignment.
  const ao = input.alignOffset ?? 0;
  const inset = align === 'start' ? ao : align === 'end' ? -ao : 0;
  let top = 0;
  let left = 0;

  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? t.top - c.height - offset : t.bottom + offset;
    // Align horizontally along the chosen edge.
    left =
      align === 'start'
        ? t.left
        : align === 'end'
          ? t.right - c.width
          : t.left + t.width / 2 - c.width / 2;
    left += inset;
  } else {
    left = side === 'left' ? t.left - c.width - offset : t.right + offset;
    // Align vertically along the chosen edge.
    top =
      align === 'start'
        ? t.top
        : align === 'end'
          ? t.bottom - c.height
          : t.top + t.height / 2 - c.height / 2;
    top += inset;
  }

  left = Math.max(8, Math.min(left, v.width - c.width - 8));
  top = Math.max(8, Math.min(top, v.height - c.height - 8));
  return { top, left };
}

/** A rectangle, in viewport coordinates. */
export interface Box {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** True when the element scrolls its own content on either axis. */
function scrolls(el: Element): boolean {
  const style = getComputedStyle(el);
  const value = `${style.overflowX} ${style.overflowY}`;
  return /auto|scroll|overlay|hidden/.test(value);
}

/**
 * The part of an element actually visible through its scrollable ancestors.
 *
 * A target inside a scrolling panel keeps reporting its full rectangle from
 * `getBoundingClientRect()` even when the panel has scrolled it out of sight —
 * so a highlight drawn from that rectangle floats over unrelated content, or
 * over nothing at all. Intersecting with every clipping ancestor gives the part
 * a visitor can really see.
 *
 * Returns null when nothing of it is visible; callers should hide rather than
 * draw a zero-sized frame.
 */
export function visibleRect(el: Element): Box | null {
  const r = el.getBoundingClientRect();
  let top = r.top;
  let left = r.left;
  let right = r.right;
  let bottom = r.bottom;

  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    if (!scrolls(p)) continue;
    const c = p.getBoundingClientRect();
    top = Math.max(top, c.top);
    left = Math.max(left, c.left);
    right = Math.min(right, c.right);
    bottom = Math.min(bottom, c.bottom);
  }

  // The viewport clips too — a target scrolled off the page is no more visible
  // than one scrolled out of a panel.
  top = Math.max(top, 0);
  left = Math.max(left, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);

  if (right <= left || bottom <= top) return null;
  return { top, left, right, bottom, width: right - left, height: bottom - top };
}
