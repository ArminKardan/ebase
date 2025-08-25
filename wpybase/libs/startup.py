import os
import json
import time
import requests
from pathlib import Path

def safe_file(file_path, text):
    # Ensure directory exists
    Path(file_path).parent.mkdir(parents=True, exist_ok=True)
    # Write file content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
        
def startup():
    response = requests.post("https://qepal.com/api/sync/get", json={"type": "wpy"})
    if response.status_code == 200:
        json_data = response.json()
        if json_data.get("code") == 0:
            for file in json_data.get("files", []):
                safe_file(file["path"], file["value"])
    print("syncing finished.")
    time.sleep(2)
        
        
