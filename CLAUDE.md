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
  A paid book with no preview yet: cover only (showcase), like `books/excel-kingdom-2/`.
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
