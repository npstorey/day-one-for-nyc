(function(){
  const header = document.getElementById('topnav');
  const toggle = document.querySelector('.topnav__toggle');
  const menu = document.getElementById('topnav-menu');
  const body = document.body;

  if (!header) return;

  function setNavHeightVar(){
    try{
      const h = header.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty('--nav-h-real', h + 'px');
      // Also update for small screens
      if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--nav-h-sm-real', h + 'px');
      }
    } catch(e){}
  }

  function revealOnHomeScroll(){
    const y = window.scrollY || window.pageYOffset;
    if (y > 260) {
      header.classList.add('topnav--visible');
      body && body.classList.remove('no-topnav-pad');
    } else {
      header.classList.remove('topnav--visible');
      body && body.classList.add('no-topnav-pad');
    }
    // Update height after visibility change
    requestAnimationFrame(setNavHeightVar);
  }

  function showImmediately(){ header.classList.add('topnav--visible'); }

  function onToggle(){
    if (!toggle || !menu) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open');
    document.body.classList.toggle('nav-open');
    
    // Update height immediately and after transition
    setNavHeightVar();
    setTimeout(setNavHeightVar, 300);
    
    // Trap focus within the open mobile menu for accessibility
    try {
      if (!expanded) {
        const focusables = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        focusables[0]?.focus();
      } else {
        toggle.focus();
      }
    } catch(e){}
  }

  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  if (isHome) {
    body && body.classList.add('is-home');
    window.addEventListener('scroll', revealOnHomeScroll, { passive: true });
    window.addEventListener('load', revealOnHomeScroll, { passive: true });
  } else {
    showImmediately();
    window.addEventListener('load', showImmediately);
  }

  toggle?.addEventListener('click', onToggle);

  // Keep nav height var up to date
  // Set immediately
  setNavHeightVar();
  
  // Update on various events
  window.addEventListener('load', () => {
    setNavHeightVar();
    // Double-check after fonts load
    setTimeout(setNavHeightVar, 100);
  }, { passive: true });
  window.addEventListener('resize', setNavHeightVar, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(setNavHeightVar, 100);
  }, { passive: true });

  // Subtle shadow when scrolling (respect reduced motion)
  const setShadow = () => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      header.style.transition = 'none';
    }
    header.style.boxShadow = (window.scrollY > 4)
      ? '0 8px 24px rgba(15,39,66,.14)'
      : 'none';
  };
  setShadow();
  window.addEventListener('scroll', setShadow, { passive: true });

  // Avoid hash targets being hidden under sticky header
  const adjustAnchor = () => {
    if (location.hash.length > 1) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };
  window.addEventListener('hashchange', adjustAnchor, { passive: true });
  window.addEventListener('load', adjustAnchor, { passive: true });
})();

// Bind any .js-print elements to window.print()
(function(){
  const links = document.querySelectorAll('.js-print');
  if (!links.length) return;
  links.forEach(l => {
    l.addEventListener('click', (e) => {
      e.preventDefault();
      requestAnimationFrame(() => window.print());
    }, { passive: false });
  });
})();

