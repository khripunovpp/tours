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
import { createPicker, createPlayer, createLogger, placeCard, renderCard, CARD_STYLES } from '@tours/core';
import type { PickerHandle, PlayerHandle } from '@tours/core';
import { EDITOR_STYLES } from './styles.js';
import { ICONS } from './icons.js';
import {
  createDraftStep,
  createDraftTour,
  cloneDraft,
  toTour,
  type CardType,
  type DraftStep,
  type DraftTour,
  type TourKind,
} from './state.js';
import { createLocalStore, type DraftStore } from './storage.js';

export type NavPosition = 'top' | 'bottom';
export type PanelPosition = 'left' | 'right';
type Mode = 'build' | 'preview';
type Tab = 'steps' | 'display' | 'assets';
type DisplaySub = 'tour' | 'card';
type PanelView = 'list' | 'edit';

export interface TourBuilderOptions {
  /** Start mounted in edit mode. Default: true. */
  mode?: 'edit' | 'off';
  navPosition?: NavPosition;
  panelPosition?: PanelPosition;
  /** URL query flag that auto-mounts the builder (used by `fromUrl`). */
  urlFlag?: string;
  /**
   * Secondary persistence strategy, always tried in addition to localStorage
   * (e.g. `createWordPressStore(...)`). Failures are logged, not fatal.
   */
  storage?: DraftStore;
  /** localStorage key for the default store. */
  storageKey?: string;
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

  private tours: DraftTour[] = [createDraftTour()];
  private openTourId: string = this.tours[0].id;
  private view: PanelView = 'edit';
  /** Which kind the list view shows (tours vs templates). */
  private listFilter: TourKind = 'tour';
  /** Whether the tour ⋯ dropdown menu is open. */
  private menuOpen = false;
  private activeStepId: string | null = this.tours[0].steps[0]?.id ?? null;
  private tab: Tab = 'steps';
  private displaySub: DisplaySub = 'tour';
  /** Which card-settings accordion sections are expanded (by key). */
  private readonly openSections = new Set<string>();
  private mode: Mode = 'build';
  private navPosition: NavPosition;
  private panelPosition: PanelPosition;

  private picker: PickerHandle | null = null;
  private picking = false;
  private player: PlayerHandle | null = null;
  /** Dashed outline over the active step's target element (no backdrop). */
  private highlight: HTMLElement | null = null;
  /** Live preview of the visitor tooltip card, shown in the Card sub-tab. */
  private cardPreview: HTMLElement | null = null;
  /** Step whose content should regain focus after the next render. */
  private focusStepId: string | null = null;
  private readonly onViewportChange = (): void => this.updateOverlays();

