// node render.js <out.pdf> [png-dir]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || 'book.pdf', pngDir = process.argv[3];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 700, height: 1000 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.log('[error]', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'book.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('body[data-ready]');
  console.log('pages:', await page.$$eval('.page', p => p.length));
  if (pngDir) {
    const els = await page.$$('.page');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${pngDir}/p${String(i + 1).padStart(3, '0')}.png` });
  }
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  await browser.close();
})();
