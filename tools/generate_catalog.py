"""Generate a JSON catalog mapping automation packs to their script bodies."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parent.parent
PACKS_DIR = ROOT / "packs"

TECHNOLOGIES: Dict[str, str] = {
    "datto_rmm_components": "Datto RMM Components",
    "powershell": "PowerShell",
    "cmd": "CMD",
    "ps1": ".PS1",
}

PACK_TITLES: Dict[int, str] = {
    1: "PC Clean & Optimization",
    2: "PC Networking",
    3: "PC Updates & Patch Hygiene",
    4: "Security Hardening",
    5: "Inventory & Health Monitoring",
    6: "Backup & Recovery Readiness",
}


def load_pack_entries(technology: str) -> List[Dict[str, str]]:
    tech_dir = PACKS_DIR / technology
    if not tech_dir.is_dir():
        raise FileNotFoundError(f"Missing technology directory: {tech_dir}")

    entries: List[Dict[str, str]] = []
    for script_path in sorted(tech_dir.glob("pack*")):
        match = re.match(r"pack(\d+)_", script_path.stem)
        if not match:
            continue
        pack_number = int(match.group(1))
        with script_path.open(encoding="utf-8") as handle:
            script_body = handle.read()

        entries.append(
            {
                "pack_number": pack_number,
                "pack_name": PACK_TITLES.get(pack_number, f"Pack {pack_number}"),
                "file": script_path.relative_to(ROOT).as_posix(),
                "script_body": script_body,
            }
        )

    return sorted(entries, key=lambda item: item["pack_number"])


def build_catalog() -> Dict[str, object]:
    catalog = []
    for key, display_name in TECHNOLOGIES.items():
        catalog.append(
            {
                "technology_key": key,
                "technology_name": display_name,
                "packs": load_pack_entries(key),
            }
        )

    now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)

    return {
        "generated_at": now.isoformat(),
        "catalog": catalog,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=PACKS_DIR / "catalog.json",
        help="Destination JSON file (default: packs/catalog.json)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data = build_catalog()
    output_path: Path = args.output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Catalog written to {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
