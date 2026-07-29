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
import { createPicker, createPlayer, createLogger, placeCard, renderCard, resolveElement, matchUrl, deriveUrl, CARD_STYLES } from '@tours/core';
import type { PickerHandle, PlayerHandle } from '@tours/core';
import { EDITOR_STYLES } from './styles.js';
import { ICONS } from './icons.js';
import {
  createDraftStep,
  createDraftTour,
  cloneDraft,
  toTour,
  compileTour,
  importDrafts,
  type CardType,
  type DraftStep,
  type DraftTour,
  type TourKind,
  type Audience,
  type Trigger,
} from './state.js';
import { createLocalStore, type DraftStore } from './storage.js';
import { sitePages, matchPages, toPageGlob } from './sitemap.js';

/**
 * URL query param that carries builder resume state across a cross-page
 * navigation: `<mode>~<tourId>~<stepId>`. The builder reads and strips it on
 * mount to reopen the tour on the right step (and, in preview, resume playback).
 */
const RESUME_PARAM = 'tours-resume';

export type NavPosition = 'top' | 'bottom';
export type PanelPosition = 'left' | 'right';
type Mode = 'build' | 'preview';
type Tab = 'steps' | 'styles' | 'rules';
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
   * Extra top offset in px, added above the panel and a top-positioned nav —
   * e.g. to clear a host's fixed bar (the WordPress admin bar).
   */
  topOffset?: number;
  /**
   * Primary draft store. Defaults to localStorage; pass a different backend
   * (e.g. a chrome.storage store in an extension) to persist across origins.
   */
  store?: DraftStore;
  /**
   * Secondary persistence strategy, always tried in addition to the primary
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

/** Hint text explaining the selected trigger. */
function triggerHint(type: Trigger['type']): string {
  switch (type) {
    case 'load':
      return 'Starts automatically as soon as a matching page loads.';
    case 'selector':
      return 'Starts when an element matching the selector appears in the page (waits for it).';
    case 'timer':
      return 'Starts after the delay elapses on a matching page.';
    case 'cta':
      return 'Shows a small invitation in a corner; its button starts the tour.';
    case 'manual':
    default:
      return 'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.';
  }
}

