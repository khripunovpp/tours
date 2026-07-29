/**
 * Tour data model and validation for @tours/schema. This is the single source
 * of truth for the shape of a tour; every other component depends on it. The
 * schema is versioned (SCHEMA_VERSION) so stored tours can be migrated across
 * releases and stay portable between platforms (WordPress, extensions, JSON).
 */
/** Text with a required default and optional per-language variants (i18n). */
export type LocalizedText = {
	default: string;
	[lang: string]: string;
};
/**
 * Matches a page URL for multi-page and cross-domain tours. At least one of
 * `glob`/`regex` must be set; `regex` (matched against the full URL) wins when
 * both are present. Globs use `*` within a path segment and `**` across them.
 */
export interface UrlMatch {
	glob?: string;
	regex?: string;
}
/** The device classes a condition can target. */
export type DeviceClass = "mobile" | "tablet" | "desktop";
/**
 * Declarative predicate evaluated at runtime by the rules engine (in `core`).
 * All present fields must hold for the condition to pass. Used both to gate an
 * individual step (`Step.condition`) and to auto-start a tour (`Rule.when`).
 */
export interface Condition {
	/** Current page URL must match. */
	url?: UrlMatch;
	/** Visitor role must equal this (e.g. "admin", "guest"). */
	role?: string;
	/** Only on the visitor's first visit. */
	firstVisitOnly?: boolean;
	/** Only on this device class. */
	device?: DeviceClass;
	/** Skip if the tour/step was already seen by this visitor. */
	unlessSeen?: boolean;
	/** Show at most this many times. */
	maxShows?: number;
}
/** What a step does to advance, beyond the visitor clicking "next". */
export interface Action {
	type: "click" | "input" | "navigate" | "none";
	/** Destination for `navigate`. */
	url?: string;
	/** Value to type for `input`. */
	value?: string;
}
export interface Step {
	id: string;
	/**
	 * Ranked candidates for the step's target, most stable first. The player
	 * tries each in turn, so a redeploy that breaks one still resolves.
	 *
	 * Strings only, deliberately: this is the **stored** format, and a DOM node
	 * cannot be serialised. A host that already holds the element can pass it
	 * directly at runtime — see `RuntimeStep` in `@tours/core`, which widens this
	 * to accept nodes and ref getters. `validate` rejects anything but strings.
	 */
	selectors: string[];
	content: LocalizedText;
	/** Which side of the target the card sits on, or 'auto'. Defaults to 'bottom'. */
	placement?: "top" | "bottom" | "left" | "right" | "auto";
	/** Alignment along that side. Defaults to 'center'. */
	align?: "start" | "center" | "end";
	/** Custom label for the back button. Defaults to 'Back'. */
	backLabel?: string;
	/** Custom label for the next button. Defaults to 'Next' (or 'Done' on the last step). */
	nextLabel?: string;
	/** Page this step belongs to (multi-page / cross-domain tours). */
	pageUrl?: UrlMatch;
	/** Runtime gate: only show this step when the condition holds. */
	condition?: Condition;
	/** Interaction the step performs or expects to advance. */
	action?: Action;
}
/** Auto-start rule: trigger a tour when `when` holds. */
export interface Rule {
	/** Tour to trigger; defaults to the enclosing tour. */
	tourId?: string;
	when: Condition;
}
/**
 * How a tour auto-starts. `manual` (default) only starts via a shortcode/API
 * call; the others fire once when their condition is met.
 */
