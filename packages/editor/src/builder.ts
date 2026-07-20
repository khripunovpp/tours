/**
 * TourBuilder: a self-contained authoring UI mounted on any page. It renders
 * two blocks in its own shadow DOM — a floating navigation bar (top/bottom) and
 * a builder panel (left/right) that shows the tour as a connected list of step
 * cards. Selecting a card makes it "active"; the picker then binds captured
 * selectors to that card. Output is a validated @tours/schema Tour.
 *
 * Enable in code:   new TourBuilder({ mode: 'edit' }).mount();
 * Enable via URL:   TourBuilder.fromUrl();   // when ?tours-edit=1 is present
 */
import { createPicker, createPlayer, createLogger } from '@tours/core';
import type { PickerHandle, PlayerHandle } from '@tours/core';
import { EDITOR_STYLES } from './styles.js';
import { ICONS } from './icons.js';
import {
  createDraftStep,
  createDraftTour,
  toTour,
  type CardType,
  type DraftStep,
  type DraftTour,
} from './state.js';

export type NavPosition = 'top' | 'bottom';
export type PanelPosition = 'left' | 'right';
type Mode = 'build' | 'preview';
type Tab = 'steps' | 'display' | 'assets';

export interface TourBuilderOptions {
  /** Start mounted in edit mode. Default: true. */
  mode?: 'edit' | 'off';
  navPosition?: NavPosition;
  panelPosition?: PanelPosition;
  /** URL query flag that auto-mounts the builder (used by `fromUrl`). */
  urlFlag?: string;
}

/** Small typed element factory to keep rendering terse. */
function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: Array<Node | string> = [],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const c of children) el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return el;
}

/** A button whose only content is an inline icon. */
function iconButton(icon: string, title: string, cls = ''): HTMLButtonElement {
  const btn = h('button', { class: `iconbtn ${cls}`.trim(), title, type: 'button' });
  btn.innerHTML = ICONS[icon] ?? '';
  return btn;
}

export class TourBuilder {
  private readonly log = createLogger('editor');
  private host: HTMLElement | null = null;
  private root: ShadowRoot | null = null;

  private tour: DraftTour = createDraftTour();
  private activeStepId: string | null = this.tour.steps[0]?.id ?? null;
  private tab: Tab = 'steps';
  private mode: Mode = 'build';
  private navPosition: NavPosition;
  private panelPosition: PanelPosition;

  private picker: PickerHandle | null = null;
  private picking = false;
  private player: PlayerHandle | null = null;
  /** Dashed outline over the active step's target element (no backdrop). */
  private highlight: HTMLElement | null = null;
  /** Step whose content should regain focus after the next render. */
  private focusStepId: string | null = null;
  private readonly onViewportChange = (): void => this.updateHighlight();

  constructor(private readonly options: TourBuilderOptions = {}) {
    this.navPosition = options.navPosition ?? 'bottom';
    this.panelPosition = options.panelPosition ?? 'right';
  }

  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(options: TourBuilderOptions = {}): TourBuilder | null {
    const flag = options.urlFlag ?? 'tours-edit';
    const value = new URLSearchParams(window.location.search).get(flag);
    if (value === null || value === '0' || value === 'false') return null;
    const builder = new TourBuilder(options);
    builder.mount();
    return builder;
  }

