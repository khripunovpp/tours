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
type DeviceClass = "mobile" | "tablet" | "desktop";
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
type CtaCorner = "bottom-right" | "bottom-left" | "top-right" | "top-left";
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
export type Placement = "top" | "bottom" | "left" | "right" | "auto";
export type Align = "start" | "center" | "end";
/** The kind of card, shown as a badge on the card's control row. */
export type CardType = "step" | "action";
export interface DraftStep {
	id: string;
	type: CardType;
	/**
	 * Included in the shipped tour. When false the step is kept in the draft but
	 * excluded from `toTour`.
	 * TODO: revisit — visitors probably should not receive excluded steps at all,
	 * so this may need to be stripped server-side before it reaches the client.
	 */
	included: boolean;
	/** Candidate CSS selectors for the target element (first that resolves wins). */
	selectors: string[];
	/** Plain-text step content. Rich formatting (WYSIWYG) is deferred. */
	content: string;
	/** Page this step belongs to, as a URL glob. Empty = any page. */
	page: string;
	placement: Placement;
	/** Alignment of the card along the placement side. */
	align: Align;
	/** Editable footer button labels. */
	backLabel: string;
	nextLabel: string;
	/** Optional interaction to advance (e.g. navigate to another page). */
	action?: Action;
}
export type TourStatus = "draft" | "published";
/** A draft is either a real tour or a reusable template. */
export type TourKind = "tour" | "template";
/** Who may see the tour. */
export type Audience = "all" | "auth" | "guest";
interface DraftConditions {
	firstVisitOnly: boolean;
	/** 0 = no limit. */
	maxShows: number;
	device: "any" | "mobile" | "tablet" | "desktop";
}
export interface DraftDisplay {
	/** Gap in px between the target element and the outline (player + editor). */
	padding: number;
	/** Corner radius (px) of the outline. */
	radius: number;
	/** Corner radius (px) of the visitor tooltip card. */
	cardRadius: number;
	/** Distance (px) from the target to the card. */
	offset: number;
	/** Inset (px) along the alignment edge for start/end alignment. */
	alignOffset: number;
}
export interface DraftTour {
	id: string;
	kind: TourKind;
	name: string;
	status: TourStatus;
	/** How the tour auto-starts. */
	trigger: Trigger;
	/** Who may see the tour. */
	audience: Audience;
	/** Auto-start conditions. */
	conditions: DraftConditions;
	steps: DraftStep[];
	display: DraftDisplay;
}
/** A fresh, empty step (included by default, per the spec). */
export declare function createDraftStep(type?: CardType): DraftStep;
/** A fresh, empty tour (or template) with one starter step. */
export declare function createDraftTour(kind?: TourKind): DraftTour;
/**
 * Deep-copy a draft into a new one of the given kind, with fresh ids so it is
 * independent of the source. Used for save-as-template and create-from-template.
 */
export declare function cloneDraft(src: DraftTour, kind: TourKind, name?: string): DraftTour;
/**
 * Coerce loaded (possibly older or partial) data into well-formed drafts,
 * filling in fields added since it was stored. Drops anything unrecognizable so
 * a corrupt entry can never crash the builder.
 */
export declare function normalizeTours(input: unknown): DraftTour[];
/**
 * Compile a draft into a validated Tour. Returns validation errors instead of
 * throwing so the builder can surface them.
 */
export declare function toTour(draft: DraftTour): {
	ok: true;
	tour: Tour;
} | {
	ok: false;
	errors: string[];
};
export interface DraftStore {
	/** Load stored drafts, or null when there is nothing / it is unavailable. */
	load(): Promise<DraftTour[] | null>;
	save(tours: DraftTour[]): Promise<void>;
}
/** Default store: browser localStorage. Never throws — degrades to a no-op. */
export declare function createLocalStore(key?: string): DraftStore;
export interface WordPressStoreConfig {
	/** REST route that accepts GET (load) and POST (save) of the draft array. */
	url: string;
	/** WordPress nonce, sent as `X-WP-Nonce` when present. */
	nonce?: string;
}
/**
 * WordPress secondary strategy: persist drafts through a REST route. Errors
 * propagate so the builder can log them; localStorage remains the safety net.
 */