export type CtaCorner = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type Trigger = {
	type: "manual";
} | {
	type: "load";
} | {
	type: "selector";
	selector: string;
} | {
	type: "timer";
	delay: number;
} | {
	/** A small greeting popover in a corner; its button starts the tour. */
	type: "cta";
	text: string;
	button: string;
	corner: CtaCorner;
	/** Distance from the corner edges in px (default 24). */
	offset?: number;
};
/** Tour-level visual settings, read by both the player and the editor. */
export interface DisplaySettings {
	/**
	 * Gap in pixels between the target element and the spotlight/highlight
	 * outline. Applies everywhere the target is framed. Defaults to 6.
	 */
	padding?: number;
	/** Corner radius (px) of the spotlight/highlight outline. Defaults to 6. */
	radius?: number;
	/** Corner radius (px) of the visitor tooltip card. Defaults to 10. */
	cardRadius?: number;
	/** Distance (px) from the target to the card. Defaults to 12. */
	offset?: number;
	/**
	 * Inset (px) along the alignment edge for start/end alignment — nudges the
	 * card in from the aligned edge. No effect on centre alignment. Defaults to 0.
	 */
	alignOffset?: number;
}
export interface Tour {
	id: string;
	schemaVersion: number;
	title: LocalizedText;
	steps: Step[];
	/** Optional auto-start rules. */
	rules?: Rule[];
	/** How the tour auto-starts (defaults to manual). */
	trigger?: Trigger;
	/** Who may see the tour: everyone, logged-in only, or logged-out only. */
	audience?: "all" | "auth" | "guest";
	/** Optional visual settings shared by player and editor. */
	display?: DisplaySettings;
}
export interface PickerHandle {
	start(): void;
	stop(): void;
}
export interface PickerOptions {
	/**
	 * Elements the picker must never highlight or capture (e.g. the editor's own
	 * UI). Anything at or inside one of these is treated as empty space, so the
	 * selector search does not react to the tool's own chrome.
	 */
	ignore?: Array<Element | null | undefined>;
}
/**
 * Create a picker. Call start() to enter selection mode and stop() to leave it.
 * onPick fires once with the captured selector(s), after which the picker stops
 * itself automatically.
 */
export declare function createPicker(onPick: (selectors: string[]) => void, options?: PickerOptions): PickerHandle;
/**
 * Selector engine — the project's main technical risk. Instead of one brittle
 * selector per step, we build a ranked list of candidates (most stable first),
 * resolve a step by trying them in order (re-finder), and wait for elements
 * that are not in the DOM yet (SPA / lazy rendering).
 */
/**
 * Build a ranked list of candidate selectors for an element, best (most
 * stable / unique) first. Only candidates that actually resolve back to the
 * element are kept, so every entry is verified at capture time.
 */
export declare function buildSelectors(el: Element): string[];
/**
 * A step target: either a CSS selector (or the `text=` pseudo-selector), or a
 * live DOM node — useful when the host already holds the element, e.g. a
 * framework template ref, and inventing a selector for it would be redundant.
 *
 * A getter is accepted too, for a ref that is not populated yet at the time the
 * tour object is built (Angular `viewChild`, React `useRef`, …). It is called
 * on every resolve attempt, so a late-mounting element is picked up by the same
 * wait-and-retry path as a selector.
 *
 * Nodes are **runtime-only**: they cannot be serialised, so a stored tour still
 * carries plain strings. See `@tours/schema`'s `Step.selectors`.
 */
export type SelectorLike = string | Element | (() => Element | null | undefined);
/** Re-finder: return the first candidate that resolves to an element. */
export declare function resolveElement(selectors: readonly SelectorLike[], root?: ParentNode): Element | null;
export interface WaitOptions {
	/** Give up after this many ms (default 4000). Use 0 to wait indefinitely. */
	timeout?: number;
	root?: ParentNode;
}
/**
 * Resolve now, or wait for the element to appear (SPA / lazy). Observes the DOM
 * and resolves with the element, or null on timeout. Never rejects.
 */
export declare function waitForElement(selectors: readonly SelectorLike[], options?: WaitOptions): Promise<Element | null>;
/**
 * Visitor state backend — where the player remembers its progress so a tour can
 * continue after the visitor navigates to another page. Within one site this is
 * localStorage (survives navigation and reloads). Cross-domain (M2) will plug a
 * chrome.storage-backed implementation into the same interface.
 */
export interface StateBackend {
	get(key: string): string | null;
	set(key: string, value: string): void;
	remove(key: string): void;
}
/** Progress record persisted between page loads. */
export interface TourProgress {
	tourId: string;
	/** Index of the step to show next. */
	index: number;
}
export declare const PROGRESS_KEY = "tours:progress";
/** localStorage-backed state; degrades to a no-op if storage is unavailable. */
export declare function createLocalState(): StateBackend;
/** Read the saved progress, or null if none / unreadable. */
export declare function readProgress(state: StateBackend): TourProgress | null;
export declare function writeProgress(state: StateBackend, progress: TourProgress): void;
export declare function clearProgress(state: StateBackend): void;
/** How many times a tour has been shown to this visitor. */
export declare function seenCount(state: StateBackend, tourId: string): number;
/** Record one more showing of a tour. */
export declare function markSeen(state: StateBackend, tourId: string): void;
/**
 * A step as the player accepts it: identical to the stored `Step`, except that
 * `selectors` may also carry live DOM nodes or ref getters.
 *
 * The distinction is deliberate. A node cannot be serialised, so the *stored*
 * format — `Step` in `@tours/schema`, what `validate`/`migrate` accept and what
 * the builder writes — stays strings only. Nodes exist purely at runtime, for a
 * host that already holds the element and would otherwise have to invent a
 * selector for it.
 *
 * `Step` is assignable to this, so a plain validated tour needs no change.
 */
