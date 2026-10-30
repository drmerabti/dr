// node check.js — layout checks on the built pages
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, 'book.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('body[data-ready]');
  const r = await page.evaluate(() => {
    const bad = [];
    // every group inside the body of its page
    for (const g of document.querySelectorAll('.group')) {
      const b = g.closest('.body').getBoundingClientRect(), r = g.getBoundingClientRect();
      if (r.bottom > b.bottom + 1 || r.top < b.top - 1) bad.push('group outside page: ' + g.id);
    }
    // keys never wider than their column, text never cut
    for (const k of document.querySelectorAll('.row .keys'))
      if (k.scrollWidth > k.clientWidth + 1) bad.push('keys too wide: ' + k.closest('.group').id + ' ' + k.textContent.trim().slice(0, 30));
    for (const b of document.querySelectorAll('.body'))
      if (b.scrollHeight > b.clientHeight + 1) bad.push('page body overflow: page ' + ([...document.querySelectorAll('.page')].indexOf(b.closest('.page')) + 1));
    // every internal link has a target
    for (const a of document.querySelectorAll('a[href^="#"]'))
      if (!document.getElementById(a.getAttribute('href').slice(1))) bad.push('dead link ' + a.getAttribute('href'));
    // fonts actually used
    const used = new Set();
    return { bad, groups: document.querySelectorAll('.group').length, rows: document.querySelectorAll('.row').length,
      stars: [...document.querySelectorAll('.page.content')].filter(p => !p.querySelector('.card')).reduce((n, p) => n + p.querySelectorAll('.star').length, 0) };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
