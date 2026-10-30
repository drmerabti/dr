# كل اختصارات ماكبوك — build

Book source (HTML/CSS, keys drawn in CSS) → PDF with Playwright/Chromium.

- `data.js`: title, other books, social links
- `book.js`: builds the pages, flows groups into pages (a group never splits), fills the contents page numbers
- `book.css`: page 170 × 240 mm, keys, rows, divider pages
- `content.js`: the 12 chapters (rows, gestures; chapter 12 cards are built from the starred rows)
- `node render.js out.pdf [png-dir]`: writes the PDF (internal and external links kept)
- `node check.js`: no group outside its page, no key row too wide, no dead internal link

Fonts: Cairo, Inter (has ⌘ ⌥ ⇧ ⌃ ⎋ ⌫), Caveat Brush — SIL Open Font License.
