/* Trexon — mobile navigation.
   The page body is re-rendered by support.js (the <x-dc> runtime), so the
   burger, scrim and panel are appended to <body> rather than into the header.
   Open state lives on <html> as .tx-menu-open; all styling is in responsive.css. */
(function () {
  var LINKS = [
    { label: 'Home', href: 'index.html' },
    { label: 'About Us', href: 'about.html' },
    { label: 'Our Services', href: 'services.html' },
    { label: 'Contact Us', href: 'contact.html' }
  ];

  var SERVICES = [
    { label: 'Manpower Supply', href: 'manpower-supply.html' },
    { label: 'Equipment Rental', href: 'equipment-rental.html' },
    { label: 'Construction Services', href: 'construction-services.html' },
    { label: 'Industrial Trading', href: 'industrial-trading.html' },
    { label: 'Scrap Material', href: 'scrap-material.html' }
  ];

  var root = document.documentElement;
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function link(item, current) {
    var a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.href.toLowerCase() === current) a.setAttribute('aria-current', 'page');
    return a;
  }

  function build() {
    if (document.querySelector('.tx-burger')) return;

    var burger = document.createElement('button');
    burger.className = 'tx-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.appendChild(document.createElement('span'));

    var scrim = document.createElement('div');
    scrim.className = 'tx-scrim';

    var panel = document.createElement('nav');
    panel.className = 'tx-panel';
    panel.setAttribute('aria-label', 'Mobile navigation');

    LINKS.forEach(function (item) { panel.appendChild(link(item, page)); });

    var label = document.createElement('div');
    label.className = 'tx-panel-label';
    label.textContent = 'SERVICES';
    panel.appendChild(label);

    var sub = document.createElement('div');
    sub.className = 'tx-panel-sub';
    SERVICES.forEach(function (item) { sub.appendChild(link(item, page)); });
    panel.appendChild(sub);

    var cta = document.createElement('a');
    cta.className = 'tx-panel-cta';
    cta.href = 'contact.html';
    cta.textContent = 'Get a Quote →';
    panel.appendChild(cta);

    function setOpen(open) {
      root.classList.toggle('tx-menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    burger.addEventListener('click', function () {
      setOpen(!root.classList.contains('tx-menu-open'));
    });
    scrim.addEventListener('click', function () { setOpen(false); });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.appendChild(burger);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
