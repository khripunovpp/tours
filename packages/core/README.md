# @tours/core

The visitor-facing half of [Tours](../../README.md): a product tour player,
an element picker, auto-start triggers and progress persistence.

~8 KB gzipped, **no runtime dependencies**. All UI renders inside a shadow DOM,
so the host page's CSS cannot reach it and it cannot leak styles back.

## Install

```bash
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/core"
```

`#path:` is honoured by pnpm and yarn. **Plain npm ignores it silently** — it
reports `added 1 package` but installs the monorepo root, which then fails with
`TS2307: Cannot find module '@tours/core'`.

For npm, install a packed tarball (`cd packages/core && pnpm pack`) or use the
prebuilt `dist/tours-player.js` bundle from the repository root.

## Usage

```ts
import { createPlayer } from '@tours/core';

const player = createPlayer({
  id: 'welcome',
  schemaVersion: 1,
  title: { default: 'Welcome' },
  steps: [
    {
      id: 'compose',
      selectors: ['#btn-new-post', '[data-testid="new-post"]'],
      content: { default: 'Write your first post here.' },
      placement: 'bottom',
    },
  ],
});

player.start();
```

`selectors` is a ranked list of candidates — the player tries each in order and
waits for targets that render late, rather than skipping the step.

### Passing DOM nodes instead of selectors

When the host already holds the element — a framework template ref, say —
inventing a CSS selector for it is redundant and fragile. `selectors` accepts
live nodes, and getters for refs that are not populated yet:

```ts
const el = document.querySelector('#compose');

createPlayer({
  id: 'welcome',
  schemaVersion: 1,
  title: { default: 'Welcome' },
  steps: [
    // A node, a lazily-read ref, and a selector fallback — tried in order.
    { id: 'a', selectors: [el], content: { default: 'Compose here.' } },
    { id: 'b', selectors: [() => myRef.nativeElement, '#fallback'], content: { default: 'Or here.' } },
  ],
}).start();
```

Detached nodes are treated as unresolved, so the player falls through to the
next candidate or keeps waiting — it never frames an element that left the page.
A getter that throws (component torn down) is handled the same way.

This is **runtime-only**: a DOM node cannot be serialised, so a *stored* tour
still carries plain strings, and `validate()` rejects anything else. The widened
shape is `RuntimeTour` / `RuntimeStep`; the stored one is `Tour` / `Step` from
[`@tours/schema`](../schema), and `Tour` is assignable to `RuntimeTour`.

### Steps the visitor completes themselves

A step with `action: { type: 'click' }` is *interactive*: the visitor is meant to
operate the target, not press Next.

```ts
{
  id: 'open-form',
  selectors: ['#open-form'],
  content: { default: 'Open the form to continue.' },
  action: { type: 'click' },
}
```

Three things change for such a step:

- **Clicks reach the page.** The target's rectangle is clipped out of the
  backdrop, so the real button receives the click. (On a normal step the
  backdrop still covers the target, so a stray click cannot fire it.)
- **It advances on navigation, not on Next.** The player watches for the next
  step's `pageUrl` to start matching and moves on then. The host app keeps
  full control of its own routing — the player never navigates for it.
- **No Next button.** Offering one would be a second, contradictory way
  forward. The last step is the exception — nothing follows it, so its button
  is the only way to finish.

This is what makes tours work in an app whose URLs follow rules the tour knows
nothing about: the only signal used is "the page the next step wants is now
open". `pushState`/`replaceState` are covered, so a client-side router works the
same as a full page load.

### One call, then forget it

`mountTours` registers your tours and keeps them alive across navigation, so you
never have to remember a resume call on the next page:

```ts
import { mountTours, createLocalState } from '@tours/core';

mountTours(tours, { state: createLocalState() });
```

It continues anything mid-flight, otherwise arms the tours' auto-start triggers
(gated by their `rules`), and re-checks both whenever the URL changes. The same
single call covers both kinds of site:

- **Static multi-page** — each navigation reloads the document, so the bundle
  re-executes and the initial pass runs on the new page.
- **Client-side routing** — no reload, so the location watcher re-checks
  instead. `pushState`/`replaceState` are patched, so a router that never
  touches the hash works too.

