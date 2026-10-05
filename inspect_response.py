import urllib.request
import json

def inspect_response():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "user", "content": "안녕하세요. 오늘 날씨는 어떤가요?"}
        ],
        "max_tokens": 100,
        "stream": False
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(json.dumps(data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    inspect_response()
