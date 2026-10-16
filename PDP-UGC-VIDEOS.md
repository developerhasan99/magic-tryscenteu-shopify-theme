# UGC video row on product pages (tryscent.eu)

Status: LIVE since 2026-10-17 (push of `feat/pdp-ugc-videos`, main 7470c42).
No clips are picked yet, so live pages look as before until clips are added in
Customize. Reference: the video row on theessencevault.co.uk product pages,
measured in its DOM.

## What it is
A theme-editor block "Wideo UGC" (`ugc_videos`, limit 1) in the Product
information section (`sections/main-product.liquid`). Up to three clips in
ONE row in the info column, under the FAQ accordions. Adrian, 2026-10-16:
four in a row was too small to read, a 2x2 grid is out ("this has to be one
row"), so three. Clips keep their own 9:16 (110 x 195 px on a 375 phone,
98 x 174 at 820, 143 x 254 at 1440), about 2.5x the area of the four-in-a-row
3:4 tiles. One or two clips keep the one-third width and sit centred.

- Each clip: Files video (the picker also uploads from the computer) or a
  direct `.mp4` link, optional cover image, caption with an on/off checkbox,
  linked product.
- On the clip: the collection tile's white product card (photo, title,
  price) links to the product; Adrian approved its look. Under 130 px of
  tile a 26 px photo and a 10 px title, from 130 px 32 px and 11 px; the
  title may take up to four lines ("Letnia Świeżość – Zestaw Podróżny"
  needs four); no "+" (no room). Captions under the clip, 13 px bold.
- Product left empty = this page's product. A card for the page the shopper
  is already on scrolls to its offer (`.bundle-price-pdp` on a bundle page,
  `#atc_scroll_target` on a perfume page), below the sticky header, and
  closes the player first when tapped there. A product that cannot be
  bought gets no card (the six sold-out themed sets show clips only).
- Tap the clip: full-screen player with sound; under the clip the collection
  tile's white product pill (photo, title, price) links to the product.
- Preview: clips play muted one after another (2 s after a clip is half on
  screen, 3 s each, 5 s pause, loop), only the clips that are at least half
  in view. Off with "Podgląd" unticked, under reduced motion, on hover, and
  while keyboard focus is in the row. A "Wstrzymaj podgląd" button appears
  for keyboard users (WCAG 2.2.2).
- "Ukryj kartę Polecany zestaw, gdy są klipy" (default on): the featured
  bundle card hides itself once the row has a playable clip, so the row takes
  its place. Untick it to show both.

Folders, Google Drive and YouTube links do not work as clips: Shopify has no
folder picker, and only direct mp4 files play in the row.

## Placement
Placed on `product.quantity-breaker.json` (80 live products) and
`product.json`, right after `collapsible_tab_Qn8c4p` and before
`featured_bundle_main`, with three Polish captions and the 6×50 ml bundle
prefilled and no clips. Also on `product.custom-bundle.json` (14 bundle
pages: 3x/6x/8x/10x and the themed sets, Adrian 2026-10-16), right after
`collapsible_tab_Qn8c4p`, with the captions and NO product, so each bundle
page's card shows that bundle. The block settings are per template: clips
picked on quantity-breaker do not appear on the bundle pages, and the
reverse. Nothing changes on a live page until clips are picked. The Polish
market templates do not override the main section, so the parent's block
renders there. Available but not placed: expressive-notes, e-notes-sof,
payday-60, mystery-perfume, christians-pdp.

## Files
- `snippets/ugc-video-row.liquid`: row, tiles, captions, product cards,
  player, pills.
- `snippets/ugc-video-count.liquid`: number of slots with a playable clip;
  read by the row and by the featured bundle guard in main-product.
- `snippets/ugc-video-src.liquid`: the mp4 rendition picker, moved out of
  `fuel05-ugc-tile.liquid` and shared with the collection grid tiles
  (rendered markup checked identical).
- `assets/ugc-video-row.css`, `assets/ugc-video-row.js`: loaded only when the
  row renders.

