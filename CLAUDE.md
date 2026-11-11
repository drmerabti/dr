# Notes for working on this site

## Tools with a fill panel (standing rule)

Every tool whose fill panel is made of collapsible sections (like `tools/admin-request/`)
uses the shared clarity files. A new tool of this kind must include them too:

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="../../shared/form-clarity.css">   <!-- right after the tool's own CSS -->
...
<script src="../../shared/form-clarity.js" defer></script>      <!-- before the tool's app.js -->
```

Markup the shared rules expect (add these classes when a tool uses other names):

| Part | Class / attribute |
|---|---|
| list of sections | `.acc-group` (or `.accordion`) |
| one section | `.acc` with `style="--sc:<section colour>"` |
| open section | `.acc.open` |
| header / body | `.acc-head` / `.acc-body` |
| field that must not get a tick (e.g. own button at its end) | `.fc-no-tick` |

What the shared files do: open-section tint (`--tint`, 12%), other sections fade while one
is open, white fields with a clear grey border, focus border in the section colour, grey
examples / dark text, darker labels, green tick in filled fields. `form-clarity.js` only
marks filled fields (`.fc-filled`); it never changes a value.

Do not copy these rules into a tool's own stylesheet; change them in `shared/form-clarity.css`.

## Paid downloads (products.json)

Paid ready-made files (e.g. the lesson 3 workbook) go through one shared system. The site is static;
the backend is **Firebase Functions** (us-central1), outside this repo.

- `products.json` (site root): one entry per product — `id` (used in the page, e.g. `product: 'grades-manager'`
  in `lessons/excel-vba/data.js`), `serverId` (the product key of the Firebase Functions, e.g. `gradesManager`),
  `title`, `description` (+ `_en`), `image`, `priceDZD`, `priceUSD`, `gumroadUrl`.
- Page side: `shared/purchase.css` + `shared/purchase.js`, loaded after the Firebase compat SDK
  (app, auth, firestore, **functions**) and `firebase-init.js` → `MPurchase.open(id)`, `MPurchase.act(id)`,
  `MPurchase.download(id)`, `MPurchase.canDownload(id)`, `MPurchase.onChange(fn)`.
- DZD: callable `createSubscriptionCheckout({ product: serverId })` → `{ checkoutUrl }` (sign-in required first).
- Bought = Firestore `users/{uid}/purchases/{serverId}.paid === true` (written by the backend); admins = `users/{uid}.isAdmin`.
- Download: callable `getProductDownload({ product: serverId })` → `{ fileName, base64 }`, saved as a Blob;
  `permission-denied` = not bought → the purchase window opens. The file is never in the repo.
- Back from Chargily: `?paid=<serverId>` (wait for `paid` with onSnapshot) or `?payfail=1`.
- USD goes through the Gumroad overlay (`gumroadUrl`); Gumroad delivers the file itself.

## PayPal book sales (Cloudflare Worker, separate from products.json)

Paid books are sold for USD through PayPal. The pages are on GitHub Pages (merabti.com); the API runs on the
Cloudflare Worker `dr` (https://dr.merabti.workers.dev), called with its full URL (CORS: merabti.com,
www.merabti.com, claude-test-dr.merabti.workers.dev).

- `worker.js` → `BOOK_CATALOG` is the only place for USD price + R2 file (root of bucket `merabtibooks`).
  Id = the page folder (`data-book` on `#ppBox`), except the Word book:

  | id | page | file | USD |
  |---|---|---|---|
  | `word-book` | `books/word/` | `Thamoud-Book.pdf` | 6.00 |
  | `bac-math-100` | `books/bac-math-100/` | `Bac-Math-100.pdf` | 6.99 |
  | `excel-vba` | `books/excel-vba/` | `Ibdaa-VBA.pdf` | 7.99 |
  | `research` | `books/research/` | `IdeaToPub.pdf` | 7.99 |
  | `excel-kingdom-1` | `books/excel-kingdom-1/` | `Mamlaka-Excel.pdf` | 6.99 |
  | `excel-kingdom-2` | `books/excel-kingdom-2/` | `Mamlaka-Excel-2.pdf` | 6.99 |
  | `excel-shortcuts` | `books/excel-shortcuts/` | `Mouse-Excel.pdf` | 4.99 |
  | `shortcuts-wiki` | `books/shortcuts-wiki/` | `Wiki-Shortcuts.pdf` | 4.99 |
  | `macbook-shortcuts` | `books/macbook-shortcuts/` | `mac-shortcuts.pdf` | 7.99 |

  Routes: `GET /api/paypal/config?bookId=` (no PayPal buttons if the file is not in R2),
  `POST /api/paypal/create-order {bookId}`, `POST /api/paypal/capture-order {orderId}`,
  `GET /api/download/:token` (7 days, 5 downloads).
