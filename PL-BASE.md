# Poland look = base for every market (17.10.2026)

## Why
Poland and DE (plus GR/HU/RO/SK/SI) share the root domain `tryscent.eu/`, and the store's backup region is
Germany. Every visitor without a stored choice lands in market **DE**, even from a Polish IP. Shopify only
*suggests* Poland. The Polish look lived in 9 `*.context.poland.json` overlays (+ code keyed on the visitor's
country), so most real Polish visitors saw the older base. A phone showed the Polish version only after it had
once been switched (`?country=PL` link, the country picker, a checkout, an in-app browser's own cookies).
Market precedence measured live: `?country=` > cart country > `localization` cookie (1 year) > backup region DE.

**Update 18.10.2026:** backup region switched to **Poland** (Settings → General → Backup region) and the Poland
market owns the root web presence. A visitor with no stored choice now lands in market **poland** (Poland
catalog, Kite thresholds apply), from any IP. Visitors who still carry a stored DE choice stay on DE and the
"de" catalog until it expires, so "de" should keep every product Poland has (it has auto-publish off).

## What changed
- The 9 Poland overlays were folded into their parents and deleted; the DE payday overlay was deleted.
  Only the 3 Czech overlays remain (`index`, `collection.payday-page`, `header-group`).
- `snippets/storefront-country.liquid`: markets with their own subfolder (czech, france, ireland, portugal,
  spain, sweden) keep the visitor's real country; every root-domain market counts as `pl`.
  Used by `bundle-image-alt` (bundle graphics in cards and the PDP gallery) and `payment-icons`
  (footer + PDP payment badges). Looks only: prices, catalog and checkout still follow the real market.
- Concentration claim: 20–24% everywhere (was 19–21% / 21%). Comparison figures stay.
- Markets, catalogs, price lists and the `ttshop` market (TikTok Shop via M2E) were not touched.

## Rules from now on
- **Edit the base templates. Never create or edit a `*.context.poland.json`.** In the theme editor keep the
  market switch on the default context; a save in the "Poland" context recreates an overlay and brings the
  split back. Any commit that adds one is a regression.
- Czech copy lives in the 3 Czech overlays; leave them.

## Rollback
- Fastest: publish unpublished theme **165461917955 "BACKUP live 2026-10-17 pre-PL-base"** (exact copy of the
  old live theme; only the Poland cart-drawer setting overlay is missing, the CLI cannot upload it).
- Git: tag `live-before-pl-base-2026-10-17` / branch `backup/live-before-pl-base-2026-10-17`. Undo in reverse,
  one push per step: parents back to the stage-1 versions, then restore the overlays, then the rest.
  Never restore the overlays and the final parents in one push (the overlays' `type` keys collide).
- Tools and baselines: `Documents/dev/_backups/tryscent-eu-pl-base-2026-10-17/tools/`
  (`verify_files.py <git-ref> [theme_id]` compares a theme with a commit, incl. market translations).
