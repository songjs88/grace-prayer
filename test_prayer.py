import urllib.request
import json
import time

def test_prayer():
    url = "http://127.0.0.1:1234/v1/chat/completions"
    prompt = (
        "기도 주제: 취업 준비로 지치고 미래가 불안할 때\n\n"
        "다음 형식으로 기도 주제에 맞는 성경 구절 정확히 3개와 기도문을 작성해주세요:\n\n"
        "### 성경 구절\n"
        "1. [성경구절 위치]: 말씀 내용\n"
        "2. [성경구절 위치]: 말씀 내용\n"
        "3. [성경구절 위치]: 말씀 내용\n\n"
        "### 기도문\n"
        "(마음을 위로하고 힘을 주는 은혜로운 기도문)\n"
    )
    
    payload = {
        "model": "gemma-4-12b-it",
        "messages": [
            {"role": "system", "content": "당신은 기독교 성도들을 위로하고 믿음을 굳건히 해주는 은혜로운 AI 기도 인도자입니다. 생각은 최소화하고 즉시 사용자에게 전달할 성경 구절과 기도문을 정성껏 작성하세요."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2048,
        "temperature": 0.7,
        "stream": False
    }
    
    print("Sending prayer request to LM Studio...")
    start = time.time()
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            elapsed = time.time() - start
            msg = data["choices"][0]["message"]
            print(f"Completed in {elapsed:.2f}s!")
            print("=== Reasoning Content ===")
            print(msg.get("reasoning_content", "")[:200] + "...")
            print("=== Main Content ===")
            print(msg.get("content", ""))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_prayer()
