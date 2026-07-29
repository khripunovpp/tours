/**
 * A small "start the tour" invitation pinned to a screen corner (greeting text
 * + a button). Lives in its own shadow DOM. Clicking the button starts the
 * tour; the × dismisses it. Returned function removes it.
 */
import type { CtaCorner } from '@tours/schema';

export interface CtaOptions {
  text: string;
  button: string;
  corner?: CtaCorner;
  /** Distance from the corner edges, px. Default 24. */
  offset?: number;
  onStart: () => void;
}

const CTA_STYLES = `
:host { all: initial; }
/* Host-page custom properties still cascade in, so a site can restyle the
   popover without a custom renderer. */
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--tours-cta-fg, #111827);
  background: var(--tours-cta-bg, #fff);
  border: 1px solid var(--tours-cta-border, #e5e7eb);
  border-radius: var(--tours-cta-radius, 14px);
  box-shadow: var(--tours-cta-shadow, 0 12px 32px rgba(15, 23, 42, 0.18));
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: var(--tours-cta-btn-fg, #fff);
  background: var(--tours-cta-btn-bg, #2563eb);
  border: none;
  border-radius: var(--tours-cta-btn-radius, 9px);
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: var(--tours-cta-btn-bg-hover, #1d4ed8); }
.cta__close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 22px;
  height: 22px;
  padding: 0;
  font: 16px/1 system-ui, sans-serif;
  color: #9aa4b8;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cta__close:hover { color: #111827; background: #f3f4f6; }
`;

/**
 * An invitation to carry on with a tour that was set aside. Deliberately the
 * same popover as the "start this tour" CTA — one component for both, so a
 * site only has one small thing to style.
 */
export interface ResumeInvite {
  tourId: string;
  text: string;
  button: string;
  corner?: CtaCorner;
  offset?: number;
  onResume: () => void;
}

/**
 * Show the resume invitation, or hand off to a host-supplied renderer.
 *
 * `render` is the escape hatch for a design the CSS variables cannot reach: it
 * receives the invite and must return a function that removes whatever it
 * built. The player never touches the returned element.
 */
export function showResumeInvite(
  invite: ResumeInvite,
  render?: (invite: ResumeInvite) => () => void,
): () => void {
  if (render) return render(invite);
  return showCta({
    text: invite.text,
    button: invite.button,
    corner: invite.corner,
    offset: invite.offset,
    onStart: invite.onResume,
  });
}

/** Show the CTA popover; returns a function that removes it. */
export function showCta(options: CtaOptions): () => void {
  const corner = options.corner ?? 'bottom-right';
  const offset = options.offset ?? 24;

  const host = document.createElement('div');
  host.setAttribute('data-tours-cta', '');
  const root = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = CTA_STYLES;
  root.appendChild(style);

  const card = document.createElement('div');
  card.className = 'cta';
  const [vertical, horizontal] = corner.split('-') as ['top' | 'bottom', 'left' | 'right'];
  card.style[vertical] = `${offset}px`;
  card.style[horizontal] = `${offset}px`;

  const remove = (): void => {
    if (host.parentNode) host.parentNode.removeChild(host);
  };

  const close = document.createElement('button');
  close.className = 'cta__close';
  close.type = 'button';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Dismiss');
  close.addEventListener('click', remove);

  const text = document.createElement('p');
  text.className = 'cta__text';
  text.textContent = options.text;

  const button = document.createElement('button');
  button.className = 'cta__btn';
  button.type = 'button';
  button.textContent = options.button;
  button.addEventListener('click', () => {
    remove();
    options.onStart();
  });

  card.append(close, text, button);
  root.appendChild(card);
  document.body.appendChild(host);

  return remove;
}
