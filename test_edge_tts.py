import asyncio
import edge_tts
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

async def test_tts():
    text = "사랑과 자비가 풍성하신 하나님 아버지, 오늘도 주님 앞에 나와 마음을 다해 기도합니다. 우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    voice = "ko-KR-SunHiNeural"
    output_file = "test_prayer.mp3"
    
    print(f"Generating audio with {voice}...")
    start = time.time()
    communicate = edge_tts.Communicate(text, voice, rate="-4%", pitch="-2Hz")
    await communicate.save(output_file)
    print(f"Success in {time.time() - start:.2f}s! Saved to {output_file}")

if __name__ == "__main__":
    asyncio.run(test_tts())
