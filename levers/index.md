---
layout: single
title: "Levers Navigator"
section: levers
---

<p class="muted">
  <strong>Public beta</strong>. This directory is a working draft from public sources and may be incomplete or out of date. Spot a correction or addition? Email <a href="mailto:hello@dayonefor.nyc">hello@dayonefor.nyc</a>.
</p>

<input id="lev-q"
       type="search"
       name="lev_search"
       inputmode="search"
       placeholder="Filter levers…"
       autocomplete="off"
       autocapitalize="off"
       autocorrect="off"
       spellcheck="false"
       data-lpignore="true"
       data-lastpass="ignore"
       data-1p-ignore="true"
       data-form-type="other"
       aria-label="Filter levers"
       style="padding:.5rem; width:100%; max-width:420px;">
<div id="lev-tags" style="margin:.5rem 0 1rem;"></div>

<ul id="lev-list" class="levers" style="list-style:none; padding:0;">
{% for l in site.data.levers %}
  <li class="card card--section" data-name="{{ l.name | downcase }}" data-tags="{{ l.tags | join: ',' | downcase }}">
    <div style="display:flex; justify-content:space-between; gap:1rem; align-items:baseline;">
      <div>
        <a href="/levers/{{ l.id }}/"><strong>{{ l.name }}</strong></a>
        <div style="color:var(--ink-subtle); margin-top:.25rem;">{{ l.summary }}</div>
      </div>
      <div>
        {% for t in l.tags %}<span class="tag">{{ t }}</span>{% endfor %}
      </div>
    </div>
  </li>
{% endfor %}
</ul>

<script>
(function(){
  const list = [...document.querySelectorAll('#lev-list li')];
  const input = document.getElementById('lev-q');
  const allTags = new Set();
  list.forEach(li => (li.dataset.tags||'').split(',').forEach(t => t && allTags.add(t.trim())));
  const tagWrap = document.getElementById('lev-tags');
  function filter(q, tag){
    const qq = (q||"").toLowerCase();
    list.forEach(li=>{
      const hay = (li.dataset.name + " " + (li.dataset.tags||''));
      const tagOk = !tag || (li.dataset.tags||'').split(',').includes(tag);
      li.style.display = (hay.includes(qq) && tagOk) ? "" : "none";
    });
  }
  allTags.forEach(t=>{
    const b = document.createElement('button');
    b.textContent = t;
    b.className = 'badge';
    b.style.marginRight = '.35rem';
    b.onclick = () => { filter(input.value, t); };
    tagWrap.appendChild(b);
  });
  input.addEventListener('input', e=> filter(e.target.value, null));
})();
</script>

<style>
  /* Use brand-focused outline instead of orange for this search box */
  #lev-q:focus{ outline: 3px solid var(--brand-accent); outline-offset: 2px; }
</style>


