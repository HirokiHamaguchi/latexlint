import json
from pathlib import Path


def process_json(json_path: str):
    """Load JSON, sort by 'yes', remove duplicates in 'no' list, and save"""
    with open(json_path, "r", encoding="utf-8") as f:
        json_data = json.load(f)

    comments = json_data.get("comments", [])
    entries_ja = json_data.get("entries_ja", [])
    entries_en = json_data.get("entries_en", [])

    def normalize_entries(data):
        for entry in data:
            no_list = entry.get("no", [])
            if isinstance(no_list, str):
                no_list = [no_list]
            entry["no"] = sorted(list(set(no_list)))

        data.sort(key=lambda x: x["yes"])
        return data

    entries_ja = normalize_entries(entries_ja)
    entries_en = normalize_entries(entries_en)

    # reassemble JSON
    processed = {
        "comments": comments,
        "entries_ja": entries_ja,
        "entries_en": entries_en,
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    base_path = Path(__file__).parent
    json_path = base_path / "my_vocabulary.json"

    process_json(str(json_path))
