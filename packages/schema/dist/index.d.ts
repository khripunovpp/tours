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
	/**
	 * Labels the visitor must carry. All listed tags must be present.
	 *
	 *     tags: ['authenticated', 'level:gold']
	 *
	 * A flat set rather than key/value pairs, because matching was only ever
	 * equality — `{ level: 'gold' }` said nothing that the tag `level:gold` does
	 * not. Pairs bought no expressiveness and cost the author two fields to fill
	 * in blind; a set is something they can pick from a list.
	 *
	 * Deliberately without dedicated `role` or `audience` fields: a role is a tag,
	 * being logged in is a tag, having purchased is a tag. Naming each in the
	 * schema is a list that never ends, and two mechanisms for one idea always
	 * raise "which do I use".
	 */
	tags?: string[];
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
	/**
	 * Dim the rest of the page for this step. Defaults to true.
	 *
	 * `false` leaves the page fully usable and merely outlines the target — for a
	 * step that explains something the visitor should be free to poke at. Users of
	 * other tour libraries fake this with an enormous spotlight padding; it is a
	 * flag here.
	 *
	 * Distinct from `action: { type: 'click' }`: that also changes how the step
	 * *advances*. This only changes how it *looks*.
	 */
	overlay?: boolean;
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
/**
 * What the card's × does.
 *
 * Closing is always allowed — a visitor who has lost interest must be able to
 * get the overlay off the screen at any point. This only decides whether that
 * ends the tour or merely puts it aside.
 */
export interface DismissPolicy {
	/**
	 * `end` (default) — finish for good: progress is cleared and the tour does
	 * not come back.
	 * `minimize` — set aside: progress is kept and a small invitation offers to
	 * pick it up again, on this page and on later ones.
	 */
	mode: "end" | "minimize";
	/**
	 * The invitation shown after minimizing. Same shape as the `cta` trigger,
	 * because it is the same popover — one component for "start this tour" and
	 * "carry on with this tour".
	 */
	resume?: {
		text: string;
		button: string;
		corner?: CtaCorner;
		offset?: number;
	};
}
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
	/** Optional visual settings shared by player and editor. */
	display?: DisplaySettings;
	/** What the card's × does. Defaults to ending the tour. */
	dismiss?: DismissPolicy;
}
/** Default gap between a framed target and its outline, in pixels. */
export declare const DEFAULT_PADDING = 6;
/** Default corner radius of the outline, in pixels. */
export declare const DEFAULT_RADIUS = 6;
/** Default corner radius of the visitor tooltip card, in pixels. */
export declare const DEFAULT_CARD_RADIUS = 10;
/** Default distance from the target to the card, in pixels. */
export declare const DEFAULT_OFFSET = 12;
export declare const SCHEMA_VERSION = 2;
/**
 * Validate arbitrary JSON against the tour schema. Returns the typed tour on
 * success, or a list of human-readable errors on failure. Used when importing
 * tours from files or untrusted sources. Does not migrate — call `migrate`
 * first for data that may be from an older schema version.
 */
export declare function validate(json: unknown): {
	ok: true;
	tour: Tour;
} | {
	ok: false;
	errors: string[];
};
/**
 * Bring possibly-outdated tour JSON up to the current schema version, then
 * validate it. Applies migrations in sequence (v0 → v1 → …). Fails if the data
 * is newer than this build supports or if no migration path exists — callers
 * get human-readable errors, never a throw.
 */
export declare function migrate(input: unknown): {
	ok: true;
	tour: Tour;
} | {
	ok: false;
	errors: string[];
};

export {};
