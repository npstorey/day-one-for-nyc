# Day One for NYC

**Day One for NYC** is an independent, nonpartisan guide to governing New York City from day one.  
It maps the **scope of mayoral power**, highlights **high-impact appointments**, tracks **key calendars & legal clocks**, and curates **practical resources** for incoming leaders and the public.

- **Live site:** https://dayonefor.nyc (placeholder)
- **Contact:** hello@dayonefor.nyc

> This is a **prototype** created and reviewed by people who used **generative-AI tools** to accelerate drafting and organization. Content is human-edited and fact-checked, and will continue to evolve. Spot an issue or have a correction? Please open a GitHub Issue or email **hello@dayonefor.nyc**.

---

## What this is
- A plain-language explainer of the mayor’s formal powers and the realities of delivery in a large, unionized, service-heavy city.
- A “starter kit” with links to statutes, calendars, and tools helpful in the first 100 days.
- A living site designed to improve with public contributions.

## What this isn’t
- Not a campaign site; not affiliated with any candidate or committee.
- Not legal advice.
- Not exhaustive—we prioritize clarity, citations, and operational usefulness.

---

## Tech stack
- **Static site:** Jekyll (Markdown + Liquid)
- **Hosting:** Vercel
- **Styling/JS:** Vanilla CSS/JS (see `/assets`)
- **Data:** CSV/JSON in `/assets/data` or `_data` (where applicable)

**Key directories**
```
/about, /appointments, /calendars, /levers, /resources   # Content pages
/_layouts, /_includes, /_data                            # Jekyll templates/data
/assets                                                  # CSS, JS, images, PDFs
```

---

## Local development

### Prereqs
- Ruby (see `.ruby-version`)
- Bundler

```bash
# install deps
bundle install
# if package.json is used:
# npm install

# run locally
bundle exec jekyll serve
# open http://127.0.0.1:4000
```

### Production build
```bash
JEKYLL_ENV=production bundle exec jekyll build
# output -> ./_site
```

### Deploying to Vercel
- **Build command:** `JEKYLL_ENV=production bundle exec jekyll build`
- **Output directory:** `_site`
- **Environment vars (recommended):**
  - `RUBY_VERSION` (match `.ruby-version`)
  - `BUNDLE_WITHOUT=development:test` (optional)
- Connect this repo in Vercel and deploy.

---

## Contributing
We welcome fixes, clarifications, citations, accessibility improvements, and design polish.

**Quick ways to help**
- Open an Issue for typos, broken links, or missing citations.
- Open a PR with small, focused changes.
- Suggest datasets or official docs we should link to.
- Offer subject-matter review on specific topics (rulemaking, budget, land use, procurement, HR, etc.).

### Content style & sourcing
- Prefer official sources (NYC Charter & Admin Code, Executive Orders, CAPA rulemaking, Mayor’s Management Report, OMB/Comptroller/IBO, agency pages).
- Use clear, plain language. Explain acronyms on first use.
- Provide citations/links near the relevant text.
- Be careful to avoid legal advice.

### Design & UX
- Keep typography readable and spacing consistent.
- Ensure focus states and keyboard nav work.
- Test print/PDF output.

### How to propose a change
1. Fork the repo and create a feature branch.
2. Make changes and include citations.
3. Open a PR with a concise summary and screenshots (if UI).
4. Link to related Issues.

---

## License
- **Code:** MIT License (see LICENSE)
- **Content (text, graphics):** CC BY 4.0 (see LICENSE-CONTENT)
- Logos and third-party materials remain the property of their respective owners.

---

## Roadmap (short-term)
- Expand Appointments directory coverage with term details & citations.
- Calendar exports (ICS) for recurring legal deadlines.
- Deeper “From Power to Delivery” implementation guidance.

---

## Contact
- **Email:** hello@dayonefor.nyc
- **Press:** include “PRESS” in the subject line for a faster response.

---

### Quick cleanup steps

```bash
# remove the old plan docs, add README and .gitignore
git rm PROJECT_PLAN.md scope-of-mayoral-power.md 2>/dev/null || true
printf "%s\n" "<paste README.md content here>" > README.md
printf "%s\n" "<paste .gitignore content here>" > .gitignore

git add README.md .gitignore
git commit -m "Add README and .gitignore; remove project plan docs"
git push
```
