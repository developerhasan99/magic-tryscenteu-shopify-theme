# Short description under the product title (tryscent.eu)

Live since 17.10.2026 (commits ba5446b, bcae589).

## What shows
On the product page, directly under the title and the Judge.me stars:
1. the product's short description (1-2 sentences);
2. an underlined uppercase link **PEŁNY OPIS**, which opens the "Profil zapachowy" accordion (the full product description) further down and scrolls to it.

Nothing shows while the field is empty. The theme editor shows a dashed placeholder instead.

## Where the text lives
- Product metafield `custom.short_description`, type `multi_line_text_field`. The definition "Short description" exists, is pinned on the product page in admin, and has storefront read access.
- Edit it in Admin → Products → product → Metafields → Short description, or through the Admin API (below).

## Rules for the text
- Polish only (the store's copy is Polish).
- 1-2 sentences, at most 220 characters.
- Plain text, no HTML. A line break in the field becomes a line break on the page.
- No prices or currency. The store sells in several currencies and prices change.
- No em dashes (—).
- No designer brand names (the "Inspiracja" row already shows the original).
- Only what the product's own data says: family, character, notes, set contents. No new claims about longevity, concentration or health. "Do 12 godzin trwałości" and "20–24% olejków zapachowych" are fine; they are on the page already. The concentration is always 20–24% (Adrian, 17.10.2026), never 19–21% or 21%.

## Write or change it (Admin GraphQL)
```graphql
mutation {
  metafieldsSet(metafields: [{
    ownerId: "gid://shopify/Product/<id>",
    namespace: "custom",
    key: "short_description",
    type: "multi_line_text_field",
    value: "Korzenno-cytrusowa kompozycja dla mężczyzn, którzy idą własną drogą."
  }]) { metafields { id } userErrors { field message } }
}
```
To hide it again, delete the metafield (`metafieldsDelete` with ownerId, namespace, key). An empty value is rejected.

## Where it is wired (theme)
- `snippets/short-description.liquid`: markup. It is the same file as in the magyx.co theme.
- `assets/mgx-sdesc.css`, `assets/mgx-sdesc.js`: style and the link's open-and-scroll.
- `sections/main-product.liquid`: block `short_description`. Settings: link label, and the id of the accordion block to open (`collapsible_tab_FAAFhb`).
- Templates:
  - `product.quantity-breaker.json` (81 perfumes), after the stars. The "Profil zapachowy" accordion is switched on there for this link.
  - `product.custom-bundle.json`, after the Judge.me stars. (The Poland overlay that used to order it was retired on 17.10.2026, see `PL-BASE.md`.)

## Message for GrokBot (paste)
> Na tryscent.eu każdy produkt ma nowe pole „Short description” (metafield `custom.short_description`, typ `multi_line_text_field`). Tekst z tego pola pokazuje się na stronie produktu pod tytułem i gwiazdkami, a pod nim link „PEŁNY OPIS” do pełnego opisu. Pusty = nic się nie pokazuje. Zasady: po polsku, 1-2 zdania, max 220 znaków, sam tekst bez HTML, bez cen i walut, bez długich myślników (—), bez nazw marek designerskich, tylko fakty z danych produktu (rodzina zapachowa, charakter, nuty, zawartość zestawu). Zapis: `metafieldsSet` z ownerId produktu, namespace `custom`, key `short_description`, type `multi_line_text_field`. Usunięcie: `metafieldsDelete`.
