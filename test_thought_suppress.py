import urllib.request
import json
import time

def test_suppression():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    
    trials = [
        ("Default", [
            {"role": "user", "content": "시편 23:1 한 줄"}
        ]),
        ("System: Do not think", [
            {"role": "system", "content": "You must NOT output any reasoning or thoughts. Answer immediately in Korean."},
            {"role": "user", "content": "시편 23:1 한 줄"}
        ]),
        ("Assistant prefill empty thought", [
            {"role": "user", "content": "시편 23:1 한 줄"},
            {"role": "assistant", "content": ""}
        ])
    ]
    
    for name, msgs in trials:
        payload = {
            "model": "gemma-4-12b-it",
            "messages": msgs,
            "max_tokens": 100,
            "temperature": 0.3
        }
        start = time.time()
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                d = json.loads(resp.read().decode("utf-8"))
                elapsed = time.time() - start
                usage = d.get("usage", {})
                r = usage.get("completion_tokens_details", {}).get("reasoning_tokens", 0)
                c = usage.get("completion_tokens", 0)
                content = d["choices"][0]["message"].get("content", "")
                print(f"{name:30} -> {elapsed:.2f}s | Reasoning: {r:3} | Content: {content.strip()[:40]}")
        except Exception as e:
            print(f"{name:30} -> Error: {e}")

if __name__ == "__main__":
    test_suppression()
