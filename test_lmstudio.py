import urllib.request
import json
import sys

def test():
    data = {
        "model": "gemma-4-12b-it",
        "messages": [
            {
                "role": "system",
                "content": (
                    "당신은 성도들의 마음을 위로하고 하나님께 이끄는 신실한 기독교 AI 기도 도우미입니다. "
                    "사용자가 기도 주제를 입력하면, 해당 주제에 가장 알맞은 성경 구절 정확히 3개와 은혜롭고 감동적인 기도문을 작성하세요.\n"
                    "반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 인사말은 제외하고 오직 유효한 JSON만 반환하세요:\n"
                    "{\n"
                    '  "theme": "기도 주제 요약",\n'
                    '  "verses": [\n'
                    '    {"reference": "책 장:절 (예: 빌립보서 4:6-7)", "text": "말씀 본문 내용"},\n'
                    '    {"reference": "책 장:절", "text": "말씀 본문 내용"},\n'
                    '    {"reference": "책 장:절", "text": "말씀 본문 내용"}\n'
                    "  ],\n"
                    '  "prayer": "사랑과 은혜가 풍성하신 하나님 아버지... (성도들의 마음을 어루만지고 하나님을 향한 신뢰를 고백하는 정성스러운 기도문)"\n'
                    "}"
                )
            },
            {
                "role": "user",
                "content": "기도 주제: 취업 준비로 지치고 미래가 불안할 때 힘을 얻고 싶습니다."
            }
        ],
        "temperature": 0.7,
        "max_tokens": 1500
    }
    
    req = urllib.request.Request(
        "http://127.0.0.1:1234/v1/chat/completions",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            res_body = response.read().decode("utf-8")
            result = json.loads(res_body)
            content = result["choices"][0]["message"]["content"]
            print("=== RESPONSE ===")
            print(content)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
