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
  side: Side;
  align: Align;
  offset: number;
  viewport: { width: number; height: number };
}

/** Compute the card's viewport position, clamped so it stays on screen. */
export function placeCard(input: PlaceInput): { top: number; left: number } {
  const { target: t, card: c, side, align, offset, viewport: v } = input;
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
  } else {
    left = side === 'left' ? t.left - c.width - offset : t.right + offset;
    // Align vertically along the chosen edge.
    top =
      align === 'start'
        ? t.top
        : align === 'end'
          ? t.bottom - c.height
          : t.top + t.height / 2 - c.height / 2;
  }

  left = Math.max(8, Math.min(left, v.width - c.width - 8));
  top = Math.max(8, Math.min(top, v.height - c.height - 8));
  return { top, left };
}
