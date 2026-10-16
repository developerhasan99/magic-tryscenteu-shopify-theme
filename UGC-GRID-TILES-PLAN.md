# UGC video tiles in the collection grid (tryscent.eu)

Status: built 2026-10-16 on branch `feat/ugc-grid-tiles`, QA passed on the dev
theme 165334122755. Ported from the live magyx.co theme
(`tryscent-magyxco-shopify-theme`, same file names).

## What it is
A theme-editor block "UGC video" in the Product grid section
(`sections/main-collection-product-grid.liquid`). Each block puts one video tile
into the grid before the product at its position, on page one only. Nothing
shows until a block is added in Customize, so the push changes no live page.

Block settings: Position (2 = before the 2nd product), Show on (Desktop /
Mobile / Desktop and mobile; switch at 750 px), Video (tryscent.eu Files) or
Video URL, Poster image (optional), Linked product (white pill with image,
title, price; desktop only, as on magyx.co).

## Files
- `sections/main-collection-product-grid.liquid`: asset tags before
  `#ProductGridContainer` (loaded only when a UGC block exists), tile `<li>`
  inside the products loop, block schema.
- `snippets/fuel05-ugc-tile.liquid`: the tile. Label "Odtwórz wideo".
- `assets/fuel05-ugc.css`, `assets/fuel05-ugc.js`: styles and playback (in-view
  clip plays muted, a tap turns the sound on, one clip at a time, re-arms after
  facets.js re-renders the grid). The pill "+" uses the MAGYX black #100F0D
  instead of the reference green.

## Behaviour specific to this theme
- Infinite scroll appends page two onwards; tiles are page one only, so the
  appended pages carry none and the order does not shift.
- Polish market templates (`*.context.poland.json`) override the parents
  without block changes; verified that blocks added on the parent template
  render for the Polish market.
- The block is available on every template that uses the section: collection,
  bestsellers, bundle-save, payday-page, warehouse.

## Changes against the magyx.co files (after review)
- Tiles fill their grid cell at every width (`height: 100%`, floor 300 px), so
  rows match the cards from 360 to 1440. The fixed 260/494 ratio stretched the
  neighbouring card at 820 and left background under the tile at 1024.
- Pill: drops its thumbnail when the tile is under 250 px wide (container query
  on the tile; four columns between 990 and about 1150 px of window), so the
  price no longer runs under the "+". "+" in `--mgx-black`.
- Product title through `polish-store-text` (pill, thumbnail alt, aria-label).
- Poster overlays `loading="lazy"`; the warm-up skips clips hidden on the
  device, so a phone does not buffer desktop-only clips.
- One tile per position per device (schema hint): two tiles at the same
  position on the same device would share a row with no product to size it.

## QA (2026-10-16, dev theme, collection /collections/woman)
360, 375, 820, 1024, 1180, 1440: tile height = cell height = card height in
every row; mobile tile before product 2, desktop tiles before products 3 and 6, hidden-device
tiles have no box, pill "181,99 zł" links to the bundle, corners 8 px like the
cards, tap plays with sound and pauses the other clip, sort re-render keeps the
tiles armed, page 2 loads 200 via the Section Rendering API with tiles unchanged.
Console: the same single "Failed to fetch" as on live. Localhost-only noise: the
Section Rendering API returns 404 under `shopify theme dev` (works on the preview
domain and on live).

## Go-live and rollback
Backups before the push: tag `live-before-ugc-grid-2026-10-16` and branch
`backup/pre-ugc-grid-2026-10-16` (= origin/main 69d9732). Push: merge
origin/main into the branch, then `git push origin feat/ugc-grid-tiles:main`.
Rollback: `git revert` the merge and push to main.

## Adding a tile (Adrian)
Customize → open a collection template → Product grid → Add block "UGC video"
→ set Position and Show on, pick the clip from Files (or paste a link in Video
URL), optionally a Linked product → Save.
