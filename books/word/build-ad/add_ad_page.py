"""Adds to the finished Word book PDF (without rebuilding it):
  1) an invisible link on every "Dr Merabti" logo at the bottom left -> https://merabti.com
  2) the "كتب أخرى تنتظرك" page as page 2 (right after the cover)
and checks the result against the original.

  python3 add_ad_page.py <book.pdf> <out.pdf> [ad-page.pdf]

ad-page.pdf is made from page.html with:  node render.js page.html ad-page.pdf
Needs: pip install pymupdf
"""
import sys
import pymupdf

SITE = 'https://merabti.com'
LOGO_TEXT = 'Dr Merabti'


def logo_rects(page):
    """The whole 'Dr Merabti' logo in the bottom-left corner: the text and the shape drawn behind it.
    Uses the text span's own box (search_for gives wrong boxes on some pages of this book)."""
    r = page.rect
    corner = pymupdf.Rect(0, r.height * 0.85, r.width * 0.5, r.height)
    spans = [pymupdf.Rect(s['bbox'])
             for b in page.get_text('dict', clip=corner)['blocks'] if b['type'] == 0
             for l in b['lines'] for s in l['spans'] if s['text'].strip() == LOGO_TEXT]
    out = []
    for box in spans:
        if not box.intersects(corner):
            continue
        near = box + (-20, -12, 20, 12)
        logo = pymupdf.Rect(box)
        for dr in page.get_drawings():
            d = dr['rect']
            if d.intersects(near) and d.width < 160 and d.height < 40:
                logo |= d
        out.append(logo)
    return out


def add_invisible_link(page, rect, uri):
    # PyMuPDF writes link annotations with /Border [0 0 0]: nothing is drawn
    page.insert_link({'kind': pymupdf.LINK_URI, 'from': rect, 'uri': uri})


def internal_links(page):
    return [(tuple(round(v, 2) for v in l['from']), l.get('page'), l.get('nameddest'))
            for l in page.get_links() if l['kind'] in (pymupdf.LINK_GOTO, pymupdf.LINK_NAMED)]


def main(src, out, ad_pdf='ad-page.pdf'):
    doc = pymupdf.open(src)
    n0 = doc.page_count
    toc0 = doc.get_toc(simple=False)
    links0 = [internal_links(p) for p in doc]
    uris0 = [[l['uri'] for l in p.get_links() if l['kind'] == pymupdf.LINK_URI] for p in doc]
    contents0 = [p.read_contents() for p in doc]

    # 1) invisible links on the logo
    logo_pages, added = [], []
    for p in doc:
        hits = logo_rects(p)
        added.append(len(hits))
        for h in hits:
            add_invisible_link(p, h + (-4, -3, 4, 3), SITE)
        if hits:
            logo_pages.append(p.number + 1)

    # 2) new page 2, same size as the book pages
    ad = pymupdf.open(ad_pdf)
    size = doc[1].rect if n0 > 1 else doc[0].rect
    page = doc.new_page(1, width=size.width, height=size.height)
    src_r = ad[0].rect
    off = pymupdf.Point((size.width - src_r.width) / 2, (size.height - src_r.height) / 2)
    page.show_pdf_page(src_r + (off.x, off.y, off.x, off.y), ad, 0)
    for l in ad[0].get_links():
        if l['kind'] == pymupdf.LINK_URI:
            add_invisible_link(page, l['from'] + (off.x, off.y, off.x, off.y), l['uri'])
    for h in logo_rects(page):
        add_invisible_link(page, h + (-4, -3, 4, 3), SITE)

    doc.save(out, garbage=1, deflate=True)
    doc.close()

    # 3) checks
    new = pymupdf.open(out)
    ok = True

    def check(cond, msg):
        nonlocal ok
        print(('OK   ' if cond else 'FAIL ') + msg)
        ok &= bool(cond)

    shift = lambda pg: pg + 1 if pg >= 1 else pg   # 0-based target pages after the insert
    check(new.page_count == n0 + 1, f'pages: {n0} -> {new.page_count} (one more)')
    check(all(abs(new[i].rect.width - size.width) < .01 and abs(new[i].rect.height - size.height) < .01
              for i in (1,)), f'new page size {new[1].rect.width:.2f} x {new[1].rect.height:.2f} pt')
    old_map = [0] + list(range(2, n0 + 1))          # old page i -> new page old_map[i]
    check(all(new[old_map[i]].read_contents() == contents0[i] for i in range(n0)),
          'content of every original page unchanged')
    bad = 0
    for i in range(n0):
        now = internal_links(new[old_map[i]])
        want = [(r, shift(pg) if pg is not None and pg >= 0 else pg, nd) for r, pg, nd in links0[i]]
        bad += sorted(now, key=str) != sorted(want, key=str)
    check(bad == 0, f'internal links (contents, titles, references): '
                    f'{sum(map(len, links0))} links, all still point to the same pages')
    check(all(dead == 0 for dead in [sum(1 for l in p.get_links()
              if l['kind'] == pymupdf.LINK_GOTO and not (0 <= l['page'] < new.page_count)) for p in new]),
          'no internal link points outside the book')
    toc1 = new.get_toc(simple=False)
    check(len(toc1) == len(toc0) and all(a[0] == b[0] and a[1] == b[1] and b[2] == (shift(a[2] - 1) + 1)
                                         for a, b in zip(toc0, toc1)),
          f'bookmarks: {len(toc0)} entries, all moved with their pages')
    check(all(sorted(l['uri'] for l in new[old_map[i]].get_links() if l['kind'] == pymupdf.LINK_URI)
              == sorted(uris0[i] + [SITE] * added[i]) for i in range(n0)), 'existing web links kept')
    print(f'logo links added on {len(logo_pages)} pages of the original + the new page')
    return ok, logo_pages


if __name__ == '__main__':
    ok, _ = main(*sys.argv[1:])
    sys.exit(0 if ok else 1)
