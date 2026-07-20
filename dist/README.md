# Prebuilt library bundles

Static, self-contained bundles you can drop onto any page — no build step, no
dependencies. Regenerate with `pnpm build:lib` from the repo root.

| File | Format | What |
|---|---|---|
| `tours-editor.js` | ESM | Tour builder (bundles core + schema) |
| `tours-editor.umd.js` | UMD | Same builder, exposed as `window.Tours` |
| `tours-player.js` | ESM | Visitor-facing player + element picker |

Each file is fully inlined (no shared chunks) and ships with a `.map` sourcemap.

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

No-code activation — just include the script and open the page with the flag:

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
