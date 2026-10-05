import urllib.request
import json

def test_stream():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "user", "content": "시편 23편 1절 짧게 적어줘"}
        ],
        "max_tokens": 100,
        "stream": True
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        for line in resp:
            line_str = line.decode("utf-8").strip()
            if line_str.startswith("data: "):
                data_str = line_str[6:]
                if data_str == "[DONE]":
                    print("\n[STREAM COMPLETE]")
                    break
                try:
                    chunk = json.loads(data_str)
                    delta = chunk["choices"][0].get("delta", {})
                    if "reasoning_content" in delta and delta["reasoning_content"]:
                        print(delta["reasoning_content"], end="", flush=True)
                    if "content" in delta and delta["content"]:
                        print(delta["content"], end="", flush=True)
                except Exception:
                    pass

if __name__ == "__main__":
    test_stream()
