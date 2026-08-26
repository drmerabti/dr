# Invoice Generator

A lightweight, offline-friendly invoice generator with live preview, PDF export, and print support. Available in Arabic, English, and French.

## Features

- Live invoice preview while you type
- Logo and signature upload (drag & drop or click)
- Itemized table with automatic totals, VAT (TVA), and grand total
- Amount-in-words conversion (Arabic / English / French)
- Editable currency names per language (Settings)
- Auto-incrementing invoice numbers
- "New Invoice" — archives the current invoice locally and starts a fresh numbered one
- Draft auto-saved to your browser (localStorage) — safe against accidental tab closes
- PDF preview before download
- Print support
- Light / dark mode
- Fully responsive (desktop, tablet, mobile)

## Usage

This is a static, dependency-free web app (aside from two CDN-loaded libraries for PDF export). No build step required.

1. Clone or download this repository.
2. Open `index.html` in any modern browser, or serve the folder with any static file server.
3. To deploy on GitHub Pages: push to a repo, then enable Pages on the `main` branch (root).

## Files

- `index.html` — markup
- `style.css` — styling (light/dark theme via CSS variables)
- `script.js` — application logic (state, rendering, uploads, PDF/print, autosave)
- `i18n.js` — translation strings (ar / en / fr)
- `numToWords.js` — number-to-words conversion for the "amount in words" field

## Notes

- All data (drafts, invoice counter, currency settings, invoice history) is stored **locally in the browser** via `localStorage`. Nothing is sent to a server.
- PDF export uses [html2canvas](https://github.com/niklasvh/html2canvas) and [jsPDF](https://github.com/parallax/jsPDF), loaded from cdnjs.

## License

Free to use and modify.
