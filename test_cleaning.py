import re

def test_clean(text):
    # Strip headers
    lines = text.strip().split('\n')
    filtered = []
    header_skipped = False
    for line in lines:
        stripped = re.sub(r'^[#*\-–—\s]+', '', line).strip()
        stripped = re.sub(r'[#*\s]+$', '', stripped).strip()
        stripped_no_emoji = re.sub(r'[\U00010000-\U0010ffff]', '', stripped).strip()
        if not header_skipped and any(k in stripped_no_emoji for k in ["은혜의 기도문", "은혜의 기도", "기도문"]):
            continue
        header_skipped = True
        filtered.append(line)
        
    cleaned = '\n'.join(filtered).strip()
    
    # Check cut off
    cutoff_regex = r'(?:우리\s*주\s*)?(?:저를\s*사랑하시는\s*)?예수\s*그리스도의(?:\s*이름으로)?\s*$'
    if re.search(cutoff_regex, cleaned):
        cleaned = re.sub(cutoff_regex, '', cleaned).rstrip()
        cleaned += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    elif not cleaned.rstrip().endswith(("아멘.", "아멘")):
        cleaned += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
        
    return cleaned

sample_user_case = (
    "🙏 은혜의 기도문\n\n"
    "사랑과 자비가 풍성하신 하나님 아버지, 오늘도 메마른 땅과 같은 마음으로 주님 앞에 엎드려 기도합니다.\n\n"
    "오늘 이 시간, 제 마음의 폭풍을 잠재우시고 고요한 평안을 허락하여 주시옵소서. "
    "상처 입은 내 마음을 어루만져 주시고, 다시 시작할 힘을 얻는 은혜를 베풀어 주옵소서. 저를 사랑하시는 예수 그리스도의 "
)

result = test_clean(sample_user_case)
print("=== RESULT ===")
print(result)
