import urllib.request
import json
import time

def test_chat():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "user", "content": "안녕하세요! 간단히 한 단어로 인사해주세요."}
        ],
        "max_tokens": 50,
        "stream": False
    }
    
    print("Testing /v1/chat/completions...")
    start = time.time()
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"Success in {time.time() - start:.2f}s!")
            print("Content:", data["choices"][0]["message"]["content"])
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_chat()
