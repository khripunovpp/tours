# Examples

The same vanilla page — three buttons and a three-step tour — installed five
different ways. No framework and no bundler in any of them: the package-manager
examples resolve the bare `@tours/core` specifier with a native
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap),
and the CDN example uses the UMD global.

These are **not** part of the pnpm workspace. They install the published
artifacts exactly as an outside consumer would, which is the point — if one of
them breaks, the packaging is broken.

| Example | Install source | Command |
|---|---|---|
| [`npm/`](npm) | release tarball | `npm install` |
| [`pnpm/`](pnpm) | git tag, `#path:` | `pnpm install --ignore-workspace` |
| [`yarn/`](yarn) | release tarball | `yarn install` |
| [`bun/`](bun) | release tarball | `bun install` |
| [`cdn/`](cdn) | jsDelivr, no install | just open `index.html` |

Then `npm start` (or the equivalent) and open the page. The CDN example needs
no server at all — open the file directly.

## Why the install sources differ

`#path:` selects one package out of the monorepo, and **only pnpm and yarn
honour it**. Plain npm ignores it without erroring: it reports `added 1 package`
and installs the *monorepo root*, which later fails with
`TS2307: Cannot find module '@tours/core'`. So npm, yarn and bun use the release
tarball, which every package manager handles correctly.

`--ignore-workspace` is needed for the pnpm example only because it lives inside
this repository — pnpm would otherwise find the root `pnpm-workspace.yaml` and
link the local package instead of fetching the tag. Outside the repo it is just
`pnpm install`.

## CDN and integrity

The CDN example pins `integrity` and sets `crossorigin="anonymous"`. Both are
required together: without `crossorigin` the response is opaque, the browser
cannot hash it, and the script is blocked.

Integrity only means something against an **immutable** URL, so the example
points at the `@v0.2.0` tag. Aim it at a branch and the hash breaks on the next
commit.

Regenerate after a release, and check the CDN really serves those bytes:

```bash
node scripts/sri.mjs --tags     # ready-to-paste <script> tags
node scripts/sri.mjs --verify   # re-hash what jsDelivr actually returns
```

## Bumping to a new release

The version appears in each `package.json` and in the CDN example's URL and
hash. After tagging a release:

```bash
pnpm build:packages
node scripts/sri.mjs --tags     # paste the new tag + hash into cdn/index.html
```
