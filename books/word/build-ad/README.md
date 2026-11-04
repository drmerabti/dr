# Word book — "كتب أخرى تنتظرك" page + logo link

Changes the finished PDF of «حتى لو كنت من قوم ثمود ستفهم برنامج وورد» without rebuilding it.
The book PDF itself is never in the repo.

- `page.html`: the new page 2, same design as the ad page of the other books (170 × 240 mm),
  12 covers (every book except this one), each linked to its book page, button → merabti.com/books.html
- `node render.js page.html ad-page.pdf`: renders the page (`ad-page.pdf` is kept here ready to use)
- `python3 add_ad_page.py <book.pdf> <out.pdf> [ad-page.pdf]` (needs `pip install pymupdf`):
  1. invisible link (no border, no colour) on every "Dr Merabti" at the bottom left → https://merabti.com
  2. inserts `ad-page.pdf` as page 2
  3. checks: one page more, original pages unchanged, every internal link / bookmark still on its page

Fonts: Cairo and Inter from `../../macbook-shortcuts/build/fonts/`, Tajawal and Kaushan Script (subsets
taken from the other books) in `fonts/` — SIL Open Font License.