A server-rendered site with a form whose steps are tied to the URL is just the
first case, and needs nothing extra.

Pass a function instead of an array when the tours are loaded later — it is
re-read on every navigation. Use `canRun` to gate on things the schema cannot
express (audience, feature flags); it is re-checked each time. The return value
unmounts: it stops any running tour and releases the watcher.

The lower-level pieces below (`resumeTour`, `armTrigger`) remain available if
you want to drive this yourself.

### Multi-page tours

Pass a state backend so progress survives navigation, and call `resumeTour` on
every page load:

```ts
import { createPlayer, resumeTour, createLocalState } from '@tours/core';

const state = createLocalState();

// On the page where the tour begins:
createPlayer(tour, { state }).start();

// On every page load — returns null when there is nothing to resume here:
resumeTour(tour, { state });
```

`createLocalState()` uses `localStorage`. Implement `StateBackend` yourself
(`get`/`set`/`remove`) to persist somewhere else.

Resume needs no marker in the URL. `resumeTour` scans **forward** from the saved
step for the first one whose `pageUrl` matches the current page, so it does not
matter who performed the navigation — the player on Next, or the visitor
clicking a real button on an interactive step. It never scans backwards, so
going back in history does not replay completed steps.

That covers a static multi-page site, a client-side router, and the mixed case
of a non-SPA whose form steps are tied to the URL, with the same call on every
page load.

### Auto-start

`armTrigger` wires a tour's own `trigger` to a callback that fires once, and
returns a cancel function. A `manual` trigger never fires.

```ts
import { armTrigger, createPlayer, matchRules, detectDevice, seenCount, createLocalState } from '@tours/core';

const player = createPlayer(tour);
const cancel = armTrigger(tour, () => player.start());

// Or gate on the tour's targeting rules yourself:
const state = createLocalState();
const seen = seenCount(state, tour.id);
const matches = matchRules(tour.rules, {
  url: location.href,
  device: detectDevice(),
  firstVisit: seen === 0,
  seenCount: seen,
});
if (matches) player.start();
```

### Closing a tour

The × is always available — a visitor who has lost interest must be able to
clear the screen. What it *means* is a per-tour setting:

```ts
{
  id: 'welcome',
  // …
  dismiss: {
    mode: 'minimize',              // or 'end' (default)
    resume: {                      // optional; these are the defaults
      text: 'Carry on with the tour?',
      button: 'Resume',
      corner: 'bottom-right',
    },
  },
}
```

- **`end`** (default) — the tour is finished: progress is cleared and it does
  not come back.
- **`minimize`** — the tour is set aside: progress is kept and a small corner
  invitation offers to pick it up. It reappears on later pages too, because the
  flag is stored with the progress rather than held in memory.

A minimized tour never auto-resumes — that would make minimizing pointless.
Coming back is always the visitor's click.

The invitation is the same popover as the `cta` start trigger, so a site has one
small component to style, not two. Restyle it with custom properties on the host
page:

```css
:root {
  --tours-cta-bg: #101828;
  --tours-cta-fg: #f9fafb;
  --tours-cta-radius: 10px;
  --tours-cta-btn-bg: #7c3aed;
  --tours-cta-btn-bg-hover: #6d28d9;
  --tours-cta-btn-fg: #fff;
  --tours-cta-border: #1f2937;
  --tours-cta-shadow: 0 8px 24px rgba(0, 0, 0, .5);
}
```

For a design those cannot reach, replace the renderer outright — it must return
a function that removes whatever it built:

```ts
mountTours(tours, {
  state: createLocalState(),
  renderResume: ({ tourId, text, button, onResume }) => {
    const el = myDesignSystem.toast({ text, action: { label: button, onClick: onResume } });
    return () => el.dismiss();
  },
});
```

`player.minimize()` does the same thing programmatically.

### Card buttons

The footer adapts to the step rather than showing a fixed pair:

| Button | Shown when |
|---|---|
| Back | there is a previous step **on this page** |
| Next | the step is not interactive, or it is the last step |
| Done | on the last step, in place of Next |
| × | always |

