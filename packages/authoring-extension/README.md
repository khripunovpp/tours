# Site Tours — authoring extension (MV3)

A Chrome/Edge extension that mounts the tour builder on **any** page, so you can
author tours across domains. Drafts are stored in `chrome.storage.local`, which
(unlike a site's localStorage) is shared across origins — so a multi-domain
tour's draft survives navigating from site A to site B while you build it.

## Build & load

```
pnpm --filter @tours/authoring-extension build
```

Then in Chrome: `chrome://extensions` → enable **Developer mode** → **Load
unpacked** → select `dist/extension` (at the repo root).

Click the toolbar icon on any page to toggle the builder. Click again to close.
