(function () {
  const toc = document.querySelector('.page--power nav.toc');
  if (!toc) return;

  // Minimal Mistakes TOC: <nav class="toc"><ul class="toc__menu"> ... </ul></nav>
  const topList = toc.querySelector('ul.toc__menu');
  if (!topList) return;

  // Move the TOC to the very top INSIDE the content column so it centers with content
  try {
    const contentEl = document.querySelector('.page--power .page__content');
    if (contentEl && toc.parentElement) {
      toc.classList.add('toc--top');
      contentEl.insertBefore(toc, contentEl.firstChild);
      // Hide the original right sidebar if present
      const sidebar = contentEl.querySelector('.sidebar__right');
      if (sidebar) sidebar.style.display = 'none';
    }
  } catch (e) { /* no-op */ }

  const topItems = Array.from(topList.children).filter(function (el) { return el && el.tagName === 'LI'; });

  // Mark TOC anchors to be ignored by theme SmoothScroll so we can control offset
  Array.from(toc.querySelectorAll('a[href^="#"]')).forEach(function(a){
    a.setAttribute('data-scroll-ignore', '');
  });

  // Neutralize global scroll-padding on this page so we control the exact offset
  try {
    if (document.body.classList.contains('page--power')) {
      document.documentElement.style.setProperty('scroll-padding-top', '0px');
      // Hint browsers not to restore scroll position automatically on reload/nav
      if ('scrollRestoration' in history) {
        try { history.scrollRestoration = 'manual'; } catch(e) { /* no-op */ }
      }
    }
  } catch(e) { /* no-op */ }

  // Keep CSS var in sync for scroll-margin-top used by headings
  function setHeaderOffsetVar(){
    const header = document.getElementById('topnav');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    
    // Base sticky offset is just the header height plus small gap
    const stickyGap = 8; // small gap between header and sticky element
    document.documentElement.style.setProperty('--sticky-top', (headerH + stickyGap) + 'px');
    
    // For scroll anchoring, we need more offset on mobile to account for sticky toggle
    let scrollOffset = headerH + 16; // default offset
    try {
      if (isMobile()) {
        const mobileToggle = toc.querySelector('.toc-mobile-toggle');
        if (mobileToggle && window.getComputedStyle(mobileToggle).position === 'sticky') {
          const toggleH = mobileToggle.getBoundingClientRect().height || 0;
          scrollOffset = headerH + toggleH + 20; // header + toggle + gap
        }
      }
    } catch(e) { /* no-op */ }
    
    document.documentElement.style.setProperty('--header-offset', scrollOffset + 'px');
  }
  window.addEventListener('load', setHeaderOffsetVar);
  window.addEventListener('resize', setHeaderOffsetVar);

  // ===== Mobile: whole-TOC collapse/expand =====
  function isMobile(){
    try { return window.matchMedia && window.matchMedia('(max-width: 1200px)').matches; } catch(e) { return false; }
  }

  // Ensure list has an ID for aria-controls
  if (!topList.id) topList.id = 'toc-menu';

  const tocHeader = toc.querySelector('header');
  const headerText = (tocHeader && tocHeader.textContent || 'On this page').trim();

  // Create a toggle button for collapsing the ToC
  const mobileToggleBtn = document.createElement('button');
  mobileToggleBtn.type = 'button';
  mobileToggleBtn.className = 'toc-mobile-toggle';
  mobileToggleBtn.setAttribute('aria-expanded', 'true');
  mobileToggleBtn.setAttribute('aria-controls', topList.id);
  mobileToggleBtn.innerHTML = '<span class="toc-mobile-toggle__label"></span><span class="toc-mobile-toggle__icon" aria-hidden="true"></span>';
  const labelSpan = mobileToggleBtn.querySelector('.toc-mobile-toggle__label');
  if (labelSpan) labelSpan.textContent = headerText;
  // Insert after header (or as first child if none)
  if (tocHeader && tocHeader.nextSibling) {
    toc.insertBefore(mobileToggleBtn, tocHeader.nextSibling);
  } else {
    toc.insertBefore(mobileToggleBtn, toc.firstChild);
  }
  // After injecting toggle, update header offset
  setTimeout(setHeaderOffsetVar, 50); // delay to ensure DOM is ready

  let mobileAutoCollapsed = false;
  function collapseToc(){
    toc.classList.add('is-collapsed');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    try { setHeaderOffsetVar(); } catch(e) {}
  }
  function expandToc(){
    toc.classList.remove('is-collapsed');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    try { setHeaderOffsetVar(); } catch(e) {}
  }
  function toggleToc(){
    if (toc.classList.contains('is-collapsed')) expandToc(); else collapseToc();
  }

  mobileToggleBtn.addEventListener('click', function(e){
    e.preventDefault();
    toggleToc();
  });

  function handleResize(){
    // Reset auto-collapse flag when moving to desktop
    if (!isMobile()) {
      mobileAutoCollapsed = false;
    }
  }
  window.addEventListener('resize', handleResize, { passive: true });

  // Simple anchor behavior: smooth-scroll to target and collapse whole TOC on mobile
  const allAnchors = Array.from(toc.querySelectorAll('a[href^="#"]'));
  allAnchors.forEach((a) => {
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (target) {
        try {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch(_) { /* fall through */ }
      }
      if (isMobile()) collapseToc();
    }, { capture: true });
  });

  // No accordion behavior; keep subsections visible and simple

  // Map all TOC anchors to content targets and their top-level LI
  function getTopLevelLiFromAnchor(anchorEl) {
    // Ascend to enclosing li, then climb until parent UL is the top .toc__menu
    let li = anchorEl.closest('li');
    while (li && li.parentElement && (!li.parentElement.matches || !li.parentElement.matches('ul.toc__menu'))) {
      // Move up: parentElement is a UL; find its parent LI (the next level up)
      li = li.parentElement.closest('li');
    }
    return li || null;
  }

  // Map targets for offset calculations if needed in future; not used for accordion now
  const tocAnchors = Array.from(toc.querySelectorAll('a[href^="#"]))
    .map((a) => {
      const href = a.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (!target) return null;
      const topLi = getTopLevelLiFromAnchor(a);
      return { anchorEl: a, targetEl: target, topLi };
    })
    .filter(Boolean);

  // Open based on current hash (on load and on hash changes)
  function openForHash() {
    const hash = decodeURIComponent(location.hash || '');
    if (!hash) return;
    const a = toc.querySelector(`a[href="${hash}"]`);
    if (!a) return;
    const li = getTopLevelLiFromAnchor(a);
    accordionActivated = true;
    if (Date.now() < suppressOpenUntil) return;
    if (li) openOnly(li);
    // If user navigated via hash (e.g., anchor link), collapse on mobile
    if (isMobile()) collapseToc();
  }
  // Do not auto-open via hash; keep behavior simple and predictable

  // Scroll-driven expansion: expand the section that owns the heading near the top
  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      const viewportThresholdPx = 160; // near top

      // Find the best candidate heading
      let best = null;
      let bestScore = Infinity;
      for (const m of tocAnchors) {
        const rect = m.targetEl.getBoundingClientRect();
        const top = rect.top;
        let score;
        if (top >= 0) {
          score = Math.abs(top - viewportThresholdPx);
        } else {
          // Prefer closest above the top when nothing is in range
          score = Math.abs(top) + 1000;
        }
        if (score < bestScore) {
          bestScore = score;
          best = m;
        }
      }
      if (Date.now() < suppressOpenUntil) return;
      if (accordionActivated && best && best.topLi) openOnly(best.topLi);
      // First real scroll on mobile: auto-collapse the TOC so it doesn't cover content
      // Only auto-collapse on true mobile devices to avoid desktop interference
      if (isMobile() && !mobileAutoCollapsed && window.innerWidth <= 768) {
        if ((window.scrollY || window.pageYOffset || 0) > 8) {
          collapseToc();
          mobileAutoCollapsed = true;
        }
      }
    });
  };

  // No scroll-driven auto-opening
})();