/** A fresh trigger of the given type with sensible defaults. */
function defaultTrigger(type: Trigger['type']): Trigger {
  switch (type) {
    case 'load':
      return { type: 'load' };
    case 'selector':
      return { type: 'selector', selector: '' };
    case 'timer':
      return { type: 'timer', delay: 3000 };
    case 'cta':
      return { type: 'cta', text: 'Need a hand getting started?', button: 'Start tour', corner: 'bottom-right', offset: 24 };
    default:
      return { type: 'manual' };
  }
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
  /**
   * Append the picked candidates instead of replacing the step's list. Used by
   * the selector editor, where the point is to add a fallback rather than start
   * over.
   */
  private pickAppend = false;
  /** Step whose selector list is open in the editor popover, if any. */
  private selectorEditorFor: string | null = null;
  /** Step whose page matcher is open in the editor popover, if any. */
  private pageEditorFor: string | null = null;
  /** Pages advertised by the site's sitemap; null until the fetch resolves. */
  private pages: string[] | null = null;
  /** What the author has typed into the page autocomplete. */
  private pageQuery = '';
  /** Index being dragged in the selector list, while a drag is in progress. */
  private dragFrom: number | null = null;
  private player: PlayerHandle | null = null;
  /** Dashed outline over the active step's target element (no backdrop). */
  private highlight: HTMLElement | null = null;
  /** Live preview of the visitor tooltip card, shown in the Card sub-tab. */
  private cardPreview: HTMLElement | null = null;
  /** Step whose content should regain focus after the next render. */
  private focusStepId: string | null = null;
  private readonly onViewportChange = (): void => this.updateOverlays(true);

  /** Default store (always written) and the optional secondary strategy. */
  private readonly local: DraftStore;
  private readonly secondary: DraftStore | null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly topOffset: number;

  constructor(private readonly options: TourBuilderOptions = {}) {
    this.navPosition = options.navPosition ?? 'bottom';
    this.panelPosition = options.panelPosition ?? 'right';
    this.topOffset = Math.max(0, options.topOffset ?? 0);
    this.local = options.store ?? createLocalStore(options.storageKey);
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
    // Extra top offset (e.g. to clear the WordPress admin bar), read by the CSS.
    this.host.style.setProperty('--e-top', `${this.topOffset}px`);
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
    if (stored && stored.length > 0) {
      this.tours = stored;
      this.openTourId = stored[0].id;
      this.activeStepId = stored[0].steps[0]?.id ?? null;
      this.log.log('hydrated', `${stored.length} tour(s)`);
    }
    // Continue a cross-page navigation if one is pending; else just re-render.
    if (!this.applyResume()) this.render();
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
    // New steps belong to the page they were created on (multi-page authoring).
    step.page = this.currentPage();
    this.tour.steps.splice(index + 1, 0, step);
    this.activeStepId = step.id;

    // A fresh step has no target yet, and picking one is always the next thing
    // the author does — so arm the picker and bring the new card into view,
    // instead of making them find the card and press the crosshair.
    //
    // Only 'step' cards frame an element; an 'action' card has no target.
    if (type === 'step' && !this.picking) {
      // togglePicking() renders for us. Rendering twice would be wasted work,
      // and would drop the scroll below since render() rebuilds the panel.
      this.togglePicking();
    } else {
      this.render();
    }
    this.revealStep(step.id);
  }

  /** Scroll the panel so a step's card is visible. Runs after render(). */
  private revealStep(id: string): void {
    const card = this.root?.querySelector<HTMLElement>(`.card[data-step-id="${CSS.escape(id)}"]`);
    if (!card) return;
    const body = card.closest<HTMLElement>('.panel__body');

    // Appended at the end: scroll the container to its true bottom. Every card
    // is followed by a connector, and the body has bottom padding, so
    // `scrollIntoView` stops as soon as the card's edge is in view and leaves
    // both of those below the fold — which reads as "it didn't scroll all the
    // way".
    if (body && this.tour.steps[this.tour.steps.length - 1]?.id === id) {
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
      return;
    }
    // Inserted in the middle — move as little as possible. `nearest` scrolls
    // only the panel body, never the host page underneath.
    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /** A URL glob for the current page (matches its query/hash variations). */
  private currentPage(): string {
    return `${window.location.origin}${window.location.pathname}*`;
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

  private togglePicking(append = false): void {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const step = this.activeStep;
    if (!step) return;
    this.picking = true;
    this.pickAppend = append;
    this.picker = createPicker(
      (selectors) => {
        if (this.pickAppend) {
          // Every candidate for the picked element is a useful fallback, so the
          // whole ranked list is added — minus anything already listed.
          for (const s of selectors) if (!step.selectors.includes(s)) step.selectors.push(s);
        } else {
          step.selectors = selectors;
        }
        // The element was picked on this page — bind the step to it.
        if (!step.page) step.page = this.currentPage();
        this.picking = false;
        this.pickAppend = false;
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
    this.pickAppend = false;
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
    this.startPreview();
  }

  /**
   * Enter preview mode, optionally starting at a given step id (used when
   * resuming after a cross-page navigation). The id is resolved against the
   * compiled tour, whose step set can differ from the draft. Returns false if
   * the draft is invalid.
   */
  private startPreview(startStepId?: string): boolean {
    const result = this.export();
    if (!result.ok) {
      this.log.warn('cannot preview — draft is invalid', result.errors);
      if (!startStepId) {
        window.alert(`Add a selector and text to at least one step first:\n\n${result.errors.join('\n')}`);
      }
      return false;
    }
    this.mode = 'preview';
    this.render();
    // In preview, a cross-page Next reloads the page. Tag the destination URL
    // so the builder re-mounts and resumes preview at the right step.
    this.player = createPlayer(result.tour, {
      onNavigate: (url, stepId) => this.navigateForResume(url, stepId, 'preview'),
      // The player refuses to start while the builder is mounted, so that a
      // host app's own tours do not stack under it. This preview *is* the
      // builder, so it opts out.
      allowWhileEditing: true,
    });
    const start = startStepId ? result.tour.steps.findIndex((s) => s.id === startStepId) : 0;
    this.player.start(Math.max(0, start));
    return true;
  }

  /**
   * Flush the draft, then navigate to `url` with a resume token so the builder
   * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
   * the page reloads. Used for cross-page Next in both build and preview.
   */
  private async navigateForResume(url: string, stepId: string, mode: Mode): Promise<void> {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    await this.persist(); // ensure the reloaded page reads the latest edits
    const target = new URL(url, window.location.href);
    target.searchParams.set(RESUME_PARAM, `${mode}~${this.openTourId}~${stepId}`);
    this.log.log('navigating for resume', target.toString());
    window.location.assign(target.toString());
  }

  /**
   * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
   * the referenced step and, for preview, restart playback there. Strips the
   * param so a manual refresh will not re-trigger it. Returns true when it
   * handled a resume (and rendered), false to let the caller render normally.
   */
  private applyResume(): boolean {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(RESUME_PARAM);
    if (!raw) return false;
    params.delete(RESUME_PARAM);
    const query = params.toString();
    const clean = window.location.pathname + (query ? `?${query}` : '') + window.location.hash;
    window.history.replaceState(window.history.state, '', clean);

    const [mode, tourId, stepId] = raw.split('~');
    const tour = this.tours.find((t) => t.id === tourId);
    if (!tour) return false;
    this.openTourId = tour.id;
    this.view = 'edit';
    this.activeStepId = stepId;
    if (mode === 'preview' && this.startPreview(stepId)) return true;
    this.tab = 'steps';
    this.render();
    return true;
  }

  // ---------- rendering ----------

  private render(): void {
    if (!this.root) return;
    // The panel is rebuilt wholesale below, and `.panel__body` is the scroll
    // container — so without this every re-render silently jumps the list back
    // to the top. That bites hardest right after picking an element, which
    // re-renders while the author is reading a card halfway down the list.
    const scrollTop = this.root.querySelector('.panel__body')?.scrollTop ?? 0;

    // Clear everything except the <style> element.
    this.root.querySelectorAll('.panel, .nav').forEach((n) => n.remove());
    if (this.mode === 'build') this.root.appendChild(this.renderPanel());
    this.root.appendChild(this.renderNav());

    const body = this.root.querySelector('.panel__body');
    // Restore instantly: this is meant to look like the list never moved.
    if (body && scrollTop) body.scrollTop = scrollTop;

    if (this.focusStepId) {
      this.focusContent(this.focusStepId);
      this.focusStepId = null;
    }
    this.updateOverlays();
    this.markDirty();
  }

  /** Resolve a step's target on the page, trying each candidate selector. */
  private resolveTarget(step: DraftStep): Element | null {
    return resolveElement(step.selectors);
  }

  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  private updateOverlays(fast = false): void {
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
    box.className = `highlight ${this.tab === 'styles' ? 'highlight--settings' : ''}`.trim();
    // Animate only when moving between steps; track the target instantly on scroll.
    box.style.transitionDuration = fast ? '0ms' : '';
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
    const tuningCard = this.tab === 'styles' && this.displaySub === 'card';
    if (!content && !tuningCard) {
      this.removeCardPreview();
      return;
    }

    const steps = this.tour.steps;
    const index = steps.indexOf(step);
    const goto = (to: number) => (): void => {
      const neighbour = steps[to];
      if (!neighbour) return;
      // If the neighbour lives on another page, redirect there (and resume the
      // builder on that step) — mirroring how the tour behaves for a visitor.
      if (neighbour.page && !matchUrl({ glob: neighbour.page }, window.location.href)) {
        const url = deriveUrl({ glob: neighbour.page });
        if (url) {
          void this.navigateForResume(url, neighbour.id, 'build');
          return;
        }
      }
      this.setActive(neighbour.id);
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

    const download = iconButton('download', `Download all ${this.listFilter === 'template' ? 'templates' : 'tours'} as JSON`);
    download.addEventListener('click', () => this.downloadAll());

    const upload = iconButton('upload', 'Import tours from JSON');
    upload.addEventListener('click', () => this.importJson());

    const add = h('button', { class: 'newtour', type: 'button', title: 'New' }, ['+ New']);
    add.addEventListener('click', () => this.createEntity());

    header.append(tabs, download, upload, add);
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

  /** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
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
    menu.append(item('Download JSON', () => this.downloadOpenTour()));
    menu.append(item('Import JSON…', () => this.importJson()));
    return menu;
  }

  /** Download the given drafts as a schema Tour[] JSON file. */
  private downloadJson(drafts: DraftTour[], filename: string): void {
    const tours = drafts.map((d) => compileTour(d));
    const blob = new Blob([JSON.stringify(tours, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.log.log('downloaded', filename, `${tours.length} tour(s)`);
  }

  /** Slugify a name into a safe file base (fallback to a generic name). */
  private fileBase(name: string): string {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug || 'tours';
  }

  /** Download just the currently open tour (as an array of one). */
  private downloadOpenTour(): void {
    this.downloadJson([this.tour], `${this.fileBase(this.tour.name)}.json`);
  }

  /** Download every tour of the kind currently listed (Tours or Templates). */
  private downloadAll(): void {
    const drafts = this.tours.filter((t) => t.kind === this.listFilter);
    if (drafts.length === 0) return;
    this.downloadJson(drafts, `${this.listFilter === 'template' ? 'templates' : 'tours'}.json`);
  }

  /**
   * Prompt for a JSON file and merge its tours into the builder. A tour with an
   * id that already exists is replaced; new ids are appended. When an open tour
   * is being edited it stays open (if it survived the import).
   */
  private importJson(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then((text) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          window.alert('Could not read that file — it is not valid JSON.');
          return;
        }
        const drafts = importDrafts(parsed);
        if (drafts.length === 0) {
          window.alert('No tours found in that file.');
          return;
        }
        this.mergeDrafts(drafts);
      });
    });
    input.click();
  }

  /** Merge imported drafts by id (replace existing, append new) and re-render. */
  private mergeDrafts(drafts: DraftTour[]): void {
    for (const d of drafts) {
      const i = this.tours.findIndex((t) => t.id === d.id);
      if (i === -1) this.tours.push(d);
      else this.tours[i] = d;
    }
    // Keep the open tour open if it still exists; otherwise fall back.
    if (!this.tours.some((t) => t.id === this.openTourId)) {
      this.openTourId = this.tours[0].id;
      this.activeStepId = this.tour.steps[0]?.id ?? null;
    }
    this.log.log('imported', `${drafts.length} tour(s)`);
    this.render();
    void this.persist();
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
      ['styles', 'Styles'],
      ['rules', 'Rules'],
    ] as const) {
      const tab = h('button', { class: `tab ${this.tab === key ? 'tab--active' : ''}`, type: 'button' }, [label]);
      tab.addEventListener('click', () => {
        this.tab = key;
        // Entering Styles: focus a step whose target is actually on the page,
        // so there is something to frame while tuning the look.
        if (key === 'styles') this.selectFirstResolvableStep();
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
    if (this.tab === 'styles') {
      body.append(this.renderDisplaySettings());
      return body;
    }
    if (this.tab === 'rules') {
      body.append(this.renderRulesBody());
      return body;
    }

    // Selector editor sits over the list rather than inside a card, so it stays
    // readable regardless of how far down the step is.
    const editing = this.selectorEditorFor
      ? this.tour.steps.find((s) => s.id === this.selectorEditorFor)
      : undefined;
    if (editing) body.append(this.renderSelectorEditor(editing));
    else if (this.selectorEditorFor) this.selectorEditorFor = null;

    const pageEditing = this.pageEditorFor
      ? this.tour.steps.find((s) => s.id === this.pageEditorFor)
      : undefined;
    if (pageEditing) body.append(this.renderPageEditor(pageEditing));
    else if (this.pageEditorFor) this.pageEditorFor = null;

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

  /** Rules tab: start trigger, audience, and auto-start conditions. */
  private renderRulesBody(): HTMLElement {
    const wrap = h('div', { class: 'settings' });
    const t = this.tour;

    wrap.append(
      this.selectField(
        'Audience',
        t.audience,
        [
          ['all', 'Everyone'],
          ['auth', 'Logged-in users only'],
          ['guest', 'Logged-out visitors only'],
        ],
        (v) => {
          t.audience = v as Audience;
          this.markDirty();
        },
      ),
      this.selectField(
        'Start trigger',
        t.trigger.type,
        [
          ['manual', 'Manual (shortcode / attribute)'],
          ['load', 'On page load'],
          ['selector', 'When an element appears'],
          ['timer', 'After a delay'],
          ['cta', 'Corner invitation (popover)'],
        ],
        (v) => {
          t.trigger = defaultTrigger(v as Trigger['type']);
          this.markDirty();
          this.render();
        },
      ),
    );

    // What the × does. Sits next to the trigger because the two bracket the
    // tour's life: how it opens, and what closing it means.
    wrap.append(
      this.selectField(
        'Closing the tour',
        t.dismissMode,
        [
          ['end', 'Ends it — progress is cleared'],
          ['minimize', 'Sets it aside — offer to carry on'],
        ],
        (v) => {
          t.dismissMode = v === 'minimize' ? 'minimize' : 'end';
          this.markDirty();
          this.render();
        },
      ),
    );
    if (t.dismissMode === 'minimize') {
      wrap.append(
        this.textField('Invitation text', t.resumeText, 'Carry on with the tour?', (v) => {
          t.resumeText = v;
        }),
        this.textField('Button label', t.resumeButton, 'Resume', (v) => {
          t.resumeButton = v;
        }),
        h('div', { class: 'settings__hint' }, [
          'A set-aside tour never restarts on its own — the visitor has to accept the invitation.',
        ]),
      );
    }

    // Trigger-specific parameter.
    if (t.trigger.type === 'selector') {
      wrap.append(
        this.textField('Element selector (CSS)', t.trigger.selector, '#start, .cta', (v) => {
          if (t.trigger.type === 'selector') t.trigger.selector = v;
        }),
      );
    } else if (t.trigger.type === 'timer') {
      wrap.append(
        this.textField('Delay (ms)', String(t.trigger.delay), '3000', (v) => {
          if (t.trigger.type === 'timer') t.trigger.delay = Math.max(0, Number(v.replace(/[^0-9]/g, '')) || 0);
        }),
      );
    } else if (t.trigger.type === 'cta') {
      const cta = t.trigger;
      wrap.append(
        this.textField('Invitation text', cta.text, 'Need a hand getting started?', (v) => {
          if (t.trigger.type === 'cta') t.trigger.text = v;
        }),
        this.textField('Button label', cta.button, 'Start tour', (v) => {
          if (t.trigger.type === 'cta') t.trigger.button = v;
        }),
        this.selectField(
          'Corner',
          cta.corner,
          [
            ['bottom-right', 'Bottom right'],
            ['bottom-left', 'Bottom left'],
            ['top-right', 'Top right'],
            ['top-left', 'Top left'],
          ],
          (v) => {
            if (t.trigger.type === 'cta') t.trigger.corner = v as typeof cta.corner;
            this.markDirty();
          },
        ),
        this.textField('Edge offset (px)', String(cta.offset ?? 24), '24', (v) => {
          if (t.trigger.type === 'cta') t.trigger.offset = Math.max(0, Number(v.replace(/[^0-9]/g, '')) || 0);
        }),
      );
    }

    wrap.append(h('div', { class: 'settings__hint' }, [triggerHint(t.trigger.type)]));

    // Auto-start conditions (ignored for manual tours; they start on demand).
    if (t.trigger.type !== 'manual') {
      const c = t.conditions;
      wrap.append(
        h('div', { class: 'settings__divider' }),
        this.checkboxField('Show only on the first visit', c.firstVisitOnly, (on) => {
          c.firstVisitOnly = on;
        }),
        this.textField('Show at most N times (0 = no limit)', String(c.maxShows), '0', (v) => {
          c.maxShows = Math.max(0, Number(v.replace(/[^0-9]/g, '')) || 0);
        }),
        this.selectField(
          'Device',
          c.device,
          [
            ['any', 'Any device'],
            ['desktop', 'Desktop only'],
            ['tablet', 'Tablet only'],
            ['mobile', 'Mobile only'],
          ],
          (v) => {
            c.device = v as DraftTour['conditions']['device'];
            this.markDirty();
          },
        ),
      );
    }
    return wrap;
  }

  /** A labelled checkbox row. */
  private checkboxField(label: string, checked: boolean, onChange: (on: boolean) => void): HTMLElement {
    const input = h('input', { type: 'checkbox', class: 'settings__check' }) as HTMLInputElement;
    input.checked = checked;
    input.addEventListener('change', () => {
      onChange(input.checked);
      this.markDirty();
      this.render();
    });
    const row = h('label', { class: 'settings__checkrow' });
    row.append(input, document.createTextNode(label));
    return row;
  }

  /** A labelled <select>. */
  private selectField(
    label: string,
    value: string,
    options: Array<[string, string]>,
    onChange: (value: string) => void,
  ): HTMLElement {
    const select = document.createElement('select');
    select.className = 'tsel';
    for (const [val, text] of options) {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = text;
      if (val === value) opt.selected = true;
      select.append(opt);
    }
    select.addEventListener('change', () => onChange(select.value));
    const field = h('div', { class: 'settings__field' });
    field.append(h('label', { class: 'settings__label' }, [label]), select);
    return field;
  }

  /** A labelled text input that writes through on change. */
  private textField(
    label: string,
    value: string,
    placeholder: string,
    onChange: (value: string) => void,
  ): HTMLElement {
    const input = h('input', { class: 'pagecfg__input', placeholder }) as HTMLInputElement;
    input.value = value;
    input.addEventListener('change', () => {
      onChange(input.value.trim());
      this.markDirty();
    });
    const field = h('div', { class: 'settings__field' });
    field.append(h('label', { class: 'settings__label' }, [label]), input);
    return field;
  }

  private renderConnector(afterIndex: number): HTMLElement {
    const c = h('div', { class: 'connector' });
    const add = h('button', { class: 'connector__add', title: 'Add step', type: 'button' }, ['+']);
    add.addEventListener('click', () => this.addStepAfter(afterIndex));
    c.append(h('div', { class: 'connector__line' }), add, h('div', { class: 'connector__line' }));
    return c;
  }

  /**
   * Selector list editor, shown over the panel.
   *
   * A step keeps a ranked list of candidates, but the UI only ever showed the
   * first one and offered no way to drop a bad entry or add a fallback — the
   * picker could only replace the lot. This is that missing editor.
   */
  /** Open the page editor, kicking off the sitemap fetch the first time. */
  private openPageEditor(step: DraftStep): void {
    this.setActive(step.id);
    this.pageEditorFor = this.pageEditorFor === step.id ? null : step.id;
    this.pageQuery = '';
    if (this.pageEditorFor && this.pages === null) {
      // Resolved once per page load and cached in the module; a failure just
      // means no suggestions, never an error in the author's face.
      void sitePages().then((pages) => {
        this.pages = pages;
        if (this.pageEditorFor) this.render();
      });
    }
    this.render();
  }

  /**
   * Page matcher editor: type to search the site's own pages, or paste a URL.
   *
   * Authors know their pages by name, not by URL glob. The sitemap is the one
   * list of pages a site already publishes about itself, so suggestions come
   * from there — matched against the whole URL, so both the host and a path
   * fragment find the same page. Free text always wins, which is how a URL on
   * someone else's site gets in.
   */
  private renderPageEditor(step: DraftStep): HTMLElement {
    const pop = h('div', { class: 'selpop' });

    const head = h('div', { class: 'selpop__head' });
    head.append(h('span', { class: 'selpop__title' }, ['Page']));
    const close = iconButton('close', 'Close');
    close.addEventListener('click', () => {
      this.pageEditorFor = null;
      this.render();
    });
    head.append(h('div', { class: 'spacer' }), close);

    const input = h('input', {
      class: 'pagecfg__input',
      placeholder: 'Any page — or type to search, or paste a URL',
    }) as HTMLInputElement;
    input.value = this.pageQuery || step.page;
    const commit = (value: string): void => {
      step.page = value.trim();
      this.markDirty();
      this.pageEditorFor = null;
      this.render();
    };
    input.addEventListener('input', () => {
      this.pageQuery = input.value;
      this.renderPageSuggestions(step, list);
    });
    input.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') commit(input.value);
    });

    const list = h('div', { class: 'selpop__list' });
    pop.append(head, input, list);
    this.renderPageSuggestions(step, list);

    const useCurrent = h('button', { class: 'selpop__add', type: 'button' }, ['⌖ Use the current page']);
    useCurrent.addEventListener('click', () => commit(this.currentPage()));
    const anyPage = h('button', { class: 'selpop__add', type: 'button' }, ['✳ Any page']);
    anyPage.addEventListener('click', () => commit(''));
    pop.append(useCurrent, anyPage);
    return pop;
  }

  /** (Re)fill the suggestion rows without rebuilding the whole popover. */
  private renderPageSuggestions(step: DraftStep, list: HTMLElement): void {
    list.textContent = '';
    if (this.pages === null) {
      list.append(h('p', { class: 'selpop__empty' }, ['Reading the site map…']));
      return;
    }
    if (this.pages.length === 0) {
      list.append(
        h('p', { class: 'selpop__empty' }, [
          'No sitemap found — type a URL or glob directly, and press Enter.',
        ]),
      );
      return;
    }
    const hits = matchPages(this.pages, this.pageQuery);
    if (hits.length === 0) {
      list.append(h('p', { class: 'selpop__empty' }, ['Nothing matches — press Enter to use it as typed.']));
      return;
    }
    for (const url of hits) {
      const row = h('button', { class: 'selpop__page', type: 'button', title: url }, [
        url.replace(/^https?:\/\//, ''),
      ]);
      row.addEventListener('click', () => {
        // Stored as a glob so the step still matches with a query string or
        // hash appended, which is nearly always what is wanted.
        step.page = toPageGlob(url);
        this.markDirty();
        this.pageEditorFor = null;
        this.render();
      });
      list.append(row);
    }
  }

  private renderSelectorEditor(step: DraftStep): HTMLElement {
    const pop = h('div', { class: 'selpop' });

    const head = h('div', { class: 'selpop__head' });
    head.append(h('span', { class: 'selpop__title' }, ['Selectors']));
    const close = iconButton('close', 'Close');
    close.addEventListener('click', () => {
      this.selectorEditorFor = null;
      this.render();
    });
    head.append(h('div', { class: 'spacer' }), close);

    const list = h('div', { class: 'selpop__list' });
    if (step.selectors.length === 0) {
      list.append(h('p', { class: 'selpop__empty' }, ['No selectors yet. Add one with the crosshair below.']));
    }
    step.selectors.forEach((value, i) => {
      const row = h('div', { class: 'selpop__row', draggable: 'true' });
      // Order is the ranking — the player tries candidates top-down — so it has
      // to be editable, not just visible.
      row.addEventListener('dragstart', (e) => {
        this.dragFrom = i;
        row.classList.add('selpop__row--dragging');
        (e as DragEvent).dataTransfer?.setData('text/plain', String(i));
      });
      row.addEventListener('dragend', () => {
        this.dragFrom = null;
        row.classList.remove('selpop__row--dragging');
      });
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        row.classList.add('selpop__row--over');
      });
      row.addEventListener('dragleave', () => row.classList.remove('selpop__row--over'));
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        const from = this.dragFrom;
        this.dragFrom = null;
        if (from === null || from === i) return;
        const [moved] = step.selectors.splice(from, 1);
        step.selectors.splice(i, 0, moved!);
        this.markDirty();
        this.render();
      });
      row.append(h('span', { class: 'selpop__grip', title: 'Drag to reorder' }, ['⠿']));
      row.append(h('span', { class: 'selpop__rank' }, [String(i + 1)]));
      row.append(h('code', { class: 'selpop__code', title: value }, [value]));
      const del = iconButton('trash', 'Remove this selector');
      del.addEventListener('click', () => {
        step.selectors.splice(i, 1);
        this.markDirty();
        this.render();
      });
      row.append(del);
      list.append(row);
    });

    const add = h('button', { class: `selpop__add ${this.picking ? 'selpop__add--on' : ''}`.trim(), type: 'button' }, [
      this.picking ? '◎ Picking — click an element, or press Esc' : '⌖ Add by picking an element',
    ]);
    add.addEventListener('click', () => this.togglePicking(true));

    pop.append(head, list, add);
    return pop;
  }

  private renderCard(step: DraftStep, index: number): HTMLElement {
    const isActive = step.id === this.activeStepId;
    const card = h('div', {
      class: `card ${isActive ? 'card--active' : ''} ${step.included ? '' : 'card--excluded'}`.trim(),
      // Lets revealStep() find this card after a re-render.
      'data-step-id': step.id,
    });
    card.addEventListener('mousedown', () => this.setActive(step.id));

    // Dim steps that belong to another page (their target is not here).
    if (step.page && !matchUrl({ glob: step.page }, window.location.href)) {
      card.classList.add('card--offpage');
    }
    card.append(this.renderCardControl(step, index), this.renderCardContent(step), this.renderCardFooter(step));
    // Card-settings accordion sections, shown only for the active card.
    if (isActive) {
      card.append(this.section('placement', 'Card position', () => this.renderPlacementBody(step)));
      card.append(this.section('behaviour', 'Behaviour', () => this.renderBehaviourBody(step)));
      card.append(this.section('page', 'Page', () => this.renderPageBody(step)));
    }
    return card;
  }

  /**
   * Per-step behaviour toggles.
   *
   * Exists because of the standing rule that anything the schema can express
   * must be reachable from the builder — `overlay` shipped with this section,
   * not after it.
   */
  private renderBehaviourBody(step: DraftStep): HTMLElement {
    const wrap = h('div', { class: 'settings' });
    wrap.append(
      this.checkboxField('Dim the rest of the page', step.overlay !== false, (on) => {
        step.overlay = on;
        this.render();
      }),
      h('div', { class: 'settings__hint' }, [
        'Off leaves the page fully usable and only outlines the target — for a step the visitor should be free to poke at.',
      ]),
    );
    return wrap;
  }

  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  private renderPageBody(step: DraftStep): HTMLElement {
    const wrap = h('div', { class: 'settings' });
    const input = h('input', { class: 'pagecfg__input', placeholder: 'Any page' }) as HTMLInputElement;
    input.value = step.page;
    input.addEventListener('change', () => {
      step.page = input.value.trim();
      this.markDirty();
      this.render();
    });
    const use = h('button', { class: 'pagecfg__use', type: 'button' }, ['Use current page']);
    use.addEventListener('click', () => {
      step.page = this.currentPage();
      this.render();
    });
    wrap.append(
      h('label', { class: 'settings__label' }, ['Show on pages matching (URL glob)']),
      input,
      use,
      h('div', { class: 'settings__hint' }, [
        'Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages.',
      ]),
    );
    return wrap;
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
    if (open) sec.append(h('div', { class: 'acc__body' }, [body()]));
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

    // The chip is a button: the selector list is the thing authors most often
    // need to fix, and it was previously unreachable — only the first candidate
    // was even visible, and nothing could remove a bad one.
    const sel = step.selectors[0];
    const count = step.selectors.length;
    const selEl = h(
      'button',
      {
        class: `card__sel ${sel ? '' : 'card__sel--empty'}`.trim(),
        type: 'button',
        title: step.selectors.join('\n') || 'No selector yet — click to add one',
      },
      [sel ?? 'no selector'],
    );
    if (count > 1) selEl.append(h('span', { class: 'card__selcount' }, [`+${count - 1}`]));
    selEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setActive(step.id);
      this.selectorEditorFor = this.selectorEditorFor === step.id ? null : step.id;
      this.render();
    });

    const del = iconButton('trash', 'Delete step');
    del.addEventListener('click', () => this.removeStep(step.id));

    row.append(check, idx, type, h('div', { class: 'spacer' }));
    // Show a page chip when the step is for another page.
    if (step.page && !matchUrl({ glob: step.page }, window.location.href)) {
      const path = step.page.replace(/^https?:\/\/[^/]+/, '').replace(/\*$/, '') || '/';
      // Clicking it opens the Page section rather than doing nothing, so the
      // chip is a way in rather than just a label.
      const pageEl = h('button', { class: 'card__page', type: 'button', title: step.page }, [`⧉ ${path}`]);
      pageEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPageEditor(step);
      });
      row.append(pageEl);
    }
    row.append(selEl, del);
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
