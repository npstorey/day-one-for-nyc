import csv
import re
from pathlib import Path

CSV = Path("_data/appointments.csv")
OUT = Path("_appointments")


def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s


TEMPLATE = """---
layout: appointment
title: {title}
body_name: {body_name}
seat_title: {seat_title}
appointing_authority: {appointing_authority}
advice_and_consent: {advice_and_consent}
term_length_years: {term_length_years}
holdover_allowed: {holdover_allowed}
quorum: {quorum}
mayoral_share_pct: {mayoral_share_pct}
priority_score: {priority_score}
priority_tier: {priority_tier}
statutory_cite: {statutory_cite}
sources:
  - "{source_url}"
notes: {notes}
permalink: /appointments/{slug}/
---
"""


def main() -> None:
    OUT.mkdir(exist_ok=True)
    with CSV.open() as f:
        r = csv.DictReader(f)
        for row in r:
            slug = slugify(f"{row['body_name']} {row['seat_title']}")
            path = OUT / f"{slug}.md"
            safe = {k: (row.get(k, "") or "").replace('"', '\\"') for k in r.fieldnames}
            content = TEMPLATE.format(
                title=f"{row['seat_title']} — {row['body_name']}",
                slug=slug,
                **safe
            )
            path.write_text(content)


if __name__ == "__main__":
    main()


