import urllib.request
import json
import time

def test_options():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    
    # 1. Gemma 4 with reasoning_effort="none" or "low"
    payload_gemma_low = {
        "model": "gemma-4-12b-it",
        "messages": [{"role": "user", "content": "시편 23:1 한 줄"}],
        "reasoning_effort": "low",
        "max_tokens": 100
    }
    
    # 2. Gemma 4 with max_thinking_tokens or budget
    payload_gemma_budget = {
        "model": "gemma-4-12b-it",
        "messages": [{"role": "user", "content": "시편 23:1 한 줄"}],
        "reasoning_effort": "low",
        "max_tokens": 500
    }
    
    # 3. Check Llama 3.1 8b speed if available
    payload_llama = {
        "model": "meta-llama-3.1-8b-instruct",
        "messages": [{"role": "user", "content": "시편 23:1 한 줄"}],
        "max_tokens": 100
    }

    for name, p in [("Gemma 4 Low", payload_gemma_low), ("Llama 3.1 8B", payload_llama)]:
        start = time.time()
        req = urllib.request.Request(url, data=json.dumps(p).encode("utf-8"), headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                elapsed = time.time() - start
                usage = data.get("usage", {})
                r = usage.get("completion_tokens_details", {}).get("reasoning_tokens", 0)
                c = usage.get("completion_tokens", 0)
                content = data["choices"][0]["message"].get("content", "")
                print(f"[{name}] {elapsed:.2f}s | Reasoning: {r} | Total: {c} | Output: {content.strip()}")
        except Exception as e:
            print(f"[{name}] Error: {e}")

if __name__ == "__main__":
    test_options()