  /** Default store (always written) and the optional secondary strategy. */
  private readonly local: DraftStore;
  private readonly secondary: DraftStore | null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly options: TourBuilderOptions = {}) {
    this.navPosition = options.navPosition ?? 'bottom';
    this.panelPosition = options.panelPosition ?? 'right';
    this.local = createLocalStore(options.storageKey);
    this.secondary = options.storage ?? null;
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
    style.textContent = EDITOR_STYLES + CARD_STYLES;
    this.root.appendChild(style);
    // The highlight is created once and survives re-renders (render() only
    // rebuilds .panel/.nav), so it can track the target smoothly. The card
    // preview is rebuilt on demand via the shared renderCard.
    this.highlight = h('div', { class: 'highlight' });
    this.root.append(this.highlight);
    document.body.appendChild(this.host);
    // Keep the outline glued to the target as the page scrolls or resizes.
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange, true);
    this.log.log('mounted');
    this.render();
    void this.hydrate();
  }

  /** Load stored drafts (localStorage by default) and show them. */
  private async hydrate(): Promise<void> {
    const stored = await this.local.load();
    if (!stored || stored.length === 0) return;
    this.tours = stored;
    this.openTourId = stored[0].id;
    this.activeStepId = stored[0].steps[0]?.id ?? null;
    this.log.log('hydrated', `${stored.length} tour(s)`);
    this.render();
  }

  /** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
  private markDirty(): void {
    if (this.saveTimer !== null) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.persist();
    }, 400);
  }

  /** Always write localStorage; also try the secondary strategy best-effort. */
  private async persist(): Promise<void> {
    const snapshot = this.tours;
    await this.local.save(snapshot);
    if (this.secondary) {
      try {
        await this.secondary.save(snapshot);
      } catch (err) {
        this.log.warn('secondary store save failed (localStorage kept the draft)', err);
      }
    }
  }

  /** Remove the UI and any active picker/player. */
  destroy(): void {
    this.stopPicking();
    this.player?.stop();
    this.player = null;
    // Flush any pending debounced save before tearing down.
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
      void this.persist();
    }
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange, true);
    if (this.host?.parentNode) this.host.parentNode.removeChild(this.host);
    this.host = null;
    this.root = null;
    this.highlight = null;
    this.cardPreview = null;
  }

  /** The current draft as a validated tour (or validation errors). */
  export(): ReturnType<typeof toTour> {
    return toTour(this.tour);
  }

  // ---------- state mutations ----------

  /** The currently open tour (falls back to the first if the id is stale). */
  private get tour(): DraftTour {
    return this.tours.find((t) => t.id === this.openTourId) ?? this.tours[0];
  }

  private get activeStep(): DraftStep | null {
    return this.tour.steps.find((s) => s.id === this.activeStepId) ?? null;
  }

  /** Open a tour for editing and reset the active step to its first. */
  private openTour(id: string): void {
    this.openTourId = id;
    this.view = 'edit';
    this.tab = 'steps';
    this.activeStepId = this.tour.steps[0]?.id ?? null;
    this.render();
  }

  /** Create a fresh entity of the currently listed kind (tour or template). */
  private createEntity(): void {
    const entity = createDraftTour(this.listFilter);
    this.tours.push(entity);
    this.openTour(entity.id);
  }

  private deleteEntity(id: string): void {
    const i = this.tours.findIndex((t) => t.id === id);
    if (i === -1) return;
    this.tours.splice(i, 1);
    // Never leave zero tours — seed a fresh one (templates may all be removed).
    if (!this.tours.some((t) => t.kind === 'tour')) this.tours.push(createDraftTour());
    if (this.openTourId === id) this.openTourId = this.tours[0].id;
    this.render();
  }

  /** Copy the open tour into a new template and jump to the Templates list. */
  private saveAsTemplate(): void {
    const tpl = cloneDraft(this.tour, 'template', `${this.tour.name} (template)`);
    this.tours.push(tpl);
    this.listFilter = 'template';
    this.view = 'list';
    this.menuOpen = false;
    this.log.log('saved as template', tpl.id);
    this.render();
  }

  /** Create a new tour from a template and open it for editing. */
  private createFromTemplate(id: string): void {
    const tpl = this.tours.find((t) => t.id === id);
    if (!tpl) return;
    const tour = cloneDraft(tpl, 'tour', tpl.name.replace(/\s*\(template\)\s*$/, ''));
    this.tours.push(tour);
    this.openTour(tour.id);
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
    this.updateOverlays();
    this.markDirty();
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
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  private updateOverlays(): void {
    const box = this.highlight;
    if (!box) return;
    const hideAll = (): void => {
      box.style.display = 'none';
      this.removeCardPreview();
    };
    if (this.view !== 'edit' || this.mode !== 'build' || this.picking) return hideAll();
    const step = this.activeStep;
    const target = step && step.selectors.length > 0 ? this.resolveTarget(step) : null;
    if (!step || !target) return hideAll();

    const rect = target.getBoundingClientRect();
    const { padding, radius, cardRadius } = this.tour.display;

    // Outline. In the Display tab it turns amber to signal "tuning" mode.
    box.className = `highlight ${this.tab === 'display' ? 'highlight--settings' : ''}`.trim();
    box.style.display = 'block';
    box.style.left = `${rect.left - padding}px`;
    box.style.top = `${rect.top - padding}px`;
    box.style.width = `${rect.width + padding * 2}px`;
    box.style.height = `${rect.height + padding * 2}px`;
    box.style.borderRadius = `${radius}px`;

    // The step's own card (the visitor tooltip), drawn as soon as there is
    // something to show — at least some content.
    this.drawStepCard(step, rect, cardRadius);
  }

  private removeCardPreview(): void {
    if (this.cardPreview) {
      this.cardPreview.remove();
      this.cardPreview = null;
    }
  }

  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  private drawStepCard(step: DraftStep, rect: DOMRect, cardRadius: number): void {
    const content = step.content.trim();
    const tuningCard = this.tab === 'display' && this.displaySub === 'card';
    if (!content && !tuningCard) {
      this.removeCardPreview();
      return;
    }

    const steps = this.tour.steps;
    const index = steps.indexOf(step);
    const goto = (to: number) => (): void => {
      const neighbour = steps[to];
      if (neighbour) this.setActive(neighbour.id);
    };
    const card = renderCard({
      ghost: true,
      contentText: content || 'Step tooltip preview',
      progress: `Step ${index + 1} of ${steps.length}`,
      showClose: true,
      onClose: () => {
        this.activeStepId = null;
        this.render();
      },
      radius: cardRadius,
      back: { label: step.backLabel, disabled: index <= 0, onClick: goto(index - 1) },
      next: { label: step.nextLabel, primary: true, disabled: index >= steps.length - 1, onClick: goto(index + 1) },
    });
    if (!content) {
      const body = card.querySelector<HTMLElement>('.tours-card__content');
      if (body) body.style.opacity = '0.55';
    }

    this.removeCardPreview();
    this.cardPreview = card;
    this.root?.appendChild(card);

    // Measure from the outline (target inflated by the padding), matching the
    // player, so alignment/offset are relative to the visible frame.
    const pad = this.tour.display.padding;
    const framed = {
      top: rect.top - pad,
      left: rect.left - pad,
      right: rect.right + pad,
      bottom: rect.bottom + pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
    const { top, left } = placeCard({
      target: framed,
      card: { width: card.offsetWidth, height: card.offsetHeight },
      side: step.placement,
      align: step.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
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
    if (this.view === 'list') {
      panel.append(this.renderListHeader(), this.renderList());
    } else {
      panel.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody());
    }
    return panel;
  }

  private renderListHeader(): HTMLElement {
    const header = h('div', { class: 'panel__header' });

    // Tours / Templates switch — active one in the accent colour.
    const tabs = h('div', { class: 'listtabs' });
    for (const [kind, label] of [['tour', 'Tours'], ['template', 'Templates']] as const) {
      const t = h('button', {
        class: `listtab ${this.listFilter === kind ? 'listtab--active' : ''}`.trim(),
        type: 'button',
      }, [label]);
      t.addEventListener('click', () => {
        this.listFilter = kind;
        this.render();
      });
      tabs.append(t);
    }

    const add = h('button', { class: 'newtour', type: 'button', title: 'New' }, ['+ New']);
    add.addEventListener('click', () => this.createEntity());

    header.append(tabs, add);
    return header;
  }

  private renderList(): HTMLElement {
    const body = h('div', { class: 'panel__body' });
    const list = h('div', { class: 'tourlist' });
    const items = this.tours.filter((t) => t.kind === this.listFilter);

    if (items.length === 0) {
      body.append(
        h('div', { class: 'assets-empty' }, [
          this.listFilter === 'template' ? 'No templates yet.' : 'No tours yet.',
        ]),
      );
      return body;
    }

    items.forEach((t) => {
      const row = h('div', { class: 'tourrow' });
      row.addEventListener('click', () => this.openTour(t.id));

      const main = h('div', { class: 'tourrow__main' });
      main.append(
        h('div', { class: 'tourrow__name' }, [t.name]),
        h('div', { class: 'tourrow__meta' }, [
          `${t.steps.length} step${t.steps.length === 1 ? '' : 's'}`,
        ]),
      );
      row.append(main);

      // Templates get a "Use" action to spawn a tour from them.
      if (t.kind === 'template') {
        const use = h('button', { class: 'tourrow__use', type: 'button', title: 'Create a tour from this template' }, ['Use']);
        use.addEventListener('click', (e) => {
          e.stopPropagation();
          this.createFromTemplate(t.id);
        });
        row.append(use);
      } else {
        row.append(h('span', { class: `status status--${t.status}` }, [t.status]));
      }

      const del = iconButton('trash', 'Delete');
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteEntity(t.id);
      });
      row.append(del);
      list.append(row);
    });
    body.append(list);
    return body;
  }

  private renderHeader(): HTMLElement {
    const header = h('div', { class: 'panel__header' });

    const title = h('input', { class: 'panel__title', value: this.tour.name });
    (title as HTMLInputElement).value = this.tour.name;
    title.addEventListener('change', () => {
      this.tour.name = (title as HTMLInputElement).value.trim() || 'Untitled tour';
      this.markDirty();
    });

    const status = h('span', { class: `status status--${this.tour.status}` }, [this.tour.status]);
    status.addEventListener('click', () => {
      this.tour.status = this.tour.status === 'draft' ? 'published' : 'draft';
      this.render();
    });
    status.setAttribute('title', 'Toggle status');
    (status as HTMLElement).style.cursor = 'pointer';

    const menu = iconButton('menu', 'Menu', this.menuOpen ? 'iconbtn--active' : '');
    menu.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;
      this.render();
    });

    header.append(title, status, menu);
    if (this.menuOpen) header.append(this.renderMenu());
    return header;
  }

  /** The ⋯ dropdown: save-as-template (tours only) and JSON export. */
  private renderMenu(): HTMLElement {
    const menu = h('div', { class: 'menu' });
    const item = (label: string, onClick: () => void): HTMLElement => {
      const b = h('button', { class: 'menu__item', type: 'button' }, [label]);
      b.addEventListener('click', () => {
        this.menuOpen = false;
        onClick();
      });
      return b;
    };
    if (this.tour.kind === 'tour') {
      menu.append(item('Save as template', () => this.saveAsTemplate()));
    }
    menu.append(item('Export JSON', () => this.exportJson()));
    return menu;
  }

  private exportJson(): void {
    const result = this.export();
    this.log.log('tour JSON', result);
    window.prompt('Tour JSON (copy):', result.ok ? JSON.stringify(result.tour) : result.errors.join('; '));
    this.render();
  }

  private renderToolbar(): HTMLElement {
    const bar = h('div', { class: 'panel__toolbar' });

    const back = iconButton('back', 'Back to tours');
    back.addEventListener('click', () => {
      this.stopPicking();
      this.view = 'list';
      this.render();
    });

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

  /**
   * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
   * target outline) and Card (the visitor tooltip) — tuned live.
   */
  private renderDisplaySettings(): HTMLElement {
    const wrap = h('div', { class: 'settings' });

    // Sub-tab switcher.
    const subs = h('div', { class: 'subtabs' });
    for (const [key, label] of [['tour', 'Tour'], ['card', 'Card']] as const) {
      const b = h('button', { class: `subtab ${this.displaySub === key ? 'subtab--active' : ''}`, type: 'button' }, [label]);
      b.addEventListener('click', () => {
        this.displaySub = key;
        this.render();
      });
      subs.append(b);
    }
    wrap.append(subs);

    if (!this.activeStep || !this.resolveTarget(this.activeStep)) {
      wrap.append(
        h('div', { class: 'assets-empty' }, [
          'Give a step a selector first — then its target frames here so you can tune the look.',
        ]),
      );
      return wrap;
    }

    const d = this.tour.display;
    if (this.displaySub === 'tour') {
      wrap.append(
        this.slider('Outline spacing', d.padding, 0, 40, (v) => (d.padding = v)),
        this.slider('Outline corner radius', d.radius, 0, 40, (v) => (d.radius = v)),
        h('div', { class: 'settings__hint' }, [
          'The outline framing the target — applied in the builder and in the live tour spotlight.',
        ]),
      );
    } else {
      wrap.append(
        this.slider('Card corner radius', d.cardRadius, 0, 32, (v) => (d.cardRadius = v)),
        this.slider('Distance from target', d.offset, 0, 48, (v) => (d.offset = v)),
        this.slider('Alignment inset', d.alignOffset, 0, 48, (v) => (d.alignOffset = v)),
        h('div', { class: 'settings__hint' }, [
          'Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements).',
        ]),
      );
    }
    return wrap;
  }

  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  private slider(
    label: string,
    current: number,
    min: number,
    max: number,
    set: (value: number) => void,
  ): HTMLElement {
    let cur = current;
    const value = h('span', { class: 'settings__value', title: 'Click to type a value' }, [`${cur}px`]);
    const input = h('input', {
      class: 'settings__slider',
      type: 'range',
      min: String(min),
      max: String(max),
      step: '1',
    }) as HTMLInputElement;
    input.value = String(cur);

    // Single place to apply a new value: clamp, sync slider + label, persist.
    const apply = (n: number): void => {
      cur = Math.max(min, Math.min(max, Math.round(n)));
      input.value = String(cur);
      value.textContent = `${cur}px`;
      set(cur);
      this.updateOverlays();
      this.markDirty();
    };

    input.addEventListener('input', () => apply(Number(input.value)));
    // Click the number to type it directly (digits only).
    value.addEventListener('click', () => this.editNumber(value, cur, apply));

    const row = h('div', { class: 'settings__row' });
    row.append(input, value);
    const field = h('div', { class: 'settings__field' });
    field.append(h('label', { class: 'settings__label' }, [label]), row);
    return field;
  }

  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  private editNumber(valueEl: HTMLElement, current: number, apply: (n: number) => void): void {
    const input = h('input', {
      class: 'settings__num',
      type: 'text',
      inputmode: 'numeric',
    }) as HTMLInputElement;
    input.value = String(current);
    valueEl.replaceWith(input);
    input.focus();
    input.select();

    // Strip anything that is not a digit as the user types.
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
    });
    const commit = (): void => {
      const n = input.value === '' ? current : Number(input.value);
      input.replaceWith(valueEl);
      apply(n);
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') {
        input.value = String(current);
        input.blur();
      }
    });
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
    // Card-settings accordion sections, shown only for the active card.
    if (isActive) {
      card.append(this.section('placement', 'Card position', () => this.renderPlacementBody(step)));
    }
    return card;
  }

  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  private section(key: string, title: string, body: () => HTMLElement): HTMLElement {
    const open = this.openSections.has(key);
    const sec = h('div', { class: `acc ${open ? 'acc--open' : ''}`.trim() });

    const head = h('button', { class: 'acc__head', type: 'button' });
    const caret = h('span', { class: 'acc__caret' });
    caret.innerHTML = ICONS.chevron;
    head.append(caret, h('span', { class: 'acc__title' }, [title]));
    head.addEventListener('click', () => {
      if (open) this.openSections.delete(key);
      else this.openSections.add(key);
      this.render();
    });
    sec.append(head);
    if (open) sec.append(body());
    return sec;
  }

  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  private renderPlacementBody(step: DraftStep): HTMLElement {
    const wrap = h('div', { class: 'place' });

    const grid = h('div', { class: 'place__grid' });
    grid.append(h('div', { class: 'place__el' }));
    grid.append(h('div', { class: 'place__el' }));

    // Anchor coordinates (px) inside the grid, matching .place__el's edges.
    const anchors: Array<{ side: DraftStep['placement']; align: DraftStep['align']; x: number; y: number }> = [
      { side: 'top', align: 'start', x: 40, y: 16 },
      { side: 'top', align: 'center', x: 66, y: 16 },
      { side: 'top', align: 'end', x: 92, y: 16 },
      { side: 'bottom', align: 'start', x: 40, y: 80 },
      { side: 'bottom', align: 'center', x: 66, y: 80 },
      { side: 'bottom', align: 'end', x: 92, y: 80 },
      { side: 'left', align: 'start', x: 24, y: 32 },
      { side: 'left', align: 'center', x: 24, y: 48 },
      { side: 'left', align: 'end', x: 24, y: 64 },
      { side: 'right', align: 'start', x: 108, y: 32 },
      { side: 'right', align: 'center', x: 108, y: 48 },
      { side: 'right', align: 'end', x: 108, y: 64 },
    ];
    for (const a of anchors) {
      const on = step.placement === a.side && step.align === a.align;
      const dot = h('button', {
        class: `place__dot ${on ? 'place__dot--active' : ''}`.trim(),
        type: 'button',
        title: `${a.side} · ${a.align}`,
      });
      dot.style.left = `${a.x - 6}px`;
      dot.style.top = `${a.y - 6}px`;
      dot.addEventListener('click', () => {
        step.placement = a.side;
        step.align = a.align;
        this.render();
      });
      grid.append(dot);
    }
    wrap.append(grid);

    // Auto toggle sits below the grid.
    const auto = h('button', {
      class: `place__auto ${step.placement === 'auto' ? 'place__auto--active' : ''}`.trim(),
      type: 'button',
      title: 'Pick the side with the most room automatically',
    }, ['Auto']);
    auto.addEventListener('click', () => {
      step.placement = 'auto';
      this.render();
    });
    wrap.append(auto);
    return wrap;
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
      this.updateOverlays();
      this.markDirty();
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
        this.markDirty();
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
