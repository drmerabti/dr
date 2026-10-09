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

Paid ready-made files (e.g. the lesson 3 workbook) go through one shared system:

- `products.json` (site root): one entry per product — `id, title, image, priceDZD, chargilyPriceId,
  priceUSD, gumroadUrl, storagePath` (+ optional `title_en`, `description`, `description_en`, `fileName`).
- The file itself lives in Firebase Storage at `storagePath`, never in the repo.
- Page side: `shared/purchase.css` + `shared/purchase.js` (after `firebase-init.js`) → `MPurchase.open(id)`,
  `MPurchase.download(id)`, `MPurchase.canDownload(id)`, `MPurchase.onChange(fn)`.
  In `lessons/excel-vba/data.js` a lesson only needs `product: '<id>'`.
- Server side (Vercel functions in `api/`): `checkout` (Chargily V2, DZD, signed-in users only),
  `chargily-webhook` (signature check → `purchases/{uid}/items/{productId}`; the only place a purchase is recorded),
  `purchase-status`, `download` (signed Storage URL, 10 minutes; admins download free).
- USD goes through the Gumroad overlay (`gumroadUrl`); Gumroad delivers the file itself.
- Diagnostics: `GET /api/purchase-health` (config yes/no, never a secret); every failure is logged as
  `[purchase:<function>] <code> {details}` in Vercel → Logs.
- Read request bodies with `readRaw`/`readJson` from `api/_lib/server.js` only: on Vercel the helpers have already
  consumed the stream, and `for await (const chunk of req)` returns 0 bytes there.
