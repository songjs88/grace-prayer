import urllib.request
import json
import time

def test_speed():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    
    # Test 1: Prompt instructing direct answer without reasoning
    prompt = (
        "기도 주제: 마음의 평안\n"
        "생각(Reasoning/Thinking) 과정은 생략하고, 즉시 아래 형식으로 관련 성경구절 3개와 3~4문장의 따뜻한 기도문만 간결하게 작성하세요.\n\n"
        "1. [구절]: 말씀\n"
        "2. [구절]: 말씀\n"
        "3. [구절]: 말씀\n\n"
        "기도문:\n"
    )
    
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "system", "content": "당신은 기독교 기도 인도자입니다. 생각 과정 없이 즉시 답변만 간결하게 출력하세요."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.5,
        "stream": False
    }
    
    start = time.time()
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        elapsed = time.time() - start
        choice = data["choices"][0]
        usage = data.get("usage", {})
        print(f"Elapsed: {elapsed:.2f}s")
        print(f"Reasoning tokens: {usage.get('completion_tokens_details', {}).get('reasoning_tokens', 'N/A')}")
        print(f"Completion tokens: {usage.get('completion_tokens', 'N/A')}")
        print("Content preview:\n", choice["message"].get("content", "")[:300])

if __name__ == "__main__":
    test_speed()
