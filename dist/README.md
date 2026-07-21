# dist — built artifacts

Run `pnpm build:all` to produce everything here:

| Path | What |
|---|---|
| `tours-editor.js` / `.umd.js` | Library — tour builder (ESM / `window.Tours`) |
| `tours-player.js` | Library — visitor-facing player + picker (ESM) |
| `wordpress-plugin/site-tours/` | Installable WordPress plugin (folder) |
| `wordpress-plugin/site-tours.zip` | Same plugin, zipped for WP upload |
| `extension/` | MV3 browser extension — load unpacked |

The library bundles are committed; `wordpress-plugin/` and `extension/` are
derived (sources in `packages/*`) and git-ignored — build them locally.

## WordPress plugin

Upload `wordpress-plugin/site-tours.zip` via **Plugins → Add New → Upload**,
or copy `wordpress-plugin/site-tours/` into `wp-content/plugins/`.

## Library bundles

Static, self-contained (no shared chunks), minified. Approx. gzip:
`tours-player.js` ~6 KB, `tours-editor.js` ~20 KB.

## Use the builder

ES module:

```html
<script type="module">
  import { TourBuilder } from './dist/tours-editor.js';
  new TourBuilder({ mode: 'edit' }).mount();
</script>
```

Classic script (UMD global):

```html
<script src="./dist/tours-editor.umd.js"></script>
<script>
  new Tours.TourBuilder({ mode: 'edit' }).mount();
</script>
```

No-code activation — include the script and open the page with the flag:

```html
<script type="module">
  import { TourBuilder } from './dist/tours-editor.js';
  TourBuilder.fromUrl(); // mounts when the URL has ?tours-edit=1
</script>
```

## Use the player

```html
<script type="module">
  import { createPlayer } from './dist/tours-player.js';
  createPlayer(tour).start(); // `tour` is a @tours/schema Tour object
</script>
```