## Adding clips (Adrian)
Customize → product template "quantity-breaker" (and "Default product",
and "custom-bundle" for the bundle pages) →
Product information → Wideo UGC → Wideo 1 to 3: pick the video (or paste an
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

Re-run after the three-in-one-row change (2026-10-16, port 9295): 360 /
375 / 820 / 1024 / 1440 on both templates, three equal 9:16 tiles on one
line, card inside the clip and the tap target at its centre, bundle title
"6X 50ml Flakony Perfum" on three lines with nothing cut, price clear of
the card edge, play mark clear of the card, no sideways scroll. Player
opens with sound on a real click at 375 and 1440, Esc closes, the card goes
to the bundle. Preview 2.2 / 5.3 / 8.3 s, then the 5 s pause. Theme check:
no new offenses (main-product's three warnings are older).

Bundle pages (custom-bundle, 2026-10-16): 6x-50ml-parfumflaschen,
3x-50ml-perfume-bottles and das-daiquiri-sommer-reiseset-fur-sie at 375 and
1440: three in one row, each card shows the page's own bundle (6X 181,99 zł,
3X 115,99 zł, Letnia Świeżość 87,99 zł) in full; tapping the card, or the
card in the player (which closes), stops at the bundle price 12 px under
the sticky header (65 px phone, 86 px desktop), no reload. The perfume
page card still opens the 6x bundle page.

Not checked on a real iPhone: the `#t=0.001` first-frame paint for pasted
links without a cover, and the native control layout in the player.

## Go-live and rollback
Done 2026-10-17: origin/main (364dc55) merged into the branch, tag
`live-before-pdp-ugc-2026-10-17` and branch `backup/live-2026-10-17` on the
remote, live theme pulled to `Documents/dev/_backups/tryscent-eu-live-2026-10-17/`
and uploaded as unpublished theme 165433016579 "BACKUP live 2026-10-17", then
`git push origin feat/pdp-ugc-videos:main`. Read-back: all 11 changed files
match the repo by Admin API checksum (templates accepted), product and bundle
pages 200 without Liquid errors, the featured bundle card still shows (no
clips). Rollback: publish theme 165433016579 in the admin, or `git revert -m 1`
the merge and push to main.

## Bundle pages: buy box and Polish texts (LIVE 2026-10-17)
`snippets/custom-offer-bundle.liquid` (custom-bundle template only, 14 pages):
the old guarantee block under the button (thumbs-up image with the German
alt "Daumen-hoch-Abzeichen", "60 dni —", the desktop refund line) is replaced
by the perfume-page layout: `payment-badge.svg` strip, then
`render 'shipping-badges'` (48h / InPost / 60 days). "Designerpreis:" became
"Cena oryginałów:" (shows only on bundles with a compare-at price; the 3x
bundles have none). The offer's first div carries `id="atc_scroll_target"`,
so the stacks-up "Odkryj MagyX" button scrolls to the offer here too.

Product data, same go: metafield `custom.bundle_product_content` German to
Polish on 3x-50ml-perfume-bottles, 3x-100ml-perfume-bottles-1,
6x-50ml-parfumflaschen and 6x-50ml-parfumflaschen-1 ("3 flakony / 6 flakonów
w pełnym rozmiarze. Te same designerskie zapachy – bez 90-procentowych marż
narzucanych przez projektantów.", the 8x bundle's wording).

Backups: tag `live-before-bundle-pl-2026-10-17` and branch
`backup/live-before-bundle-pl-2026-10-17` (= f866d83), files in
`Documents/dev/_backups/tryscent-eu-live-2026-10-17-before-bundle-pl/` (454),
unpublished theme 165433737475 "BACKUP live 2026-10-17 (before bundle PL)".
The German metafield values are in the session snapshot only; they are the
"now" column of the table in the hand-over (and `git log` of this file).

Read-back: both files match the repo by Admin API checksum; metafieldsSet
returned no errors and a fresh read shows the four Polish values; all 13
bundle pages visible on the DE market render the new block (no old block, no
"Designerpreis", 3 badges, one anchor), 6x-50ml-parfumflaschen-1 is PL-market
only and checked with the PL cookie. Browser check on live at 375 and 1440:
button, payment strip 32 px below, badges, FAQ; "Odkryj MagyX" stops 12 px
under the header.

Found, not changed: 6x-50ml-parfumflaschen-1 has no product photos, so
`sections/floating-atc.liquid` line 15 prints "Liquid error: invalid url
input" in the desktop thumbnail (same on the old live).
