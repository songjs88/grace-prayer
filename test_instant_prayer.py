import urllib.request
import json
import time

def test_instant_prayer():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    
    system_prompt = (
        "당신은 성도들의 기도를 돕는 은혜로운 기독교 AI 기도 도우미입니다.\n"
        "사용자의 기도 제목에 대해 아래 양식으로 관련 성경구절 3개와 따뜻하고 깊은 은혜의 기도문을 작성하세요:\n\n"
        "### 📖 관련 성경 말씀\n"
        "1. **[책 장:절]**: \"말씀 본문 내용\"\n"
        "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n"
        "2. **[책 장:절]**: \"말씀 본문 내용\"\n"
        "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n"
        "3. **[책 장:절]**: \"말씀 본문 내용\"\n"
        "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n\n"
        "### 🙏 은혜의 기도문\n"
        "(하나님 아버지를 향한 진솔한 고백과 간구, 감사와 평안의 기도문)\n\n"
        "우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    )
    
    user_prompt = "기도 제목: 취업 준비로 지치고 미래가 불안할 때 힘을 얻고 싶습니다."
    
    # Notice the prefill technique!
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
        {"role": "assistant", "content": "</thought>\n### 📖 관련 성경 말씀\n"}
    ]
    
    payload = {
        "model": "gemma-4-12b-it",
        "messages": messages,
        "max_tokens": 800,
        "temperature": 0.7,
        "stream": True
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    start = time.time()
    first_token_time = None
    chunks = []
    
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
                if "content" in delta and delta["content"]:
                    if first_token_time is None:
                        first_token_time = time.time() - start
                    chunks.append(delta["content"])
            except Exception:
                pass
                
    total_time = time.time() - start
    output = "### 📖 관련 성경 말씀\n" + "".join(chunks)
    print(f"Total time: {total_time:.2f}s")
    print(f"First token appeared in: {first_token_time:.2f}s")
    print("Content length:", len(output))
    print("=== First 200 chars ===")
    # Safe ascii print for Windows
    print(output[:200].encode('utf-8', errors='replace').decode('utf-8'))

if __name__ == "__main__":
    test_instant_prayer()
