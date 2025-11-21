import json
from pathlib import Path


def process_json(json_path: str):
    """Load JSON, sort by 'yes', remove duplicates in 'no' list, and save"""
    with open(json_path, "r", encoding="utf-8") as f:
        json_data = json.load(f)

    comments = json_data.get("comments", [])
    data = json_data.get("entries", [])

    # Sort by 'yes' and deduplicate 'no' list
    for entry in data:
        # Ensure 'no' is a list and remove duplicates while preserving order
        no_list = entry.get("no", [])
        if isinstance(no_list, str):
            # Convert old format to new format if needed
            no_list = [no_list]
        # Remove duplicates and sort
        entry["no"] = sorted(list(set(no_list)))

    # Sort entries by 'yes'
    data.sort(key=lambda x: x["yes"])

    # reassemble JSON
    processed = {"comments": comments, "entries": data}

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    base_path = Path(__file__).parent
    json_path = base_path / "my_vocabulary.json"

    process_json(str(json_path))
