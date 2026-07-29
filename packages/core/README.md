# @tours/core

The visitor-facing half of [Tours](../../README.md): a product tour player,
an element picker, auto-start triggers and progress persistence.

~8 KB gzipped, **no runtime dependencies**. All UI renders inside a shadow DOM,
so the host page's CSS cannot reach it and it cannot leak styles back.

## Install

```bash
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/core"
```

`#path:` is supported by pnpm and yarn, not by plain npm. For npm, use the
prebuilt `dist/tours-player.js` bundle from the repository root instead.

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
| `createPlayer(tour, options?)` | `PlayerHandle` — `start(index?)`, `stop()`, `next()`, `prev()` |
| `resumeTour(tour, options?)` | Continue after navigation; `null` if nothing to resume here |
| `armTrigger(tour, fire)` | Wire the tour's trigger; returns a cancel function |
| `createPicker(onPick, options?)` | Interactive element picker |
| `buildSelectors(el)` | Ranked selector candidates for an element |
| `resolveElement`, `waitForElement` | Selector resolution, incl. late-rendering targets |
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
