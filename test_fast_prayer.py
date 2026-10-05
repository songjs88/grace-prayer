import urllib.request
import json
import time

def test_fast_prayer():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    
    system_prompt = (
        "당신은 성도들의 기도를 돕는 따뜻한 기독교 AI 기도 도우미입니다.\n"
        "생각(Reasoning)은 최소화하고, 즉시 아래 양식에 맞추어 관련 성경구절 3개와 은혜로운 기도문을 간결하고 감동적으로 작성하세요:\n\n"
        "### 📖 관련 성경 말씀\n"
        "1. **[책 장:절]**: \"말씀 본문\"\n"
        "   - *묵상*: 한 줄 묵상\n"
        "2. **[책 장:절]**: \"말씀 본문\"\n"
        "   - *묵상*: 한 줄 묵상\n"
        "3. **[책 장:절]**: \"말씀 본문\"\n"
        "   - *묵상*: 한 줄 묵상\n\n"
        "### 🙏 은혜의 기도문\n"
        "(하나님 아버지를 향한 진솔하고 따뜻한 기도문 3~4문단)\n\n"
        "예수님의 이름으로 기도드립니다. 아멘."
    )
    
    user_prompt = "기도 주제: 취업 준비로 지치고 불안한 마음을 주님께 맡깁니다."
    
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.6,
        "max_tokens": 800,
        "reasoning_effort": "low",
        "stream": True
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    start = time.time()
    first_token_time = None
    r_tokens = 0
    c_tokens = 0
    content_chars = []
    
    with urllib.request.urlopen(req, timeout=60) as resp:
        for line in resp:
            line_str = line.decode("utf-8", errors="replace").strip()
            if not line_str.startswith("data: "):
                continue
            data_str = line_str[6:]
            if data_str == "[DONE]":
                break
            try:
                chunk = json.loads(data_str)
                delta = chunk["choices"][0].get("delta", {})
                if "reasoning_content" in delta and delta["reasoning_content"]:
                    r_tokens += 1
                if "content" in delta and delta["content"]:
                    if first_token_time is None:
                        first_token_time = time.time() - start
                    c_tokens += 1
                    content_chars.append(delta["content"])
            except Exception:
                pass
                
    total_time = time.time() - start
    print(f"Total time: {total_time:.2f}s")
    print(f"First prayer token appeared in: {first_token_time:.2f}s")
    print(f"Reasoning chunks: {r_tokens}, Content chunks: {c_tokens}")
    print("=== Generated Content ===")
    print("".join(content_chars))

if __name__ == "__main__":
    test_fast_prayer()
