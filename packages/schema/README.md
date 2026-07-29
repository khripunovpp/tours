# @tours/schema

The tour data model for [Tours](../../README.md) — types, defaults, validation
and migrations. The single source of truth for the on-disk tour format, shared
by the player, the builder and the WordPress plugin.

~2 KB gzipped, **no dependencies**.

You usually do not need to install this: `@tours/core` and `@tours/editor` each
re-declare these types in their own `.d.ts`. Reach for it when you generate,
store or validate tours outside the player — a CMS, a build step, an API.

## Install

```bash
pnpm add "git+https://github.com/khripunovpp/tours.git#path:/packages/schema"
```

`#path:` is supported by pnpm and yarn, not by plain npm.

## Usage

```ts
import { validate, migrate, SCHEMA_VERSION } from '@tours/schema';
import type { Tour, Step } from '@tours/schema';

// Untrusted JSON of unknown age → migrate() upgrades, then validates.
const result = migrate(JSON.parse(input));
if (!result.ok) throw new Error(result.errors.join('\n'));
const tour: Tour = result.tour;

// Known to be current? validate() alone is enough.
validate(json); // → { ok: true, tour } | { ok: false, errors: string[] }
```

Neither function throws — both return a result object, and `errors` holds
human-readable messages suitable for showing to an author.

## The format

```jsonc
{
  "id": "community-onboarding",
  "schemaVersion": 1,
  "title": { "default": "Community onboarding", "ru": "Знакомство" },
  "steps": [
    {
      "id": "step-new-post",
      // Ranked candidates — the player tries each in turn.
      "selectors": ["#btn-new-post", "[data-testid=\"new-post\"]", "header button.primary"],
      "content": { "default": "Click here to write your first post." },
      "placement": "bottom",     // top | bottom | left | right | auto
      "align": "center",         // start | center | end
      "pageUrl": { ... },        // multi-page / cross-domain tours
      "condition": { ... },      // only show when this holds
      "action": { "type": "click" }
    }
  ],
  "trigger": { "type": "manual" },  // manual | load | selector | timer | cta
  "audience": "all",                // all | auth | guest
  "rules": [ ... ],                 // auto-start targeting
  "display": { "padding": 6, "radius": 6, "cardRadius": 10, "offset": 12 }
}
```

Every user-visible string is a `LocalizedText` — `{ default: string }` plus any
number of language keys. Runnable examples live in
[`examples/`](examples): a [single-page tour](examples/single-page.tour.json)
and a [multi-page, cross-domain one](examples/multi-page-cross-domain.tour.json).

## API

| Export | Purpose |
|---|---|
| `validate(json)` | `{ ok: true, tour }` or `{ ok: false, errors }` |
| `migrate(json)` | Upgrade an older `schemaVersion`, then validate |
| `SCHEMA_VERSION` | Current format version (`1`) |
| `DEFAULT_PADDING`, `DEFAULT_RADIUS`, `DEFAULT_CARD_RADIUS`, `DEFAULT_OFFSET` | Display defaults shared by player and editor |
| types | `Tour`, `Step`, `Rule`, `Trigger`, `Condition`, `Action`, `DisplaySettings`, `LocalizedText`, `UrlMatch`, `DeviceClass`, `CtaCorner` |

## Versioning

Bump `SCHEMA_VERSION` and add a migration whenever the format changes. `migrate`
refuses data whose `schemaVersion` is *newer* than it understands, rather than
guessing.

## License

MIT
