(function () {
  var live = (location.hostname === 'dayonefor.nyc' || location.hostname === 'www.dayonefor.nyc');
  if (!live || typeof window.gtag !== 'function') return;

  // Track "Download the PDF" clicks (anchors with .pdf-btn)
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a.pdf-btn');
    if (!a) return;
    gtag('event', 'download_pdf', {
      event_category: 'engagement',
      event_label: a.getAttribute('href') || '',
      transport_type: 'beacon'
    });
  });

  // Track outbound links
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.hostname && url.hostname !== location.hostname) {
      gtag('event', 'click_outbound', {
        event_category: 'navigation',
        event_label: url.hostname + url.pathname,
        transport_type: 'beacon'
      });
    }
  });
})();


