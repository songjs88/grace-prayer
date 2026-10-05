import urllib.request
import json
import time

def test_full_stream():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {
                "role": "system",
                "content": (
                    "당신은 성도들의 기도 제목을 듣고 하나님께 올려드리는 은혜로운 기독교 기도 인도자입니다.\n"
                    "사용자가 기도 제목을 제시하면 다음 순서와 형식으로 작성해주세요:\n\n"
                    "### 📖 관련 성경 구절\n"
                    "1. **[성경구절 위치]**: 말씀 내용 (묵상 한 줄)\n"
                    "2. **[성경구절 위치]**: 말씀 내용 (묵상 한 줄)\n"
                    "3. **[성경구절 위치]**: 말씀 내용 (묵상 한 줄)\n\n"
                    "### 🙏 은혜의 기도문\n"
                    "(경건하고 따뜻하며 성도의 마음에 큰 위로와 용기를 주는 기도문)\n"
                    "아멘."
                )
            },
            {
                "role": "user",
                "content": "기도 제목: 새로운 사업을 시작하면서 오는 두려움과 불안을 이겨내고 하나님의 지혜를 구합니다."
            }
        ],
        "max_tokens": 1500,
        "temperature": 0.7,
        "stream": True
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    reasoning_tokens = []
    content_tokens = []
    
    start = time.time()
    with urllib.request.urlopen(req, timeout=120) as resp:
        for line in resp:
            line_str = line.decode("utf-8", errors="replace").strip()
            if line_str.startswith("data: "):
                data_str = line_str[6:]
                if data_str == "[DONE]":
                    break
                try:
                    chunk = json.loads(data_str)
                    delta = chunk["choices"][0].get("delta", {})
                    if "reasoning_content" in delta and delta["reasoning_content"]:
                        reasoning_tokens.append(delta["reasoning_content"])
                    if "content" in delta and delta["content"]:
                        content_tokens.append(delta["content"])
                except Exception:
                    pass
                    
    elapsed = time.time() - start
    print(f"Elapsed: {elapsed:.2f}s")
    print(f"Reasoning length: {len(''.join(reasoning_tokens))} chars")
    print("=== FINAL CONTENT ===")
    print("".join(content_tokens))

if __name__ == "__main__":
    test_full_stream()
