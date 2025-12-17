**SR01 — Product Catalog (Client)**

- Source: 2.MRSW-Software (MoTaUC)_online.xlsx → sheet `SR01`
- Basis: UI screenshots found in the workbook (xl/media image7–image16)

This update rewrites three sections to align with the current UI: Actions, Font, and Focus Rules. Use this content to replace the respective blocks in SR01.

**Actions**

Use the table in `docs/SR01_UI_Spec_Update.csv` to import into Excel (columns: `ID,Item Name,Action`). Key behaviors are summarized below:

- Global search: typing a query in `Search Products` then Enter navigates to search results.
- Cart icon: opens bag; badge shows current count; Enter/Space activates.
- Brands, Shop, Welcome menus: open on click or Enter/Space; close on Esc or outside click; arrow keys navigate items.
- Side menu (hamburger/overlay): opens/closes; focus is trapped when open; Esc closes.
- Hero CTA `Shop Now`: navigates to the Shop listing view.
- Promotional banners/cards: clicking navigates to the target collection or offer.
- Product card actions: clicking image/title opens details; `Add To Cart` adds 1 unit; disabled when out of stock; confirmation announced to screen readers.
- Listing filters: 
  - Price slider (two thumbs) limits min/max; results update.
  - Rating filter: show products with rating ≥ selected stars.
  - Sort dropdown: `Newest First`, `Price: Low → High`, `Price: High → Low`, `Top Rated`.
  - Result summary: shows range (e.g., “Showing 1–4 of 4 products”).
- Product detail: choose quantity; add/remove bag; share via social icons; stock count visible.
- Reviews: star rating input (1–5), text review, recommend Yes/No, Publish.
- Footer newsletter: enter email and `Subscribe`; validate format.

**Font**

Adopt a consistent, responsive scale and correct size names (replace “Very Small” with “Extra Small”). Use rem units for scalability; map approximations for reference in points/px.

- Family: system stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`).
- Line-height: 1.4–1.6 for body, 1.2–1.35 for headings.
- Weights: 700 (bold headings), 600 (buttons/labels), 400 (body).
- Color: body `#1f2937`, secondary text `#6b7280`, link `#2563eb`.

Size mapping:

- Extra Large — 1.875rem ≈ 30px (use for hero headings)
- Large — 1.5rem ≈ 24px (section headers)
- Medium — 1.25rem ≈ 20px (card titles, price)
- Small — 1rem ≈ 16px (body text, inputs)
- Extra Small — 0.875rem ≈ 14px (meta, badges)

Component usage:

- H1: 2.0–2.25rem/700; H2: 1.5rem/700; H3: 1.25rem/600.
- Button/CTA: 0.9375–1rem/600; uppercase optional; min touch target 44×44px.
- Inputs/placeholders: 1rem/400; label 0.875–1rem/600.

**Focus Rules**

Accessible keyboard and focus behavior aligned with WCAG 2.1 AA.

- General: use `:focus-visible` for keyboard; never remove outlines globally. Provide a 2px high-contrast ring with 2px offset.
  - Light background: ring `#2563eb` at 2px + 2px offset shadow `rgba(37,99,235,0.35)`.
  - Dark/colored banners: ring `#ffffff` at 2px with 2px offset `rgba(255,255,255,0.5)`.
  - Contrast: ring must be ≥ 3:1 versus adjacent color.
- Tab order: top navigation → search → menus → hero CTA → content (left→right, top→bottom). Skip links are placed before header (`Skip to content`).
- Activation:
  - Buttons/links: Enter/Space.
  - Dropdowns: Enter toggles; Up/Down navigate; Esc closes; announce with `aria-expanded`.
  - Side menu/overlay: trap focus; first item on open; Esc or Close button to dismiss; return focus to opener.
  - Price slider (two thumbs): `Left/Right` ±1 step, `PageUp/PageDown` ±10 steps, `Home/End` min/max; each thumb has `aria-valuemin/max/now`.
  - Star rating: `Left/Right` (or `Down/Up`) moves 1–5; selection announced, e.g., “4 of 5 stars selected”.
- Disabled states: true `disabled` or `aria-disabled="true"` with `tabindex="-1"`; not focusable.
- Live announcements: actions that modify the bag trigger polite region messages, e.g., “Added GameForge Nexus Console to bag”.

CSS reference (example):

```css
:where(button, [role="button"], a, input, select, textarea) {
  outline: none;
}
:where(button, [role="button"], a, input, select, textarea):focus-visible {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #2563eb; /* 2px offset + 2px ring */
  border-radius: 6px; /* match control radius */
}
/* Dark banners */
.on-dark :focus-visible { box-shadow: 0 0 0 2px rgba(37,99,235,0.55), 0 0 0 4px #fff; }
```

Keyboard order and specific notes (matching screenshots):

- Header: hamburger → logo → search → cart → Brands → Shop → Welcome.
- Home: hero `Shop Now` → three promo cards → product carousels/cards.
- Listing: `Price` slider (min thumb, then max thumb) → `Rating` filter → `Sort` combobox → cards (each card: image/link → title → price → Add To Cart).
- Product detail: quantity combobox → Add/Remove Bag → share icons → tabs/reviews.
- Reviews: star input → text area → recommend combobox → Publish.
- Newsletter: email field → Subscribe.

Import the CSV to the SR01 “Action” table and replace the “Font” and “Focus Rule” blocks with the above.

