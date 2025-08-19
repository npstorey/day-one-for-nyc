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

  // Transform top-level TOC anchors to two-line labels when they end with a parenthetical
  // Example: "Mayor’s Direct Controls(core executive levers)" ->
  //   "Mayor’s Direct Controls" + <br> + <span class="toc-sub">(core executive levers)</span>
  const topAnchors = Array.from(topList.querySelectorAll(':scope > li > a'));
  topAnchors.forEach((a) => {
    const raw = (a.textContent || '').trim();
    const m = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (!m) return;
    const main = m[1].trim();
    const sub = m[2].trim();
    a.innerHTML = `${main}<br><span class="toc-sub">(${sub})</span>`;
  });

  // Make clicking a top-level anchor both toggle and navigate
  topAnchors.forEach((a) => {
    a.addEventListener('click', function(e){
      accordionActivated = true;
      const li = a.parentElement && a.parentElement.tagName === 'LI' ? a.parentElement : getTopLevelLiFromAnchor(a);
      if (!li) return;
      const isOpen = li.classList.contains('is-open');
      if (isOpen) {
        setSectionState(li, false);
        suppressOpenUntil = Date.now() + 1000;
      } else {
        openOnly(li);
      }
      // Custom smooth scroll using scroll-margin-top
      const href = a.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Do not mutate the URL/hash while scrolling; avoids hashchange-induced jumps
        if (isMobile()) collapseToc();
      }
    }, true);
  });

  function closeAll() {
    topItems.forEach((li) => li.classList.remove('is-open'));
  }

  function setSectionState(li, open) {
    if (!li) return;
    if (open) li.classList.add('is-open'); else li.classList.remove('is-open');
    // Sync caret aria state if present
    const caret = li.querySelector('.toc-caret');
    if (caret) caret.setAttribute('aria-expanded', open ? 'true' : 'false');
    var childUl = null;
    for (var i = 0; i < li.children.length; i++) {
      if (li.children[i].tagName === 'UL') { childUl = li.children[i]; break; }
    }
    if (childUl) {
      if (open) {
        try {
          childUl.style.setProperty('display', 'block', 'important');
        } catch (e) {
          childUl.style.display = 'block';
        }
      } else {
        // Explicitly hide when closing (initially CSS shows all until user interacts)
        try {
          childUl.style.setProperty('display', 'none', 'important');
        } catch (e) {
          childUl.style.display = 'none';
        }
      }
    }
  }

  function openOnly(liToOpen) {
    topItems.forEach((li) => setSectionState(li, li === liToOpen));
  }

  // Initial state: keep all sections closed by default (CSS hides submenus)

  // Once the user interacts (click/hash), we activate accordion behavior
  let accordionActivated = false;
  // Suppress auto-opening (scroll/hash) for a short time after an explicit collapse
  let suppressOpenUntil = 0;

  // Inject caret toggle buttons into each top-level item
  topItems.forEach(function(li){
    // find direct child anchor
    let anchor = null;
    for (let i=0;i<li.children.length;i++){
      if (li.children[i].tagName === 'A'){ anchor = li.children[i]; break; }
    }
    if (!anchor) return;
    li.classList.add('has-caret');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toc-caret';
    btn.setAttribute('aria-expanded', 'false'); // initial state: collapsed
    btn.setAttribute('aria-label', 'Toggle section');
    anchor.appendChild(btn);
    btn.addEventListener('click', function(ev){
      ev.preventDefault(); ev.stopPropagation();
      accordionActivated = true;
      const isOpen = li.classList.contains('is-open');
      if (isOpen) {
        setSectionState(li, false);
      } else {
        openOnly(li);
      }
    });
    // Leave closed by default; CSS keeps the child UL hidden
  });

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

  const tocAnchors = Array.from(toc.querySelectorAll('a[href^="#"]'))
    .map((a) => {
      const href = a.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (!target) return null;
      const topLi = getTopLevelLiFromAnchor(a);
      return { anchorEl: a, targetEl: target, topLi };
    })
    .filter(Boolean);

  // Click: handle nested anchors (not top-level); keep navigation behavior
  toc.addEventListener('click', (e) => {
    // Normalize to an Element then find the anchor
    let node = e.target;
    while (node && node.nodeType !== 1) node = node.parentNode;
    const a = node && node.closest ? node.closest('a[href^="#"]') : null;
    if (!a) return;
    const topLi = getTopLevelLiFromAnchor(a);
    // If this is a top-level anchor (direct child of its LI), skip; handled by per-anchor listener
    if (topLi && a.parentElement === topLi) return;
    accordionActivated = true;
    if (topLi) {
      const isOpen = topLi.classList.contains('is-open');
      if (isOpen) {
        // Collapse this section
        setSectionState(topLi, false);
        suppressOpenUntil = Date.now() + 1000; // avoid immediate re-open from scroll/hash
      } else {
        // Open this section and collapse others
        openOnly(topLi);
      }
    }
    // Custom smooth scroll using scroll-margin-top
    const href = a.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Do not update hash during programmatic scroll
      if (isMobile()) collapseToc();
    }
  }, { capture: true });

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
  // Disable hash-driven opening to avoid unexpected jumps
  // openForHash();
  // window.addEventListener('hashchange', openForHash);

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

  // Disable scroll-driven TOC behavior to avoid interfering with page scroll position
  // window.addEventListener('scroll', handleScroll, { passive: true });
})();

