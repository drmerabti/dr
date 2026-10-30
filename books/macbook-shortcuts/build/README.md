# كل اختصارات ماكبوك — build

Book source (HTML/CSS, keys drawn in CSS) → PDF with Playwright/Chromium.

- `data.js`: chapters, groups and shortcut rows (`'opt cmd esc'`, `|` = alternative, `{ star, tag }`)
- `book.js`: builds the pages, flows groups into pages (a group never splits), fills the contents page numbers
- `book.css`: page 170 × 240 mm, keys, rows, divider pages
- `node render.js out.pdf [png-dir]`: writes the PDF (internal and external links kept)

Fonts: Cairo, Inter (has ⌘ ⌥ ⇧ ⌃ ⎋ ⌫), Caveat Brush — SIL Open Font License.
