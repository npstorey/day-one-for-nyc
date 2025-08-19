import csv
import json
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

OUT_DIR = Path("datafeeds")
OUT_DIR.mkdir(exist_ok=True)


def fetch_json(url: str, timeout: int = 15):
    try:
        with urlopen(url, timeout=timeout) as resp:
            data = resp.read().decode("utf-8")
            return json.loads(data)
    except (URLError, HTTPError, TimeoutError, json.JSONDecodeError):
        return None


def write_csv(path: Path, headers: list[str], rows: list[dict]):
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=headers)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in headers})


def zap_projects():
    url = (
        "https://data.cityofnewyork.us/resource/rvhx-8trz.json?"
        "$limit=200&$order=last_milestone_date DESC"
    )
    headers = [
        "project_id",
        "project_name",
        "bbl",
        "borough",
        "status",
        "last_milestone",
        "last_milestone_date",
    ]
    data = fetch_json(url) or []
    rows = []
    for d in data:
        rows.append({h: d.get(h, "") for h in headers})
    write_csv(OUT_DIR / "zap_projects.csv", headers, rows)


def mmr_indicators():
    url = "https://data.cityofnewyork.us/resource/qgf2-88cm.json?$limit=200"
    headers = ["agency", "indicator_name", "latest_fy", "latest_value"]
    data = fetch_json(url) or []
    rows = []
    for d in data:
        rows.append({h: d.get(h, "") for h in headers})
    write_csv(OUT_DIR / "mmr_indicators.csv", headers, rows)


def city_record_procurement():
    # Placeholder/stub; write header-only if fetch fails
    url = "https://example.com/city-record-procurement.json"
    headers = ["notice_date", "agency", "category", "title", "url"]
    data = fetch_json(url) or []
    rows = []
    if isinstance(data, list):
        for d in data:
            rows.append({h: d.get(h, "") for h in headers})
    write_csv(OUT_DIR / "city_record_procurement.csv", headers, rows)


def main():
    zap_projects()
    mmr_indicators()
    city_record_procurement()


if __name__ == "__main__":
    main()