export type RuntimeStep = Omit<Step, "selectors"> & {
	selectors: readonly SelectorLike[];
};
/** A tour as the player accepts it — see {@link RuntimeStep}. */
export type RuntimeTour = Omit<Tour, "steps"> & {
	steps: readonly RuntimeStep[];
};
export interface PlayerHandle {
	/** Start the tour, optionally at a given step index (default 0). */
	start(startIndex?: number): void;
	stop(): void;
	next(): void;
	prev(): void;
	/** True between a successful start() and stop(). */
	isActive(): boolean;
}
export interface PlayerOptions {
	/**
	 * Where to persist progress so a multi-page tour can continue after the
	 * visitor navigates. Omit for single-page tours.
	 */
	state?: StateBackend;
	/**
	 * Override full-page navigation between steps. Receives the destination URL
	 * and the id of the step being navigated to. When provided, the player calls
	 * this instead of `window.location.assign` for cross-page (non-hash) steps —
	 * letting a host (e.g. the builder's preview) tag the URL so it can resume
	 * after the reload. Hash (SPA) navigation is unaffected.
	 */
	onNavigate?: (url: string, stepId: string) => void;
	/**
	 * Start even while the tour builder is mounted on the page. Default false.
	 *
	 * The builder is itself an overlay with its own preview, so a player started
	 * underneath it stacks two overlays on the same page — always a mistake,
	 * except for the builder's own preview, which sets this.
	 *
	 * Guarding here rather than at each call site means a host does not have to
	 * remember the check in every place it starts a tour: `?tours-edit=1` alone
	 * is enough to suppress them all.
	 */
	allowWhileEditing?: boolean;
}
/**
 * True while the tour builder is mounted.
 *
 * Detected through the DOM rather than by importing the editor: core must not
 * depend on it (the dependency runs the other way), and this keeps the player
 * usable without the editor in the bundle.
 */
export declare function isBuilderMounted(): boolean;
/**
 * Create a player for a tour. Returns handles to drive it: start/stop and
 * next/prev. The player owns its own shadow-DOM UI and cleans it up on stop().
 */
export declare function createPlayer(tour: RuntimeTour, options?: PlayerOptions): PlayerHandle;
/**
 * Resume an in-progress tour after navigation. Reads saved progress; if it is
 * for this tour and the pending step belongs to the current page, starts the
 * player there. Returns the player, or null when there is nothing to resume
 * here yet. Call on every page load for multi-page tours.
 */
export declare function resumeTour(tour: RuntimeTour, options?: PlayerOptions): PlayerHandle | null;
/**
 * True if `url` satisfies the match. `regex` wins when present; otherwise the
 * `glob` is used. A match with neither field matches any page.
 */
export declare function matchUrl(match: UrlMatch | undefined, url: string): boolean;
/**
 * Derive a concrete navigation URL from a page matcher, for auto-advancing a
 * multi-page tour. Strips wildcards from an absolute-URL glob (e.g.
 * `https://x.com/recipes*` → `https://x.com/recipes`). Returns null when no
 * usable URL can be derived (relative glob, regex, or no match) — the caller
 * then waits for the visitor to navigate instead.
 */
export declare function deriveUrl(match: UrlMatch | undefined): string | null;
export declare function armTrigger(tour: RuntimeTour, fire: () => void): () => void;
export interface MountOptions extends PlayerOptions {
	/**
	 * Gate a tour on host-specific conditions the schema cannot express —
	 * audience, feature flags, permissions. Re-checked on every navigation, so
	 * it may return different answers as the session changes.
	 */
	canRun?: (tour: RuntimeTour) => boolean;
}
/**
 * Register tours and keep them running across navigation. Returns an unmount
 * function that stops any running tour and releases the watcher.
 *
 * Pass a function rather than an array when the set of tours is computed —
 * it is re-read on every navigation, so tours loaded later are picked up.
 *
 * ```ts
 * mountTours(tours, { state: createLocalState() });
 * ```
 */
