---
layout: single
title: About
permalink: /about/
description: About Day One for NYC — a nonpartisan, independent guide to governing New York City from day one.
toc: true
toc_label: On this page
toc_sticky: true
section: about
classes:
  - dayone-report
  - page--power
---

{% assign scope = site.pages | where_exp: "p", "p.url contains '/scope-of-mayoral-power/'" | first %}

<div class="card card--section" style="margin-top:.5rem;">
  <p class="lead">
    <strong>Day One for NYC</strong> is an independent, nonpartisan guide for a new mayoral administration and the public. Our aim is simple: make it easier to govern well from day one.
  </p>

  <p>
    We synthesize public information about how New York City government works, the <a href="/scope-of-mayoral-power/">scope of mayoral power</a>, high-impact <a href="/appointments/">appointments</a>, key <a href="/calendars/">calendars</a> and legal deadlines, and a curated set of <a href="/resources/">resources</a> you can use immediately.
  </p>

  <p>
    <a class="cta-button pdf-btn"
       href="{{ scope.pdf | default: '/assets/pdfs/scope-of-mayoral-power.pdf' | relative_url }}"
       type="application/pdf"
       download="{{ scope.download_name | default: 'Day-One-NYC_Scope-of-Mayoral-Power.pdf' }}"
       rel="noopener">Download the PDF</a>
  </p>
</div>

> This site is a **prototype** created and reviewed by people who **used generative-AI tools** for drafting and organization. This is a living document; please send corrections or suggestions to **hello@dayonefor.nyc**.  
{: .notice--info }

## What this is

<div class="card card--section">
  <ul>
    <li>A practical, plain-language explainer of the mayor’s formal powers and the realities of delivery in a large, unionized, service-heavy city.</li>
    <li>A “starter kit” linking to source documents, statutes, calendars, and tools helpful in the first 100 days and beyond.</li>
    <li>A living site designed to evolve as new information and contributions come in.</li>
  </ul>
</div>

## What this isn’t

<div class="card card--section">
  <ul>
    <li>Not a campaign site and not affiliated with any candidate or committee.</li>
    <li>Not legal advice. We cite laws and official sources where relevant and welcome corrections.</li>
    <li>Not exhaustive — we prioritize clarity, citations, and operational usefulness.</li>
  </ul>
</div>

## Who this is for

<div class="card card--section">
  <ul>
    <li>Incoming City Hall staff, deputy mayors, commissioners, and appointees.</li>
    <li>Career civil servants and agency teams who need cross-agency context.</li>
    <li>Journalists, advocates, researchers, and New Yorkers who want a clear view of how city power is exercised.</li>
  </ul>
</div>

## How we build it (sources & process)

<div class="card card--section">
  <ul>
    <li><strong>Human-created, human-reviewed.</strong> People drafted, edited, and fact-checked every page. Generative-AI tools assisted with outlining, plain-language phrasing, and link triage — <em>never auto-published</em>.</li>
    <li><strong>Grounded in official records.</strong> New York City Charter and Administrative Code; executive orders; rulemaking under the City Administrative Procedure Act (CAPA); Mayor’s Management Report (MMR); Office of Management and Budget (OMB) documents; Comptroller and Independent Budget Office (IBO) reports; Rules of the City of New York (RCNY); the City Record; and agency publications.</li>
    <li><strong>Plain-language summaries with citations.</strong> We translate statutes and procedures into concise explanations and link back to the source so readers can verify.</li>
    <li><strong>Change-aware.</strong> Powers, calendars, and structures evolve. We timestamp major updates and note when something is in flux.</li>
    <li><strong>Accessibility and export.</strong> Readable typography, scannable sections, and print-friendly PDFs.</li>
    <li><strong>Acronyms.</strong> We spell out acronyms on first use (e.g., Mayor’s Management Report (MMR)) and list them in the site glossary.</li>
  </ul>
</div>

## How to use this site

<div class="card card--section">
  <ul>
    <li>Start with <a href="/scope-of-mayoral-power/">Scope of Mayoral Power</a> for a concise map of formal powers and limits.</li>
    <li>Use the <a href="/levers/">Levers Navigator</a> to explore specific tools (executive orders, rulemaking, budget execution, land use, procurement, and more).</li>
    <li>Look up seats in the <a href="/appointments/">Appointments Directory</a> and plan for vacancies and confirmations.</li>
    <li>Import dates from <a href="/calendars/">Calendars</a> to avoid missed filings, hearings, or budget clocks.</li>
    <li>Dive deeper via the <a href="/resources/">Resources</a> library (memos, guides, explainers).</li>
  </ul>
</div>

## Contribute & feedback

<div class="card card--section">
  <p>We welcome suggested edits, missing citations, and additional resources. Fastest ways to help:</p>
  <ul>
    <li>Email corrections or links to <a href="mailto:hello@dayonefor.nyc">hello@dayonefor.nyc</a>.</li>
    <li>Open an issue or make a contribution on GitHub: <a href="https://github.com/npstorey/day-one-for-nyc" target="_blank" rel="noopener">github.com/npstorey/day-one-for-nyc</a>.</li>
    <li>Offer subject-matter review for specific areas (rulemaking, capital planning, procurement, human resources, etc.).</li>
  </ul>
</div>

## Contact

<div class="card card--section">
  <ul>
    <li>Email: <a href="mailto:hello@dayonefor.nyc">hello@dayonefor.nyc</a></li>
    <li>Press or speaking: include “PRESS” in the subject line for a faster response.</li>
  </ul>
</div>

## License & reuse

<div class="card card--section">
  <p>Unless otherwise noted, text on this site may be reused with attribution (<em>suggested: “Day One for NYC” + page URL</em>). Code that powers the site follows the license of this repository. Logos and third-party materials remain the property of their respective owners.</p>
</div>

## Press kit

<div class="card card--section">
  <ul>
    <li>Project name: <strong>Day One for NYC</strong></li>
    <li>One-line: Nonpartisan, practical guide to governing NYC from day one.</li>
    <li>Primary URLs: <code>{{ site.url | default: site.github.url }}</code> • <a href="/scope-of-mayoral-power/">Scope of Mayoral Power</a></li>
    <li>Media contact: <a href="mailto:hello@dayonefor.nyc">hello@dayonefor.nyc</a></li>
  </ul>
</div>

## Changelog & roadmap

<div class="card card--section">
  <p><strong>Changelog:</strong> We note material updates on key pages. Major revisions to the Scope PDF are versioned (e.g., v1.0, v1.1).</p>
  <p><strong>Near-term roadmap:</strong></p>
  <ul>
    <li>Expand the <a href="/appointments/">Appointments Directory</a> with term details and citations.</li>
    <li>Deeper lever pages (playbooks for rulemaking, budget execution, land use).</li>
    <li>Calendar exports (ICS) for recurring legal deadlines.</li>
    <li>More implementation guidance in “From Power to Delivery.”</li>
    <li>Polish style and layout of the site</li>
  </ul>
</div>
