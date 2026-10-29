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