export declare function mountTours(input: readonly RuntimeTour[] | (() => readonly RuntimeTour[]), options?: MountOptions): () => void;
export type Device = "mobile" | "tablet" | "desktop";
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
export declare function detectDevice(width?: number): Device;
/** True if the tour may start given the context (no rules ⇒ always). */
export declare function matchRules(rules: Rule[] | undefined, ctx: RuleContext): boolean;
/**
 * Debug logger. Silent by default so production pages stay quiet; enable it by
 * adding `use_logs` to the page URL query string (e.g. `?use_logs` or
 * `?use_logs=1`). Kept in its own module so every component can log its main
 * stages through one consistent, opt-in channel.
 */
/** Whether logging is turned on via the `use_logs` URL parameter. */
export declare function isLoggingEnabled(): boolean;
export interface Logger {
	log(...args: unknown[]): void;
	warn(...args: unknown[]): void;
	error(...args: unknown[]): void;
}
/**
 * Create a scoped logger. Messages are prefixed with `[tours:<scope>]` and are
 * emitted only when logging is enabled. Use it to trace the main stages of a
 * component (start/stop, step changes, captured selectors, etc.).
 */
export declare function createLogger(scope: string): Logger;
/**
 * Shared card-placement math used by both the player tooltip and the editor
 * preview, so a step looks the same while authoring and when live. A placement
 * is a side (which edge of the target the card sits on), an alignment along
 * that side (start/center/end) and an offset (distance from the target).
 */
export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
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
	card: {
		width: number;
		height: number;
	};
	/** A fixed side, or 'auto' to pick the side with the most room. */
	side: Side | "auto";
	align: Align;
	/** Distance from the target, perpendicular to the side. */
	offset: number;
	/** Inset along the alignment edge for start/end alignment. Defaults to 0. */
	alignOffset?: number;
	viewport: {
		width: number;
		height: number;
	};
}
/**
 * Choose a side in auto mode. Prefers bottom (then top, right, left) and stays
 * there as long as the card fits, only moving elsewhere when it does not; if no
 * side fits, falls back to the one with the most room (bottom on ties).
 */
export declare function autoSide(t: Rect, c: {
	width: number;
	height: number;
}, v: {
	width: number;
	height: number;
}): Side;
/** Compute the card's viewport position, clamped so it stays on screen. */
export declare function placeCard(input: PlaceInput): {
	top: number;
	left: number;
};
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
/** Build a step card element from the given options. */
export declare function renderCard(opts: CardOptions): HTMLElement;
/** Styles for the step card. Injected into any shadow root that renders one. */
export declare const CARD_STYLES = "\n.tours-card {\n  position: fixed;\n  z-index: 2147483001;\n  box-sizing: border-box;\n  max-width: 320px;\n  min-width: 220px;\n  padding: 16px;\n  font: 14px/1.5 system-ui, sans-serif;\n  color: #111827;\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);\n}\n.tours-card--ghost { pointer-events: none; }\n.tours-card--ghost .tours-card__btn,\n.tours-card--ghost .tours-card__close { pointer-events: auto; }\n.tours-card__content {\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n.tours-card__footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  margin-top: 14px;\n}\n.tours-card__progress {\n  flex: 1;\n  text-align: center;\n  font-size: 12px;\n  color: #6b7280;\n}\n.tours-card__btn {\n  box-sizing: border-box;\n  padding: 6px 12px;\n  font: inherit;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1;\n  color: #111827;\n  background: #f3f4f6;\n  border: 1px solid #e5e7eb;\n  border-radius: 7px;\n  cursor: pointer;\n}\n.tours-card__btn:hover { background: #e5e7eb; }\n.tours-card__btn--primary { color: #fff; background: #2563eb; border-color: #2563eb; }\n.tours-card__btn--primary:hover { background: #1d4ed8; }\n.tours-card__btn--disabled { opacity: 0.45; pointer-events: none; cursor: default; }\n.tours-card__close {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  font: 16px/1 system-ui, sans-serif;\n  color: #6b7280;\n  background: transparent;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.tours-card__close:hover { background: #f3f4f6; color: #111827; }\n";

export {};
