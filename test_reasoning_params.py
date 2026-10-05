import urllib.request
import json
import time

def test_param(name, extra_params):
    url = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "user", "content": "시편 23:1 한 구절만 적어줘."}
        ],
        "max_tokens": 150,
        "stream": False,
        **extra_params
    }
    start = time.time()
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            elapsed = time.time() - start
            choice = data["choices"][0]
            usage = data.get("usage", {})
            r_tokens = usage.get("completion_tokens_details", {}).get("reasoning_tokens", 0)
            c_tokens = usage.get("completion_tokens", 0)
            content = choice["message"].get("content", "")
            print(f"[{name}] Elapsed: {elapsed:.2f}s | Reasoning: {r_tokens} | Total: {c_tokens} | Content: {content[:80]}")
    except Exception as e:
        print(f"[{name}] Error: {e}")

print("Testing different reasoning suppression methods...")
# Test 1: reasoning_effort="none" or "low"
test_param("reasoning_effort=low", {"reasoning_effort": "low"})
# Test 2: thinking={"type": "disabled"}
test_param("thinking_disabled", {"thinking": {"type": "disabled"}})
# Test 3: chat_template_kwargs
test_param("chat_template_kwargs_thinking_false", {"chat_template_kwargs": {"thinking": False}})
