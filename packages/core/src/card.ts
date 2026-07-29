/**
 * The step card — the single source of truth for the tooltip markup and styles,
 * shared by the player (live tour) and the editor (on-page preview) so they can
 * never drift. Callers position the returned element themselves.
 */
export interface CardButton {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface CardOptions {
  /** Plain-text body. Ignored when `contentHtml` is set. */
  contentText?: string;
  /** Pre-sanitized HTML body (future rich text). */
  contentHtml?: string;
  /** Optional progress line shown centred in the footer (e.g. "Step 2 of 5"). */
  progress?: string;
  /** Show a close (×) button. */
  showClose?: boolean;
  onClose?: () => void;
  back?: CardButton;
  next?: CardButton;
  /** Corner radius in px. */
  radius?: number;
  /**
   * Non-interactive preview: the card ignores pointer events (clicks fall
   * through to the page) but its buttons stay clickable.
   */
  ghost?: boolean;
}

function makeButton(spec: CardButton): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `tours-card__btn${spec.primary ? ' tours-card__btn--primary' : ''}${spec.disabled ? ' tours-card__btn--disabled' : ''}`;
  btn.textContent = spec.label;
  if (!spec.disabled && spec.onClick) btn.addEventListener('click', spec.onClick);
  return btn;
}

/** Build a step card element from the given options. */
export function renderCard(opts: CardOptions): HTMLElement {
  const card = document.createElement('div');
  // The close button is absolutely positioned, so the content has to be told to
  // keep clear of it — otherwise the first line runs underneath the ×.
  card.className =
    `tours-card${opts.ghost ? ' tours-card--ghost' : ''}` +
    `${opts.showClose ? ' tours-card--closable' : ''}`;
  if (opts.radius != null) card.style.borderRadius = `${opts.radius}px`;

  if (opts.showClose) {
    const close = document.createElement('button');
    close.className = 'tours-card__close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close');
    if (opts.onClose) close.addEventListener('click', opts.onClose);
    card.appendChild(close);
  }

  const content = document.createElement('div');
  content.className = 'tours-card__content';
  if (opts.contentHtml != null) content.innerHTML = opts.contentHtml;
  else content.textContent = opts.contentText ?? '';
  card.appendChild(content);

  if (opts.back || opts.next || opts.progress) {
    const footer = document.createElement('div');
    footer.className = 'tours-card__footer';
    if (opts.back) footer.appendChild(makeButton(opts.back));
    if (opts.progress) {
      const p = document.createElement('span');
      p.className = 'tours-card__progress';
      p.textContent = opts.progress;
      footer.appendChild(p);
    }
    if (opts.next) footer.appendChild(makeButton(opts.next));
    card.appendChild(footer);
  }

  return card;
}

/** Styles for the step card. Injected into any shadow root that renders one. */
export const CARD_STYLES = `
.tours-card {
  position: fixed;
  z-index: 2147483001;
  box-sizing: border-box;
  max-width: 320px;
  min-width: 220px;
  padding: 16px;
  font: 14px/1.5 system-ui, sans-serif;
  color: #111827;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
.tours-card--ghost { pointer-events: none; }
.tours-card--ghost .tours-card__btn,
.tours-card--ghost .tours-card__close { pointer-events: auto; }
.tours-card__content {
  white-space: pre-wrap;
  word-break: break-word;
}
/* Room for the × — only when there is one, so a card without it keeps the full
   width. 8px offset + 24px button, less the card's own 16px padding. */
.tours-card--closable .tours-card__content { padding-right: 20px; }
.tours-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.tours-card__progress {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
}
.tours-card__btn {
  box-sizing: border-box;
  padding: 6px 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: #111827;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  cursor: pointer;
}
.tours-card__btn:hover { background: #e5e7eb; }
.tours-card__btn--primary { color: #fff; background: #2563eb; border-color: #2563eb; }
.tours-card__btn--primary:hover { background: #1d4ed8; }
.tours-card__btn--disabled { opacity: 0.45; pointer-events: none; cursor: default; }
.tours-card__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  font: 16px/1 system-ui, sans-serif;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.tours-card__close:hover { background: #f3f4f6; color: #111827; }
`;