Back is omitted rather than disabled on the first step, and omitted across
pages: going back over a page boundary meant `history.back()`, which lands
wherever the visitor came from — not necessarily the tour's previous page.

Override the labels per step with `backLabel` / `nextLabel`.

### Lifecycle events

Every stage is reported, and two stages can be blocked.

```ts
createPlayer(tour, {
  on: {
    tourStarting: ({ tour }) => featureEnabled(tour.id),   // false ⇒ do not start
    stepChanging: ({ from, to }) => formIsValid(),          // false ⇒ stay put
    stepActivated: ({ step, target }) => analytics.track('step', step.id),
    stepSkipped:   ({ step, reason }) => console.warn(step.id, reason),
    tourCompleted: ({ tour }) => analytics.track('tour_done', tour.id),
  },
});
```

| Event | Payload | Cancellable |
|---|---|---|
| `tourStarting` | `{ tour, index }` | ✅ |
| `tourStarted` | `{ tour, index }` | |
| `stepChanging` | `{ tour, from, to, step }` | ✅ |
| `stepActivated` | `{ tour, index, step, target }` | |
| `stepSkipped` | `{ tour, index, step, reason }` | |
| `tourMinimized` | `{ tour, index }` | |
| `tourResumed` | `{ tour, index }` | |
| `tourCompleted` | `{ tour }` | |
| `tourDismissed` | `{ tour, index }` | |

`stepActivated` fires once the target has actually resolved and the card is
placed — not when the step is merely selected, so `target` is always a live
element. `tourCompleted` means the tour ran to the end; `tourDismissed` means it
was closed before that.

Every transition between steps passes through `stepChanging`, including the
automatic advance on an interactive step, so a veto cannot be sidestepped by a
different code path.

The same events are dispatched on `document` as `tours:<name>`, with the payload
in `detail` — for a page that loaded the UMD bundle and has no build step:

```html
<script>
  document.addEventListener('tours:stepActivated', (e) => {
    console.log(e.detail.step.id);
  });
  document.addEventListener('tours:stepChanging', (e) => {
    if (!formIsValid()) e.preventDefault();   // same veto as returning false
  });
</script>
```

A handler that throws is logged and ignored — it never takes the tour down, and
never counts as a veto.

### Picking elements

The picker underpins the builder in `@tours/editor`, and is exported for hosts
that want their own authoring UI:

```ts
import { createPicker } from '@tours/core';

// The callback receives the ranked selector candidates for the clicked
// element, then the picker stops itself.
const picker = createPicker((selectors) => console.log(selectors));
picker.start();
```

Pass `{ ignore: [myToolbar] }` as the second argument to keep the picker from
reacting to your own UI.

## API

| Export | Purpose |
|---|---|
| `createPlayer(tour, options?)` | `PlayerHandle` — `start(index?)`, `stop()`, `next()`, `prev()`, `minimize()`, `isActive()` |
| `resumeTour(tour, options?)` | Continue after navigation; `null` if nothing to resume here |
| `mountTours(tours, opts)` | Register tours; auto-resume + auto-start across navigation |
| `armTrigger(tour, fire)` | Wire the tour's trigger; returns a cancel function |
| `createPicker(onPick, options?)` | Interactive element picker |
| `buildSelectors(el)` | Ranked selector candidates for an element |
| `resolveElement`, `waitForElement` | Resolve a `SelectorLike[]`, incl. late-rendering targets |
| `RuntimeTour`, `RuntimeStep`, `SelectorLike` | Types for the node-accepting runtime shape |
| `matchRules`, `detectDevice` | Targeting rules and device class |
| `matchUrl`, `deriveUrl` | Page matching for multi-page tours |
| `createLocalState`, `readProgress`, `writeProgress`, `clearProgress` | Progress persistence |
| `seenCount(state, tourId)`, `markSeen(state, tourId)` | "Show this tour only N times" bookkeeping |
| `renderCard`, `placeCard`, `autoSide`, `CARD_STYLES` | Card rendering and positioning primitives |
| `createLogger`, `isLoggingEnabled` | Opt-in debug logging |

Tour and step types come from [`@tours/schema`](../schema) and are re-declared
in this package's `.d.ts`, so you do not need to install it.

## License

MIT