- Page side (shared, in `books/word/`): `buy.js` (the two buttons «ادفع بالدولار» / «ادفع بالدينار» and their
  windows), `paypal.js` (PayPal buttons; sets every `[data-price="usd"]` / `usd.now` from the server price),
  `img/` (official PayPal / Visa / Mastercard logos), styles in `style.css`. Other pages load them as `../word/…`.
  Dinar = e-mail / WhatsApp (`#orderMail` / `#orderWa` in each page's own `app.js`; `data-wa-text` = BaridiMob message).
  A new paid book: catalog entry + copy the buy box and the two windows from `books/excel-vba/index.html`.
  A paid book with no preview yet: cover only (showcase), as `books/excel-kingdom-2/` was before its release.
- `wrangler.jsonc`: vars `PAYPAL_CLIENT_ID`, `PAYPAL_ENV` (`sandbox` | `live`), R2 binding `BOOKS` → `merabtibooks`.
  `PAYPAL_SECRET` is a dashboard secret — never in the repo.
- D1 table `paypal_orders` (created on first use).
- `paypal_orders.env` = `live` | `sandbox` (rows without it are older, from before 2026-11-05).
- Every PayPal call is logged as one `[paypal] <step> {json}` line: order ID, status, PayPal-Debug-Id and, on failure,
  PayPal's error fields only — never the payer (name, e-mail, address) or the full response. Workers Logs are on
  (`observability` in `wrangler.jsonc`) → Cloudflare → Workers & Pages → dr → Observability.
- E-mail alert on a failed create-order / capture-order / download (send_email binding `ALERT_EMAIL` →
  merabti.soufiane1@gmail.com, sender alerts@merabti.com, Cloudflare Email Routing). One e-mail per key in D1
  `paypal_alerts`: `order:<id>` / `download:<id>`; with no order ID, book + error + hour. Sent with `waitUntil`.
- `books/word/build-ad/` (PDF ad-page build tool) is not published (`.assetsignore`, `.vercelignore`).

## Icons (ICONS in app.js)

One semi-flat set, based on the reference tools icon (`ICONS.tools` is that icon, its fills on the shared gradients).
A new icon must match:
`<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#07547f" stroke-width="1.6"
stroke-linecap="round" stroke-linejoin="round">…</g></svg>` — defaults on the inner `<g>` so page CSS cannot repaint it.
Fills are light vertical gradients written as `fill="url(#miX) <flat colour>"` (the flat colour shows if the
gradient is missing). `ICON_DEFS` in app.js (one hidden `<svg id="mi-defs">` added to every page that loads app.js)
holds them: `miD` dark `#064b79`, `miM` mid `#2389b8`, `miH` highlight `#75c6ed`, `miL` light `#b8ddf5`,
`miP` pale `#e2f2fc`; accents only to tell icons apart: `miG` green `#2f9e6e` (Excel, success), `miA` amber
`#f0b23e` (stars, coins, Power BI), `miC` coral `#e2694f` (PowerPoint, PDF, live), `miV` violet `#7b5fc4` (Access).
White details `#f5fbff`. No shadows, no PNG inside SVG, art inside 4–60 of the grid. Each item gets an icon that says
what it does (no sharing between unrelated tools). The home sections show the same `ICONS` large (`big: true`).
Copies outside app.js carry their own `<defs>`: `tools/text-to-numbers/app.js` (section icons) and the top bar
of `lessons/pc-solutions/index.html`.

## Logo

`logo-mark.png` (site root) is the only logo image for pages: the logo circle exactly as the home page shows it,
transparent outside the circle (made from `apple-touch-icon.png`, which keeps its job as the iOS / favicon icon —
it is a square with an extra rim and an off-centre circle, so it must not be shown as the logo).
Markup: `<img class="site-logo" src="…/logo-mark.png" alt="…">` in a square box, and the page links
`shared/site-logo.css` (after its own CSS). That file keeps the logo round, unstretched and without padding,
border, frame ring, shadow or filter, whatever the page's own logo rules say. CSS backgrounds use
`url(logo-mark.png) center/contain`.

## CV builder (tools/cv-builder)

- A template = one entry in `TPL` (app.js) + one page skeleton in `PAGES` + its CSS: `style.css` for the 14 free
  templates, `premium.css` for the Premium ones (maison, obsidian, atlas, vitrine, folio, apex, mosaic, orbit,
  ribbon, aurora). Premium = `premium: true` in `TPL` (`tplIsPremium(id)`).
- Exports & Premium templates ("Exports & Premium templates" block in app.js): editing and previewing need no
  account; every export goes through `requestExport('pdf' | 'print')` and needs a **Google** sign-in (free templates
  included; an e-mail/password account is asked to continue with Google). A Premium template is sold on its own,
  **$2.99, one permanent purchase per template, no packs**, through PayPal; rights come from the Worker
  (`/api/cv/*`, D1), never from the browser. Admins (`users/{uid}.isAdmin`, same rule as shared/purchase.js) export
  every template. Modes from `/api/cv/config`: live / sandbox · demo (sales off on the claude-test preview or
  localhost: nothing paid, nothing saved) · off (elsewhere). A paid but unconfirmed order is kept in
  localStorage `cvbuilder:pendingOrder` (with the uid) and re-captured on the next sign-in. No Paddle anywhere.
- Worker `/api/cv/*` (worker.js, "CV builder Premium templates"): `GET config` → `{ sales, clientId, currency, price,
  premium[] }`, `GET entitlements` → `{ owned[] }`, `POST create-order {template}` → `{ id }`,
  `POST capture-order {orderId}` → `{ ok, orderId, template, owned[] }`. Every route but config needs
  `Authorization: Bearer <Firebase ID token>` with `firebase.sign_in_provider = google.com` (token checked in the
  Worker with Google's keys). Price and catalogue only in the Worker (`CV_PRICE`, `CV_PREMIUM`). Capture checks
  order owner, status, amount, currency and custom_id; one capture = one right (D1 batch, UNIQUE capture_id).
  D1 tables `cv_orders`, `cv_entitlements` (created on first use, rows tagged `env` = live | sandbox).
  `CV_SALES` in wrangler.jsonc: **"off" until the owner approves real payments**; "live" is honoured only on
  dr.merabti.workers.dev (`CV_LIVE_HOSTS`), so previews never take real payments; "sandbox" needs
  `PAYPAL_SANDBOX_CLIENT_ID` + secret `PAYPAL_SANDBOX_SECRET`. Test-only overrides (sandbox only):
  `CV_PAYPAL_API`, `CV_TEST_JWKS`.
- Page fill (auto-fit) is done by `renderPages`: it sets `--fs` (type), `--sp` (vertical spacing) and `--lh` (leading)
  on the page (and per column), then shares the air that is left as `--gx` (before a section) / `--ea` (after an entry).
  So template CSS writes font sizes as `calc(var(--fs) * Npx)` and vertical margins / paddings as
  `calc(var(--sp) * Npx)`; a fixed px value there = a template that does not fill its page.
  A header must grow with its content (min-height, never a fixed height with text in it).
- Text size control: untouched = automatic (the control shows the size in use); A− / A+ store `fontScale` +
  `fsManual`, then only the spacing adapts; the reset button gives the size back to the auto-fit.
- PDF = html2canvas: colours inside SVG are literal hex (computed in JS: `palette`, `PREMIUM_VARS`, `ico`), no
  `clip-path`, `filter`, `writing-mode` or `background-clip:text`; Arabic is never letter-spaced or upper-cased.
- Class names set by the layout engine on blocks: `first` (section start), `es` (entry start), `nl` (not the last
  piece of its section), `top` / `end` (first / last block of a column on a page) — do not reuse them for anything else.

## Home order

`SECTIONS_ROW1` = tools, books (`services`), lessons; `SECTIONS_ROW2` = apps, favorites, training.
The DOM order is the order (RTL: first card on the right; phones keep the same order).