  /** Render the UI onto the page. Idempotent. */
  mount(): void {
    if (this.host) return;
    if (this.options.mode === 'off') return;
    this.host = h('div', { 'data-tours-editor': '' });
    this.root = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = EDITOR_STYLES;
    this.root.appendChild(style);
    // The highlight is created once and survives re-renders (render() only
    // rebuilds .panel/.nav), so it can track the target smoothly.
    this.highlight = h('div', { class: 'highlight' });
    this.root.appendChild(this.highlight);
    document.body.appendChild(this.host);
    // Keep the outline glued to the target as the page scrolls or resizes.
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange, true);
    this.log.log('mounted');
    this.render();
  }

  /** Remove the UI and any active picker/player. */
  destroy(): void {
    this.stopPicking();
    this.player?.stop();
    this.player = null;
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange, true);
    if (this.host?.parentNode) this.host.parentNode.removeChild(this.host);
    this.host = null;
    this.root = null;
    this.highlight = null;
  }

  /** The current draft as a validated tour (or validation errors). */
  export(): ReturnType<typeof toTour> {
    return toTour(this.tour);
  }

  // ---------- state mutations ----------

  private get activeStep(): DraftStep | null {
    return this.tour.steps.find((s) => s.id === this.activeStepId) ?? null;
  }

  private setActive(id: string): void {
    if (this.activeStepId === id) return;
    this.activeStepId = id;
    this.render();
  }

  private addStepAfter(index: number, type: CardType = 'step'): void {
    const step = createDraftStep(type);
    this.tour.steps.splice(index + 1, 0, step);
    this.activeStepId = step.id;
    this.render();
  }

  private removeStep(id: string): void {
    const i = this.tour.steps.findIndex((s) => s.id === id);
    if (i === -1) return;
    this.tour.steps.splice(i, 1);
    if (this.activeStepId === id) {
      this.activeStepId = this.tour.steps[Math.max(0, i - 1)]?.id ?? null;
    }
    this.render();
  }

  // ---------- picker (selector search) ----------

  private togglePicking(): void {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const step = this.activeStep;
    if (!step) return;
    this.picking = true;
    this.picker = createPicker(
      (selectors) => {
        step.selectors = selectors;
        this.picking = false;
        this.picker = null;
        this.log.log('bound selector to step', step.id, selectors);
        this.render();
      },
      { ignore: [this.host] },
    );
    this.picker.start();
    this.render();
  }

  private stopPicking(): void {
    this.picker?.stop();
    this.picker = null;
    this.picking = false;
  }

  // ---------- preview ----------

  private togglePreview(): void {
    if (this.mode === 'preview') {
      this.player?.stop();
      this.player = null;
      this.mode = 'build';
      this.render();
      return;
    }
    const result = this.export();
    if (!result.ok) {
      this.log.warn('cannot preview — draft is invalid', result.errors);
      window.alert(`Add a selector and text to at least one step first:\n\n${result.errors.join('\n')}`);
      return;
    }
    this.mode = 'preview';
    this.render();
    this.player = createPlayer(result.tour);
    this.player.start();
  }

  // ---------- rendering ----------

  private render(): void {
    if (!this.root) return;
    // Clear everything except the <style> element.
    this.root.querySelectorAll('.panel, .nav').forEach((n) => n.remove());
    if (this.mode === 'build') this.root.appendChild(this.renderPanel());
    this.root.appendChild(this.renderNav());
    if (this.focusStepId) {
      this.focusContent(this.focusStepId);
      this.focusStepId = null;
    }
    this.updateHighlight();
  }

  /** Resolve a step's target on the page, trying each candidate selector. */
  private resolveTarget(step: DraftStep): Element | null {
    for (const selector of step.selectors) {
      try {
        const el = document.querySelector(selector);
        if (el) return el;
      } catch {
        // Invalid selector — try the next candidate.
      }
    }
    return null;
  }

  /**
   * Draw the dashed outline around the active step's target. Shown only in
   * build mode when the active step resolves to an element; hidden while
   * picking (the picker shows its own overlay) or in preview. No backdrop, so
   * nothing dims or flickers.
   */
  private updateHighlight(): void {
    const box = this.highlight;
    if (!box) return;
    const hide = (): void => {
      box.style.display = 'none';
    };
    if (this.mode !== 'build' || this.picking) return hide();
    const step = this.activeStep;
    if (!step || step.selectors.length === 0) return hide();
    const target = this.resolveTarget(step);
    if (!target) return hide();

    const rect = target.getBoundingClientRect();
    // Tour-level spacing (same value the player uses).
    const pad = this.tour.display.padding;
    // In the Display tab the outline switches color to signal "tuning" mode.
    box.className = `highlight ${this.tab === 'display' ? 'highlight--settings' : ''}`.trim();
    box.style.display = 'block';
    box.style.left = `${rect.left - pad}px`;
    box.style.top = `${rect.top - pad}px`;
    box.style.width = `${rect.width + pad * 2}px`;
    box.style.height = `${rect.height + pad * 2}px`;
  }

  private renderNav(): HTMLElement {
    const nav = h('div', { class: `nav nav--${this.navPosition}` });

    const build = iconButton('build', 'Build', this.mode === 'build' ? 'iconbtn--active' : '');
    build.addEventListener('click', () => {
      if (this.mode === 'preview') this.togglePreview();
    });
    const preview = iconButton('preview', 'Preview', this.mode === 'preview' ? 'iconbtn--active' : '');
    preview.addEventListener('click', () => this.togglePreview());

    const flip = iconButton('navFlip', 'Move bar (top/bottom)');
    flip.addEventListener('click', () => {
      this.navPosition = this.navPosition === 'bottom' ? 'top' : 'bottom';
      this.render();
    });

    const close = iconButton('close', 'Close builder');
    close.addEventListener('click', () => this.destroy());

    nav.append(build, preview, h('div', { class: 'nav__sep' }), flip, close);
    return nav;
  }

  private renderPanel(): HTMLElement {
    const panel = h('div', { class: `panel panel--${this.panelPosition}` });
    panel.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody());
    return panel;
  }

  private renderHeader(): HTMLElement {
    const header = h('div', { class: 'panel__header' });

    const title = h('input', { class: 'panel__title', value: this.tour.name });
    (title as HTMLInputElement).value = this.tour.name;
    title.addEventListener('change', () => {
      this.tour.name = (title as HTMLInputElement).value.trim() || 'Untitled tour';
    });

    const status = h('span', { class: `status status--${this.tour.status}` }, [this.tour.status]);
    status.addEventListener('click', () => {
      this.tour.status = this.tour.status === 'draft' ? 'published' : 'draft';
      this.render();
    });
    status.setAttribute('title', 'Toggle status');
    (status as HTMLElement).style.cursor = 'pointer';

    const menu = iconButton('menu', 'Tour menu');
    menu.addEventListener('click', () => this.openMenu());

    header.append(title, status, menu);
    return header;
  }

  private renderToolbar(): HTMLElement {
    const bar = h('div', { class: 'panel__toolbar' });

    const back = iconButton('back', 'Back to tours');
    back.addEventListener('click', () => this.log.log('back to tour list (list view TODO)'));

    const side = iconButton('panelSide', 'Move panel (left/right)');
    side.addEventListener('click', () => {
      this.panelPosition = this.panelPosition === 'right' ? 'left' : 'right';
      this.render();
    });

    const cursor = iconButton(
      'cursor',
      this.picking ? 'Cancel picking' : 'Pick element for active step',
      this.picking ? 'iconbtn--active' : '',
    );
    cursor.addEventListener('click', () => this.togglePicking());

    bar.append(back, h('div', { class: 'spacer' }), side, cursor);
    return bar;
  }

  private renderTabs(): HTMLElement {
    const tabs = h('div', { class: 'tabs' });
    for (const [key, label] of [
      ['steps', 'Steps'],
      ['display', 'Display'],
      ['assets', 'Assets'],
    ] as const) {
      const tab = h('button', { class: `tab ${this.tab === key ? 'tab--active' : ''}`, type: 'button' }, [label]);
      tab.addEventListener('click', () => {
        this.tab = key;
        // Entering Display: focus a step whose target is actually on the page,
        // so there is something to frame while tuning the spacing.
        if (key === 'display') this.selectFirstResolvableStep();
        this.render();
      });
      tabs.append(tab);
    }
    return tabs;
  }

  /** Activate the first step whose selector resolves to an on-page element. */
  private selectFirstResolvableStep(): void {
    const found = this.tour.steps.find((s) => this.resolveTarget(s) !== null);
    if (found) this.activeStepId = found.id;
  }

  /** The Display tab: tune the tour-level outline spacing with live feedback. */
  private renderDisplaySettings(): HTMLElement {
    const wrap = h('div', { class: 'settings' });

    if (!this.activeStep || !this.resolveTarget(this.activeStep)) {
      wrap.append(
        h('div', { class: 'assets-empty' }, [
          'Give a step a selector first — then its target frames here so you can tune the spacing.',
        ]),
      );
      return wrap;
    }

    const value = h('span', { class: 'settings__value' }, [`${this.tour.display.padding}px`]);
    const slider = h('input', {
      class: 'settings__slider',
      type: 'range',
      min: '0',
      max: '40',
      step: '1',
    }) as HTMLInputElement;
    slider.value = String(this.tour.display.padding);
    slider.addEventListener('input', () => {
      this.tour.display.padding = Number(slider.value);
      value.textContent = `${this.tour.display.padding}px`;
      this.updateHighlight();
    });

    const field = h('div', { class: 'settings__field' });
    field.append(
      h('label', { class: 'settings__label' }, ['Outline spacing']),
      (() => {
        const row = h('div', { class: 'settings__row' });
        row.append(slider, value);
        return row;
      })(),
    );
    wrap.append(
      field,
      h('div', { class: 'settings__hint' }, [
        'Applied everywhere the target is framed — the builder outline and the live tour spotlight.',
      ]),
    );
    return wrap;
  }

  private renderBody(): HTMLElement {
    const body = h('div', { class: 'panel__body' });
    if (this.tab === 'assets') {
      body.append(h('div', { class: 'assets-empty' }, ['Assets — coming soon']));
      return body;
    }
    if (this.tab === 'display') {
      body.append(this.renderDisplaySettings());
      return body;
    }
    const list = h('div', { class: 'steps' });
    // A connector (line + "+") before the first card, then each card followed
    // by another connector, so the author can insert anywhere.
    list.append(this.renderConnector(-1));
    this.tour.steps.forEach((step, i) => {
      list.append(this.renderCard(step, i));
      list.append(this.renderConnector(i));
    });
    body.append(list);
    return body;
  }

  private renderConnector(afterIndex: number): HTMLElement {
    const c = h('div', { class: 'connector' });
    const add = h('button', { class: 'connector__add', title: 'Add step', type: 'button' }, ['+']);
    add.addEventListener('click', () => this.addStepAfter(afterIndex));
    c.append(h('div', { class: 'connector__line' }), add, h('div', { class: 'connector__line' }));
    return c;
  }

  private renderCard(step: DraftStep, index: number): HTMLElement {
    const isActive = step.id === this.activeStepId;
    const card = h('div', {
      class: `card ${isActive ? 'card--active' : ''} ${step.included ? '' : 'card--excluded'}`.trim(),
    });
    card.addEventListener('mousedown', () => this.setActive(step.id));

    card.append(this.renderCardControl(step, index), this.renderCardContent(step), this.renderCardFooter(step));
    return card;
  }

  private renderCardControl(step: DraftStep, index: number): HTMLElement {
    const row = h('div', { class: 'card__control' });

    const check = h('input', { class: 'card__check', type: 'checkbox', title: 'Include in tour' }) as HTMLInputElement;
    check.checked = step.included;
    check.addEventListener('change', () => {
      step.included = check.checked;
      this.render();
    });

    const idx = h('span', { class: 'card__index' }, [String(index + 1)]);
    const type = h('span', { class: 'card__type' });
    type.innerHTML = ICONS[step.type === 'action' ? 'bolt' : 'step'];
    type.append(document.createTextNode(step.type === 'action' ? 'Action' : 'Step'));

    const sel = step.selectors[0];
    const selEl = h('span', { class: `card__sel ${sel ? '' : 'card__sel--empty'}`.trim(), title: sel ?? '' }, [
      sel ?? 'no selector',
    ]);

    const del = iconButton('trash', 'Delete step');
    del.addEventListener('click', () => this.removeStep(step.id));

    row.append(check, idx, type, h('div', { class: 'spacer' }), selEl, del);
    return row;
  }

  private renderCardContent(step: DraftStep): HTMLElement {
    const content = h('div', {
      class: 'card__content',
      contenteditable: 'true',
      'data-placeholder': 'Write the step text…',
      'data-step': step.id,
    });
    content.textContent = step.content;
    // Live-save so a re-render (e.g. selecting another card) keeps the text.
    content.addEventListener('input', () => {
      step.content = content.textContent ?? '';
    });
    // Clicking the text of an inactive card activates it (which re-renders);
    // remember to restore focus/caret to this step's content afterwards.
    content.addEventListener('mousedown', () => {
      if (this.activeStepId !== step.id) this.focusStepId = step.id;
    });
    return content;
  }

  private renderCardFooter(step: DraftStep): HTMLElement {
    const footer = h('div', { class: 'card__footer' });
    footer.append(
      this.renderEditableButton(step, 'backLabel'),
      this.renderEditableButton(step, 'nextLabel'),
    );
    return footer;
  }

  /** A footer button that turns into a text input when clicked, to edit its label. */
  private renderEditableButton(step: DraftStep, key: 'backLabel' | 'nextLabel'): HTMLElement {
    const btn = h('button', { class: 'cardbtn', type: 'button' }, [step[key]]);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const input = h('input', { class: 'cardbtn cardbtn--edit', value: step[key] }) as HTMLInputElement;
      input.value = step[key];
      btn.replaceWith(input);
      input.focus();
      input.select();
      const commit = (): void => {
        step[key] = input.value.trim() || (key === 'backLabel' ? 'Back' : 'Next');
        input.replaceWith(this.renderEditableButton(step, key));
      };
      input.addEventListener('blur', commit);
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') input.blur();
        if (ev.key === 'Escape') {
          input.value = step[key];
          input.blur();
        }
      });
    });
    return btn;
  }

  // ---------- misc ----------

  private openMenu(): void {
    const result = this.export();
    const json = result.ok ? JSON.stringify(result.tour, null, 2) : `INVALID:\n${result.errors.join('\n')}`;
    this.log.log('tour JSON', json);
    // Minimal menu action for now: dump/export the tour JSON.
    window.prompt('Tour JSON (copy):', result.ok ? JSON.stringify(result.tour) : '');
  }

  /** Focus a card's content area and place the caret at the end. */
  private focusContent(stepId: string): void {
    const el = this.root?.querySelector<HTMLElement>(`.card__content[data-step="${stepId}"]`);
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}
