---
layout: single
title: "Appointments Directory"
section: appointments
classes:
  - wide
  - appointments
  - dayone-report
---

<p class="muted">
  Directory of organizations where the Mayor appoints one or more officials.
</p>

<p class="muted">
  <strong>Public beta</strong>. This directory is a working draft of sample appointments from public sources. A more complete list is coming soon. Spot a correction or addition? Email <a href="mailto:hello@dayonefor.nyc">hello@dayonefor.nyc</a>.
 </p>

<div class="card card--section" style="margin-top:.75rem;">
  <div style="display:flex; gap:1rem; align-items:flex-start; flex-wrap:wrap;">
    <input id="filter" placeholder="Search by organization name, type, or title..." 
           style="padding:.6rem .8rem; width:100%; max-width:560px; border-radius:.75rem; border:1px solid #e2e2e2;" />
    <div id="typePills" class="appt-filters" style="display:flex; gap:.5rem; flex-wrap:wrap;"></div>
    <div id="catPills" class="appt-filters" style="display:flex; gap:.5rem; flex-wrap:wrap; width:100%; margin-top:.25rem;"></div>
  </div>

  <div style="margin-top:1rem; overflow-x:auto;">
    <table id="appt-table" class="table table--tight table--sticky">
      <thead>
        <tr>
          <th scope="col">Organization Name</th>
          <th scope="col">Organization Type</th>
          <th scope="col">Category</th>
          <th scope="col">Appointment to Make</th>
        </tr>
      </thead>
      <tbody id="appt-body">
        <!-- rows injected -->
      </tbody>
    </table>
    <div id="appt-meta" class="muted" style="margin-top:.5rem;"></div>
    <div id="appt-pager" style="display:flex; align-items:center; gap:.5rem; margin-top:.5rem; flex-wrap:wrap;">
      <div style="display:flex; gap:.35rem; align-items:center;">
        <button id="prevPage" type="button" class="btn btn--inverse" style="padding:.35rem .6rem;">Prev</button>
        <span id="pageInfo" class="muted"></span>
        <button id="nextPage" type="button" class="btn btn--inverse" style="padding:.35rem .6rem;">Next</button>
      </div>
      <div style="margin-left:1rem; display:flex; align-items:center; gap:.4rem;">
        <label for="pageSize" class="muted">Rows per page</label>
        <select id="pageSize" style="padding:.3rem .45rem; border:1px solid #e2e2e2; border-radius:.5rem;">
          <option value="25" selected>25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>
  </div>
</div>

<!-- PapaParse for robust CSV parsing -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js" defer></script>

