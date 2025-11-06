import json
from pathlib import Path


def process_json(json_path: str):
    """Load JSON, sort by 'no', remove duplicates, and save"""
    with open(json_path, "r", encoding="utf-8") as f:
        json_data = json.load(f)

    comments = json_data.get("comments", [])
    data = json_data.get("entries", [])

    # sort and deduplicate
    data = sorted(data, key=lambda x: x["no"])
    seen = set()
    unique_data = []
    for item in data:
        if item["no"] not in seen:
            seen.add(item["no"])
            unique_data.append(item)
    unique_data.sort(key=lambda x: x["no"])

    # reassemble JSON
    processed = {"comments": comments, "entries": unique_data}

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    base_path = Path(__file__).parent
    json_path = base_path / "my_vocabulary.json"

    process_json(str(json_path))
