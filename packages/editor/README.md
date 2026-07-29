# @tours/editor

The authoring half of [Tours](../../README.md): an in-page tour builder. Click
the elements you want to highlight, type the copy, and get back a validated
tour — no separate admin screen, no config file.

~25 KB gzipped, **no runtime dependencies**. It bundles the picker and player it
needs from `@tours/core`, and renders its whole UI inside a shadow DOM.

## Install

```bash
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/editor"
```

`#path:` is honoured by pnpm and yarn. **Plain npm ignores it silently** — it
reports `added 1 package` but installs the monorepo root, which then fails with
`TS2307: Cannot find module '@tours/editor'`.

For npm, install a packed tarball (`cd packages/editor && pnpm pack`) or use the
prebuilt `dist/tours-editor.js` (ESM) or `dist/tours-editor.umd.js`
(`window.Tours` global) from the repository root.

## Usage

The safest way to ship it: mount only when the URL carries a flag, so the
builder is inert for ordinary visitors.

```ts
import { TourBuilder } from '@tours/editor';

// Mounts iff the URL has ?tours-edit=1. Returns the builder, or null.
TourBuilder.fromUrl();
```

Or mount it yourself:

```ts
const builder = new TourBuilder({ mode: 'edit' });
builder.mount();
// …later
builder.destroy();
```

### Options

```ts
new TourBuilder({
  mode: 'edit',              // or 'off'
  navPosition: 'top',
  panelPosition: 'right',
  urlFlag: 'tours-edit',     // query flag used by fromUrl()
  topOffset: 32,             // clear a host's fixed bar (e.g. the WP admin bar)
  store: createLocalStore(), // primary draft store; defaults to localStorage
  storage: undefined,        // secondary store, always written to as well
  storageKey: 'tours:drafts',
});
```

### Persisting drafts

A `DraftStore` is just `load()` / `save(tours)`. Two are built in:

```ts
import { TourBuilder, createLocalStore, createWordPressStore } from '@tours/editor';

new TourBuilder({
  store: createLocalStore('my-app:drafts'),
  // Mirrored to the WP REST endpoint in addition to the primary store.
  // Failures here are logged, not fatal.
  storage: createWordPressStore({ url: '/wp-json/site-tours/v1/tours', nonce }),
}).mount();
```

Implement the interface yourself to persist anywhere else — the browser
extension in this repo uses a `chrome.storage` store so drafts survive across
origins.

### Drafts vs. tours

The builder works on a `DraftTour`, a superset of the shipped format that keeps
authoring-only state (excluded steps, status, kind). Compile it when you are
ready:

```ts
import { createDraftTour, toTour } from '@tours/editor';

const draft = createDraftTour();          // or 'template'
const result = toTour(draft);             // validates as it compiles
if (!result.ok) throw new Error(result.errors.join('\n'));

// result.tour is a plain Tour — hand it to createPlayer() from @tours/core
```

## API

| Export | Purpose |
|---|---|
| `TourBuilder` | The builder. `mount()`, `destroy()`, static `fromUrl(options?)` |
| `createDraftTour(kind?)` | New empty draft — `'tour'` (default) or `'template'` |
| `createDraftStep()`, `cloneDraft()` | Draft step/tour helpers |
| `toTour(draft)` | Compile + validate → `{ ok, tour }` or `{ ok: false, errors }` |
| `normalizeTours(input)` | Coerce untrusted JSON into `DraftTour[]` |
| `createLocalStore(key?)` | `localStorage` draft store (never throws) |
| `createWordPressStore(config)` | WP REST draft store |

Tour types come from [`@tours/schema`](../schema) and are re-declared in this
package's `.d.ts`, so you do not need to install it.

## License

MIT
