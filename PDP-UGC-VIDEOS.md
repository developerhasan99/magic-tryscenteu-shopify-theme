# UGC video row on product pages (tryscent.eu)

Status: built and QA'd on the dev theme 165334122755, branch
`feat/pdp-ugc-videos` (2026-10-16). Not live yet. Reference: the video row on
theessencevault.co.uk product pages, measured in its DOM.

## What it is
A theme-editor block "Wideo UGC" (`ugc_videos`, limit 1) in the Product
information section (`sections/main-product.liquid`). Up to four clips side
by side in the info column, under the FAQ accordions:

- Each clip: Files video (the picker also uploads from the computer) or a
  direct `.mp4` link, optional cover image, caption with an on/off checkbox,
  linked product.
- On the clip: a round product photo with "+" that links to the product.
- Tap the clip: full-screen player with sound; under the clip the collection
  tile's white product pill (photo, title, price) links to the product.
- Preview: clips play muted one after another (2 s after the row is half on
  screen, 3 s each, 5 s pause, loop). Off with "Podgląd" unticked, under
  reduced motion, on hover, and while keyboard focus is in the row. A
  "Wstrzymaj podgląd" button appears for keyboard users (WCAG 2.2.2).
- "Ukryj kartę Polecany zestaw, gdy są klipy" (default on): the featured
  bundle card hides itself once the row has a playable clip, so the row takes
  its place. Untick it to show both.

Folders, Google Drive and YouTube links do not work as clips: Shopify has no
folder picker, and only direct mp4 files play in the row.

## Placement
Placed on `product.quantity-breaker.json` (80 live products) and
`product.json`, right after `collapsible_tab_Qn8c4p` and before
`featured_bundle_main`, with the four Polish captions and the 6×50 ml bundle
prefilled and no clips. Nothing changes on a live page until clips are
picked. The Polish market templates do not override the main section, so the
parent's block renders there. Available but not placed: custom-bundle (bundle
pages), expressive-notes, e-notes-sof, payday-60, mystery-perfume,
christians-pdp.

## Files
- `snippets/ugc-video-row.liquid`: row, tiles, captions, chip, player, pills.
- `snippets/ugc-video-count.liquid`: number of slots with a playable clip;
  read by the row and by the featured bundle guard in main-product.
- `snippets/ugc-video-src.liquid`: the mp4 rendition picker, moved out of
  `fuel05-ugc-tile.liquid` and shared with the collection grid tiles
  (rendered markup checked identical).
- `assets/ugc-video-row.css`, `assets/ugc-video-row.js`: loaded only when the
  row renders.

## Adding clips (Adrian)
Customize → product template "quantity-breaker" (and "Default product") →
Product information → Wideo UGC → Wideo 1 to 4: pick the video (or paste an
mp4 link), optionally a cover, check the caption and the product → Save.

## QA (2026-10-16, localhost theme dev + dev theme on the live domain)
360 / 375 / 820 / 1024 / 1440 on both templates: row = column width, tiles
3:4 and equal, captions wrap without overflow, chip hit area 44 px clear of
the play mark. Preview timeline 2.1 / 5.2 / 8.2 / 11.2 s, loop after 5 s,
stops out of view and under reduced motion. Player opened by real mouse
input with sound; Esc, backdrop, X close; focus returns; Enter opens; offer
switch (2+1, 3+2) keeps it working; chip and pill go to the bundle. Player at
844×350, 915×356, 667×320, 320×256: pill readable, close button above the
clip. 3 clips → 3 columns; caption off; toggle off shows the bundle card;
no clips → no row, card shown. Section re-render (editor) re-arms the row and
tears the old one down. Theme check: no new offenses (OrphanedSnippet is a
false positive across 121 snippets).

Not checked on a real iPhone: the `#t=0.001` first-frame paint for pasted
links without a cover, and the native control layout in the player.

## Go-live and rollback
Follow the tryscent.eu pattern: merge origin/main into the branch, tag
`live-before-pdp-ugc-<date>` and a backup branch on the remote, then
`git push origin feat/pdp-ugc-videos:main`. Rollback: `git revert` the merge
and push to main.