{% assign appt_rows = site.data.appointments %}
<script>
  window.AppointmentRows = [
    {% for r in appt_rows %}
    { body: {{ r.body_name | jsonify }}, seat: {{ r.seat_title | jsonify }}, type: "", reports_to: "", acronym: "", url: "" }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
  // Expose for debugging
  window.__APPT_ROWS_COUNT__ = window.AppointmentRows.length;
  
</script>

<script>
  (function () {
    const CSV_PATH = '/assets/data/appointments_ranked_ordered.csv';

    // Allowed organization types for display
    const MAYORAL_TYPES = new Set([
      'Mayoral Agency',
      'Advisory or Regulatory Organization',
      'Mayoral Office',
      'Division'
    ]);

    const state = {
      rows: [],
      query: '',
      typeFilter: null,
      categoryFilter: null,
      page: 1,
      pageSize: 25
    };

    const $tbody = document.getElementById('appt-body');
    const $filter = document.getElementById('filter');
    const $typePills = document.getElementById('typePills');
    const $catPills = document.getElementById('catPills');
    const $pageInfo = document.getElementById('pageInfo');
    const $prev = document.getElementById('prevPage');
    const $next = document.getElementById('nextPage');
    const $meta = document.getElementById('appt-meta');
    const $pageSize = document.getElementById('pageSize');

    function pill(label, val) {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'tag tag--pill';
      a.textContent = label;
      a.dataset.value = val || '';
      a.addEventListener('click', () => {
        state.typeFilter = state.typeFilter === val ? null : val;
        render();
        [...$typePills.children].forEach(btn => btn.classList.remove('tag--active'));
        if (state.typeFilter) a.classList.add('tag--active');
      });
      return a;
    }

    function pillCat(label, val) {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'tag tag--pill cat-pill';
      a.textContent = label;
      a.dataset.value = val || '';
      a.addEventListener('click', () => {
        state.categoryFilter = state.categoryFilter === val ? null : val;
        render();
        [...$catPills.children].forEach(btn => btn.classList.remove('tag--active'));
        if (state.categoryFilter) a.classList.add('tag--active');
      });
      return a;
    }

    // No separate Website column; link the organization name when URL exists

    function paginate(rows) {
      const pageSize = state.pageSize === 'all' ? Infinity : Number(state.pageSize);
      const total = rows.length;
      const totalPages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(total / pageSize));
      if (state.page > totalPages) state.page = totalPages;
      const start = pageSize === Infinity ? 0 : (state.page - 1) * pageSize;
      const end = pageSize === Infinity ? total : start + pageSize;
      return { slice: rows.slice(start, end), start: start + 1, end: Math.min(end, total), total, totalPages };
    }

    function updatePager(info) {
      const { totalPages } = info;
      $pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
      $prev.disabled = state.page <= 1;
      $next.disabled = state.page >= totalPages;
    }

    function render() {
      const q = state.query.trim().toLowerCase();
      let rows = state.rows.slice();

      if (q) {
        rows = rows.filter(r => {
          const hay = [
            r.body, r.seat, r.type, r.category, r.reports_to, r.acronym
          ].join(' ').toLowerCase();
          return hay.includes(q);
        });
      }
      if (state.typeFilter) {
        rows = rows.filter(r => r.type === state.typeFilter);
      }
      if (state.categoryFilter) {
        rows = rows.filter(r => r.category === state.categoryFilter);
      }

      const info = paginate(rows);
      const toRender = info.slice;

      $tbody.innerHTML = toRender.length ? toRender.map(r => `
        <tr>
          <td>
            <div style="font-weight:700">${r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${r.body}</a>` : r.body}</div>
            ${r.acronym ? `<div class=\"muted\" style=\"font-size:.875rem;\">${r.acronym}</div>` : ``}
          </td>
          <td>${r.type || ''}</td>
          <td>${r.category || ''}</td>
          <td>${r.seat || ''}</td>
        </tr>
      `).join('') : `<tr><td colspan="4" class="muted">No results</td></tr>`;

      $meta.textContent = toRender.length ? `Showing ${info.start}–${info.end} of ${info.total}` : '';
      updatePager(info);
    }

    function buildTypePills(types) {
      $typePills.innerHTML = '';
      $typePills.appendChild(pill('All types', null));
      types.forEach(t => $typePills.appendChild(pill(t, t)));
    }

    function buildCategoryPills(cats) {
      $catPills.innerHTML = '';
      $catPills.appendChild(pillCat('All categories', null));
      cats.forEach(c => $catPills.appendChild(pillCat(c, c)));
    }

    function hydrate(data) {
      const cleaned = (data || [])
        .map(d => {
          // Detect curated appointments CSV (appointments_ranked_ordered.csv)
          const isRankedCSV = typeof d['Organization Name'] !== 'undefined' || typeof d['Appointment to Make'] !== 'undefined';
          if (isRankedCSV) {
            return {
              body: (d['Organization Name'] || '').trim(),
              seat: (d['Appointment to Make'] || '').trim(),
              type: (d['Organization Type'] || '').trim(),
              category: (d['Category'] || '').trim(),
              url: (d['Website URL'] || '').trim(),
              order: Number(d['Order'] || 0) || 0,
              reports_to: '',
              acronym: ''
            };
          }
          // Fallback to pre-baked dataset
          return {
            body: (d.body || d.body_name || '').trim(),
            seat: (d.seat || d.seat_title || '').trim(),
            type: (d.type || '').trim(),
            reports_to: (d.reports_to || '').trim(),
            acronym: (d.acronym || '').trim(),
            url: (d.url || '').trim(),
            order: 0
          };
        })
        // Apply required filters for this directory
        .filter(r => MAYORAL_TYPES.has(r.type))
        .filter(r => r.seat && r.seat.length > 0)
        // Remove duplicates
        .filter((v, i, arr) => arr.findIndex(x => x.body === v.body && x.seat === v.seat) === i)
        // Sort by explicit order, then by name
        .sort((a, b) => (Number(a.order||0) - Number(b.order||0)) || a.body.localeCompare(b.body));

      state.rows = cleaned;
      const presentTypes = [...new Set(cleaned.map(r => r.type).filter(Boolean))];
      const presentCats = [...new Set(cleaned.map(r => r.category).filter(Boolean))];
      buildTypePills(presentTypes);
      buildCategoryPills(presentCats);
      render();
    }

    function loadCSV() {
      // Prefer CSV; fallback to inlined rows if not available
      function fallback() {
        try { hydrate(window.AppointmentRows || []); }
        catch (err) {
          console.error('Data load error', err);
          $tbody.innerHTML = `<tr><td colspan="3">Could not load data.</td></tr>`;
        }
      }

      if (!window.Papa) return fallback();
      Papa.parse(CSV_PATH, {
        header: true,
        download: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = (res && res.data) || [];
          if (rows.length) hydrate(rows); else fallback();
        },
        error: () => fallback()
      });
    }

    $filter.addEventListener('input', (e) => {
      state.query = e.target.value || '';
      state.page = 1;
      render();
    });

    $prev.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; render(); } });
    $next.addEventListener('click', () => { state.page += 1; render(); });
    $pageSize.addEventListener('change', (e) => { state.pageSize = e.target.value; state.page = 1; render(); });

    document.addEventListener('DOMContentLoaded', loadCSV);
  })();
</script>

<style>
  .text-right { text-align: right; }
  .muted { color: #67728a; }
  /* Category pills: specific aqua color */
  .appointments #catPills .tag--pill{
    border-color: #53c0a3 !important;
    background: #26ebfa !important;
    color: #0f2742 !important;
    transition: background .15s ease, box-shadow .15s ease, transform .05s ease !important;
  }
  .appointments #catPills .tag--pill:hover,
  .appointments #catPills .tag--pill:focus-visible{
    background: #53c0a3 !important;
    border-color: #53c0a3 !important;
    color: #0f2742 !important;
    box-shadow: 0 0 0 3px rgba(38,235,250,.25) !important; /* subtle hover/focus effect */
    text-decoration: none !important;
  }
  .appointments #catPills .tag--active{
    background: #53c0a3 !important;
    border-color: #53c0a3 !important;
    color: #0f2742 !important;
  }
  .table--tight th, .table--tight td { padding: .65rem .75rem; vertical-align: top; }
  /* Keep header flush with the top of the scroll container */
  .appointments .table--sticky thead th{ top: 0 !important; z-index: 6 !important; }
  /* Appointments container: shift left edge to align with logo while preserving right edge */
  @media (min-width: 1024px){
    .appointments .container{ max-width: none !important; width: 97% !important; margin-left: 1% !important; margin-right: 0 !important; padding-left: 0 !important; }
    .appointments .page__content{ max-width: none !important; }
  }
  /* Use default site content width; no custom widening on desktop */
</style>

