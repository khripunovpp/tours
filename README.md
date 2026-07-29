# Tours

Product tours you point-and-click together in the page itself, then replay for
visitors. No React, no jQuery, no runtime dependencies — the player is ~7 KB
gzipped and renders entirely inside a shadow DOM, so a host page's CSS cannot
reach it and it cannot leak styles back.

Ships three ways: as npm packages, as drop-in `<script>` bundles, and as a
WordPress plugin.

```ts
import { createPlayer } from '@tours/core';

createPlayer({
  id: 'welcome',
  schemaVersion: 1,
  title: { default: 'Welcome' },
  steps: [
    { id: 'compose', selectors: ['#btn-new-post'], content: { default: 'Write your first post here.' }, placement: 'bottom' },
    { id: 'submit',  selectors: ['form button[type="submit"]'], content: { default: 'Then publish it.' }, placement: 'top' },
  ],
}).start();
```

## Why

- **Authored in the page, not in a config file.** Open any page with
  `?tours-edit=1`, click the elements you want to highlight, type the copy.
  The builder writes the selectors for you and hands back validated JSON.
- **Selectors that survive a redeploy.** Every step stores a ranked list of
  candidate selectors; the player tries each in turn and waits for late-rendering
  targets instead of silently skipping them.
- **Multi-page and SPA tours.** Progress persists across full navigations, and
  the player follows `history.pushState` for client-side routing.
- **Isolated by construction.** Shadow DOM everywhere, no global CSS, no
  `!important` arms race.
- **Zero runtime dependencies.** Every published package installs nothing else.

## Install

The packages are distributed straight from git — there is no npm registry
release. `#path:` selects a package inside the monorepo, which **pnpm and yarn
support but plain npm does not**.

```bash
# The visitor-facing player
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/core"

# The in-page tour builder (authoring)
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/editor"

# Types + validation only
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/schema"
```

Pin a tag or commit by appending it before the fragment —
`…/tours.git#v0.1.0&path:/packages/core`.

> On plain npm, or want no git dependency at all? Use the drop-in bundles below.

### Drop-in `<script>` — no build step

`dist/` holds prebuilt, self-contained bundles. Copy the file you need and
serve it:

```html
<script type="module">
  import { createPlayer } from '/vendor/tours-player.js';
  createPlayer(tour).start();
</script>
```

There is also `dist/tours-editor.umd.js`, which exposes a `window.Tours` global
for classic `<script>` tags. See [`dist/README.md`](dist/README.md).

### WordPress

Upload `dist/wordpress-plugin/site-tours.zip` via **Plugins → Add New →
Upload**. Build it first with `pnpm build:wp`.

## Quickstart

Play a tour, persisting progress so it survives navigation:

```ts
import { createPlayer, createLocalState, armTrigger } from '@tours/core';
import tour from './welcome.tour.json';

const player = createPlayer(tour, { state: createLocalState() });

// Start when the tour's own trigger fires (element appears, delay, on load…).
// Returns a cancel function. A `manual` trigger never fires — call start() yourself.
const cancel = armTrigger(tour, () => player.start());
```

Resume a multi-page tour after a full page load:

```ts
import { resumeTour, createLocalState } from '@tours/core';

resumeTour(tour, { state: createLocalState() });
```

Author a tour in the page:

```ts
import { TourBuilder } from '@tours/editor';

// Mounts only when the URL carries ?tours-edit=1 — safe to ship to production.
TourBuilder.fromUrl();
```

Validate untrusted JSON before playing it:

```ts
import { migrate } from '@tours/schema';

// migrate() upgrades older schema versions and validates the result.
// For data you know is current, `validate()` alone is enough.
const result = migrate(JSON.parse(input));
if (!result.ok) throw new Error(result.errors.join('\n'));
createPlayer(result.tour).start();
```

## Packages

| Package | Size (gzip) | What |
|---|---|---|
| [`@tours/core`](packages/core) | ~8 KB | Player, element picker, triggers, progress, rules |
| [`@tours/editor`](packages/editor) | ~25 KB | In-page tour builder; bundles the core it needs |
| [`@tours/schema`](packages/schema) | ~2 KB | Tour data model, defaults, `validate`, `migrate` |

Each is **self-contained**: cross-package code is bundled in rather than
declared as a dependency, so a git-installed package resolves with nothing
else. The trade-off is that installing both `core` and `editor` duplicates the
schema (~2 KB gzip).

Two more packages are internal and not installable —
`packages/wordpress-adapter` (the WP plugin) and
`packages/authoring-extension` (an MV3 browser extension).

## Development

Requires Node 20+ and pnpm 11.

```bash
pnpm install
pnpm dev            # demo site on http://localhost:5173
```

The demo is a mock community site used to exercise the player and builder.
`hub.html` links the rest: `index.html` and `profile.html` (a two-page tour),
`triggers.html` (auto-start conditions) and `spa.html` (client-side routing).
Open any of them with `?tours-edit=1` to bring up the builder.

Framework integration demos live in `demos/*`, each with its own toolchain:

```bash
pnpm dev:react      # also: dev:vue, dev:svelte, dev:solid, dev:angular
pnpm dev:all        # every demo in parallel
```

In dev, `@tours/*` imports resolve to TypeScript **source** via the
`development` export condition — edits hot-reload with no rebuild.

### Build

```bash
pnpm build:packages   # packages/*/dist — the installable npm packages
pnpm build:lib        # dist/tours-*.js — drop-in script bundles
pnpm build:wp         # dist/wordpress-plugin/ + .zip
pnpm build:ext        # dist/extension/ — load unpacked
pnpm build:all        # all of the above
pnpm typecheck
```

`packages/*/dist` is **committed**, unlike most build output. Git install ships
the repository tree as-is, so the built files have to be in it — rerun
`pnpm build:packages` and commit the result whenever you change a package.

### Layout

```
packages/
  schema/               data model + validation (no dependencies)
  core/                 player, picker, triggers
  editor/               in-page builder
  wordpress-adapter/    WP plugin (PHP + front/admin bundles)
  authoring-extension/  MV3 browser extension
demo/                   vanilla demo site
demos/                  react, vue, svelte, solid, angular demos
scripts/                build pipelines
dist/                   committed drop-in bundles + assembled artifacts
```

## License

MIT — see [LICENSE](LICENSE).
