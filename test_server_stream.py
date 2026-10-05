import urllib.request
import json
import time
import sys

sys.stdout.reconfigure(encoding="utf-8")

def verify_fast_stream():
    url = "http://127.0.0.1:8000/api/generate_stream"
    payload = {
        "topic": "가족의 평안과 건강",
        "category": "가족과 자녀",
        "tone": "위로와 평안",
        "fast_mode": True
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    start = time.time()
    first_token_time = None
    tokens_count = 0
    
    with urllib.request.urlopen(req, timeout=45) as resp:
        for line in resp:
            line_str = line.decode("utf-8", errors="replace").strip()
            if '"token"' in line_str:
                tokens_count += 1
                if first_token_time is None:
                    first_token_time = time.time() - start
                    print(f"⚡ 첫 번째 글자 도착 시간: {first_token_time:.2f}초!")
            if 'event: done' in line_str:
                break
                
    total_time = time.time() - start
    print(f"🎉 전체 완료 시간: {total_time:.2f}초 (총 {tokens_count} 청크 수신)")

if __name__ == "__main__":
    verify_fast_stream()