export declare function createWordPressStore(config: WordPressStoreConfig): DraftStore;
export type NavPosition = "top" | "bottom";
export type PanelPosition = "left" | "right";
export interface TourBuilderOptions {
	/** Start mounted in edit mode. Default: true. */
	mode?: "edit" | "off";
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
export declare class TourBuilder {
	private readonly options;
	private readonly log;
	private host;
	private root;
	private tours;
	private openTourId;
	private view;
	/** Which kind the list view shows (tours vs templates). */
	private listFilter;
	/** Whether the tour ⋯ dropdown menu is open. */
	private menuOpen;
	private activeStepId;
	private tab;
	private displaySub;
	/** Which card-settings accordion sections are expanded (by key). */
	private readonly openSections;
	private mode;
	private navPosition;
	private panelPosition;
	private picker;
	private picking;
	private player;
	/** Dashed outline over the active step's target element (no backdrop). */
	private highlight;
	/** Live preview of the visitor tooltip card, shown in the Card sub-tab. */
	private cardPreview;
	/** Step whose content should regain focus after the next render. */
	private focusStepId;
	private readonly onViewportChange;
	/** Default store (always written) and the optional secondary strategy. */
	private readonly local;
	private readonly secondary;
	private saveTimer;
	private readonly topOffset;
	constructor(options?: TourBuilderOptions);
	/**
	 * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
	 * a site owner can enable the builder without touching code. Returns the
	 * instance if mounted, otherwise null.
	 */
	static fromUrl(options?: TourBuilderOptions): TourBuilder | null;
	/** Render the UI onto the page. Idempotent. */
	mount(): void;
	/** Load stored drafts (localStorage by default) and show them. */
	private hydrate;
	/** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
	private markDirty;
	/** Always write localStorage; also try the secondary strategy best-effort. */
	private persist;
	/** Remove the UI and any active picker/player. */
	destroy(): void;
	/** The current draft as a validated tour (or validation errors). */
	export(): ReturnType<typeof toTour>;
	/** The currently open tour (falls back to the first if the id is stale). */
	private get tour();
	private get activeStep();
	/** Open a tour for editing and reset the active step to its first. */
	private openTour;
	/** Create a fresh entity of the currently listed kind (tour or template). */
	private createEntity;
	private deleteEntity;
	/** Copy the open tour into a new template and jump to the Templates list. */
	private saveAsTemplate;
	/** Create a new tour from a template and open it for editing. */
	private createFromTemplate;
	private setActive;
	private addStepAfter;
	/** Scroll the panel so a step's card is visible. Runs after render(). */
	private revealStep;
	/** A URL glob for the current page (matches its query/hash variations). */
	private currentPage;
	private removeStep;
	private togglePicking;
	private stopPicking;
	private togglePreview;
	/**
	 * Enter preview mode, optionally starting at a given step id (used when
	 * resuming after a cross-page navigation). The id is resolved against the
	 * compiled tour, whose step set can differ from the draft. Returns false if
	 * the draft is invalid.
	 */
	private startPreview;
	/**
	 * Flush the draft, then navigate to `url` with a resume token so the builder
	 * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
	 * the page reloads. Used for cross-page Next in both build and preview.
	 */
	private navigateForResume;
	/**
	 * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
	 * the referenced step and, for preview, restart playback there. Strips the
	 * param so a manual refresh will not re-trigger it. Returns true when it
	 * handled a resume (and rendered), false to let the caller render normally.
	 */
	private applyResume;
	private render;
	/** Resolve a step's target on the page, trying each candidate selector. */
	private resolveTarget;
	/**
	 * Draw the dashed outline around the active step's target, and (in the Card
	 * sub-tab) a live tooltip-card preview beside it. Both use the same
	 * tour-level values the player reads. Shown only in build mode when the
	 * active step resolves; hidden while picking or in preview. No backdrop.
	 */
	private updateOverlays;
	private removeCardPreview;
	/**
	 * Render the active step's card near its target via the shared renderCard —
	 * the exact markup the player uses. Shown when the step has content; in the
	 * Card sub-tab a muted placeholder shows so the radius stays visible first.
	 */
	private drawStepCard;
	private renderNav;
	private renderPanel;
	private renderListHeader;
	private renderList;
	private renderHeader;
	/** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
	private renderMenu;
	/** Download the given drafts as a schema Tour[] JSON file. */
	private downloadJson;
	/** Slugify a name into a safe file base (fallback to a generic name). */
	private fileBase;
	/** Download just the currently open tour (as an array of one). */
	private downloadOpenTour;
	/** Download every tour of the kind currently listed (Tours or Templates). */
	private downloadAll;
	/**
	 * Prompt for a JSON file and merge its tours into the builder. A tour with an
	 * id that already exists is replaced; new ids are appended. When an open tour
	 * is being edited it stays open (if it survived the import).
	 */
	private importJson;
	/** Merge imported drafts by id (replace existing, append new) and re-render. */
	private mergeDrafts;
	private renderToolbar;
	private renderTabs;
	/** Activate the first step whose selector resolves to an on-page element. */
	private selectFirstResolvableStep;
	/**
	 * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
	 * target outline) and Card (the visitor tooltip) — tuned live.
	 */
	private renderDisplaySettings;
	/** A labelled range slider that writes through `set` and re-draws overlays live. */
	private slider;
	/** Swap a value label for a digits-only input; commit on blur/Enter. */
	private editNumber;
	private renderBody;
	/** Rules tab: start trigger, audience, and auto-start conditions. */
	private renderRulesBody;
	/** A labelled checkbox row. */
	private checkboxField;
	/** A labelled <select>. */
	private selectField;
	/** A labelled text input that writes through on change. */
	private textField;
	private renderConnector;
	private renderCard;
	/** Page sub-panel: which pages this step shows on (multi-page tours). */
	private renderPageBody;
	/**
	 * A collapsible card-settings section: a header with a left caret + title;
	 * clicking toggles it. Collapsed by default; open state persists across
	 * renders (keyed) so switching steps keeps the same sections expanded.
	 */
	private section;
	/**
	 * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
	 * start/center/end) around a mock target. Editing re-renders so the on-page
	 * card and the active anchor update together.
	 */
	private renderPlacementBody;
	private renderCardControl;
	private renderCardContent;
	private renderCardFooter;
	/** A footer button that turns into a text input when clicked, to edit its label. */
	private renderEditableButton;
	/** Focus a card's content area and place the caret at the end. */
	private focusContent;
}

export {};
