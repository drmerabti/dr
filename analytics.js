// analytics.js — Google Analytics (GA4) for merabti.com
(function () {
  var GA_ID = 'G-6PKBD7XR0M';
  if (window.__gaLoaded) return; // avoid loading twice on the same page
  window.__gaLoaded = true;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
