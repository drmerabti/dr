/* =====================================================================
   PRICES — the only place to change the price of the book.
   The book is not out yet: the page shows the cover, the chapters and the price.
===================================================================== */
var PRICES = {
  dzd: 800,                         /* Algerian dinar (دج) */
  usd: 7                            /* US dollar ($) */
};

document.querySelectorAll('[data-price]').forEach(function(el){
  var k = el.getAttribute('data-price');
  el.textContent = k === 'usd' ? (PRICES.usd % 1 ? PRICES.usd.toFixed(2) : PRICES.usd) : PRICES.dzd;
});
document.querySelectorAll('[data-offer]').forEach(function(el){ el.hidden = true; });
