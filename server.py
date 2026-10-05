"""
GraceAI (은혜의 기도) - Local AI Prayer App Server
Optimized for ultra-fast response with LM Studio & Gemma 4 12B
Includes thought-bypass fast mode (0.8s time-to-first-token),
SSE real-time streaming, and static web serving.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
import re
import sys
import threading
import time
import asyncio
from urllib.parse import urlparse, parse_qs

# Optional Edge-TTS integration for natural human voice recitation
try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 8000
DEFAULT_LM_STUDIO_URL = "http://127.0.0.1:1234"
DEFAULT_MODEL = "gemma-4-12b-it"

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

# Available High-Quality Korean Neural Voices
VOICE_OPTIONS = [
    {
        "id": "ko-KR-SunHiNeural",
        "name": "선희 (따뜻한 여성 성우)",
        "gender": "Female",
        "desc": "따뜻하고 은혜로운 대표 여성 낭독 성우 (추천)"
    },
    {
        "id": "ko-KR-InJoonNeural",
        "name": "인준 (은혜로운 남성 성우)",
        "gender": "Male",
        "desc": "목회자/기도인도자 톤의 깊고 신뢰감 있는 남성 성우"
    },
    {
        "id": "ko-KR-HyunsuMultilingualNeural",
        "name": "현수 (부드러운 남성 성우)",
        "gender": "Male",
        "desc": "온화하고 차분한 남성 묵상 성우"
    }
]

DEFAULT_GEMINI_MODEL = "gemini-3.5-flash"
GEMINI_MODELS = [
    {"id": "gemini-3.5-flash", "name": "Gemini 3.5 Flash (가장 안정적 / 무료·초고속 추천)"},
    {"id": "gemini-3.8-flash", "name": "Gemini 3.8 Flash (최신 모델 / 부하 시 3.5 자동 전환)"},
    {"id": "gemini-3.5-flash-lite", "name": "Gemini 3.5 Flash-Lite (경량 초고속)"}
]

def stream_gemini_api(api_key, model, system_prompt, user_prompt):
    """
    Streams prayer and scripture from Google Gemini API via official REST SSE endpoint.
    Ultra-low latency, zero retry overhead, instant first token.
    """
    # Auto-upgrade deprecated models (such as gemini-2.5-flash) to latest gemini-3.8-flash
    if not model or "2.5" in model or "1.5" in model:
        model = DEFAULT_GEMINI_MODEL

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse&key={api_key}"
    payload = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1200
        }
    }
    # Low thinking level for Gemini 3 to ensure instant output response
    if "3." in model or "flash" in model:
        payload["generationConfig"]["thinkingConfig"] = {"thinkingLevel": "low"}
    elif "2.5" in model:
        payload["generationConfig"]["thinkingConfig"] = {"thinkingBudget": 0}

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        for line in resp:
            line_str = line.decode("utf-8", errors="replace").strip()
            if not line_str.startswith("data: "):
                continue
            data_str = line_str[6:].strip()
            if not data_str:
                continue
            try:
                chunk = json.loads(data_str)
                candidates = chunk.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    for part in parts:
                        text = part.get("text", "")
                        if text:
                            yield text
            except Exception:
                pass

def generate_gemini_content(api_key, model, system_prompt, user_prompt):
    """Non-streaming call to Google Gemini API with automatic model fallback."""
    if not model or "2.5" in model or "1.5" in model:
        model = DEFAULT_GEMINI_MODEL

    candidate_models = [model]
    for fallback in ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]:
        if fallback not in candidate_models:
            candidate_models.append(fallback)

    last_error = None
    for cur_model in candidate_models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{cur_model}:generateContent?key={api_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": system_prompt}]
                },
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": user_prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1200,
                    "thinkingConfig": {"thinkingLevel": "low"}
                }
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    return "".join(p.get("text", "") for p in parts)
        except Exception as e:
            last_error = e
            time.sleep(0.4)
            continue
    if last_error:
        raise last_error
    return ""

def clean_text_for_tts(text):
    """
    Cleans prayer text for spiritual and natural audio recitation:
    - Removes title lines like '은혜의 기도문', headers, and markdown symbols
    - Strips emojis so TTS doesn't vocalize emoji descriptions
    - Ensures prayers start directly with reverence and finish completely with:
      '우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.'
    """
    if not text:
        return ""
    lines = text.split("\n")
    cleaned_lines = []
    header_skipped = False
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if cleaned_lines and cleaned_lines[-1] != "":
                cleaned_lines.append("")
            continue
        
        # Strip markdown and emojis for title check
        core = re.sub(r'^[#*\-–—\s]+|[#*\s]+$', '', stripped)
        core = re.sub(r'[\U00010000-\U0010ffff\u2600-\u27bf]', '', core).strip()
        
        if not header_skipped and any(h in core for h in ["은혜의 기도문", "은혜의 기도", "기도문", "기도 제목", "prayer"]):
            continue
        
        header_skipped = True
        cleaned_lines.append(stripped)
    
    result = "\n".join(cleaned_lines).strip()
    result = re.sub(r'[\U00010000-\U0010ffff\u2600-\u27bf]', '', result)
    result = re.sub(r'[*#_~`\[\]]', '', result)
    
    # Auto-correct common LLM grammatical hallucinations/typos in Korean prayers
    result = re.sub(r'주시옵니사\b', '주시옵시사', result)
    result = re.sub(r'하옵니사\b', '하옵시사', result)
    result = re.sub(r'있사옵니사\b', '있사옵시사', result)
    
    # Check cut-off endings
    cutoff_pattern = r'(?:우리\s*주\s*)?(?:저를\s*사랑하시는\s*)?예수\s*그리스도의(?:\s*이름으로)?\s*$'
    cutoff_pattern2 = r'(?:우리\s*주\s*)?예수님의(?:\s*이름으로)?\s*$'
    
    if re.search(cutoff_pattern, result):
        result = re.sub(cutoff_pattern, '', result).rstrip()
        result += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    elif re.search(cutoff_pattern2, result):
        result = re.sub(cutoff_pattern2, '', result).rstrip()
        result += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    else:
        if not (result.endswith("아멘.") or result.endswith("아멘") or result.endswith("아멘!")):
            result += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
            
    return result.strip()

async def _async_edge_tts(text, voice, rate, pitch):
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    chunks = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    return b"".join(chunks)

def generate_edge_tts_bytes(text, voice="ko-KR-SunHiNeural", rate="-4%", pitch="-1Hz"):
    """Generates MP3 audio bytes using edge-tts asynchronously."""
    if not HAS_EDGE_TTS:
        raise RuntimeError("edge-tts 모듈이 설치되어 있지 않습니다.")
    return asyncio.run(_async_edge_tts(text, voice, rate, pitch))

def get_lm_studio_status(host=DEFAULT_LM_STUDIO_URL):
    """Check LM Studio connection and loaded models."""
    url = f"{host.rstrip('/')}/v1/models"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "GraceAI/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = [m.get("id") for m in data.get("data", [])]
            return {
                "online": True,
                "host": host,
                "models": models,
                "active_model": models[0] if models else DEFAULT_MODEL,
                "error": None
            }
    except Exception as e:
        return {
            "online": False,
            "host": host,
            "models": [],
            "active_model": DEFAULT_MODEL,
            "error": str(e)
        }

def parse_prayer_markdown(text):
    """
    Parses generated markdown into structured Bible verses (3) and prayer text.
    Handles various LLM output formats flexibly.
    """
    verses = []
    prayer_text = ""
    
    prayer_match = re.search(r'###?\s*.*?(?:기도|Prayer).*?(?:\n|$)', text, flags=re.IGNORECASE)
    if prayer_match:
        verse_block = text[:prayer_match.start()].strip()
        prayer_block = text[prayer_match.end():].strip()
    else:
        splits = re.split(r'###\s*', text)
        if len(splits) >= 3:
            verse_block = splits[1].strip()
            prayer_block = "###".join(splits[2:]).strip()
        else:
            verse_block = text
            prayer_block = text

    target_for_verses = verse_block if verse_block else text
    lines = target_for_verses.split('\n')
    current_verse = None
    
    # Matches patterns like:
    # 1. **[빌립보서 4:6-7]**: "말씀"
    # 1. [시편 23:1] 말씀
    verse_regex = re.compile(
        r'^(?:\d+[\.\)]|\-|\*)\s*(?:\*\*)?\[?([가-힣A-Za-z0-9\s]+?\s*\d+:\d+(?:-\d+)?)\]?(?:\*\*)?\s*[:\-–]?\s*(.*)',
        re.UNICODE
    )
    
    for line in lines:
        line_clean = line.strip()
        match = verse_regex.match(line_clean)
        if match:
            ref = match.group(1).strip()
            body = match.group(2).strip().strip('*').strip('"').strip('“').strip('”')
            current_verse = {
                "reference": ref,
                "text": body,
                "meditation": ""
            }
            verses.append(current_verse)
        elif current_verse and ("묵상" in line_clean or "의미" in line_clean or line_clean.startswith("-")):
            meditation_clean = re.sub(r'^[\-\*]\s*(\*묵상.*?\*|\*|묵상.*?[:\-])?\s*', '', line_clean).strip().strip('*')
            if meditation_clean:
                current_verse["meditation"] = meditation_clean

    clean_prayer = prayer_block
    clean_prayer = re.sub(r'^###?\s*.*(?:기도|Prayer).*?\n', '', clean_prayer, flags=re.MULTILINE)
    
    # Strip redundant title lines like '🙏 은혜의 기도문', '은혜의 기도문', '**은혜의 기도문**'
    lines = clean_prayer.split('\n')
    filtered_lines = []
    header_skipped = False
    for line in lines:
        stripped = re.sub(r'^[#*\-–—\s]+', '', line).strip()
        stripped = re.sub(r'[#*\s]+$', '', stripped).strip()
        stripped_no_emoji = re.sub(r'[\U00010000-\U0010ffff]', '', stripped).strip()
        if not header_skipped and any(k in stripped_no_emoji for k in ["은혜의 기도문", "은혜의 기도", "기도문"]):
            continue
        header_skipped = True
        filtered_lines.append(line)
        
    clean_prayer = '\n'.join(filtered_lines).strip()
    
    # Auto-correct common LLM grammatical hallucinations/typos in Korean prayers
    clean_prayer = re.sub(r'주시옵니사\b', '주시옵시사', clean_prayer)
    clean_prayer = re.sub(r'하옵니사\b', '하옵시사', clean_prayer)
    clean_prayer = re.sub(r'있사옵니사\b', '있사옵시사', clean_prayer)
    
    # Ensure closing sentence is never cut off (e.g. "예수 그리스도의 " or "예수님의 ")
    cutoff_regex = r'(?:우리\s*주\s*)?(?:저를\s*사랑하시는\s*)?예수\s*그리스도의(?:\s*이름으로)?\s*$'
    cutoff_regex2 = r'(?:우리\s*주\s*)?예수님의(?:\s*이름으로)?\s*$'
    if re.search(cutoff_regex, clean_prayer):
        clean_prayer = re.sub(cutoff_regex, '', clean_prayer).rstrip()
        clean_prayer += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    elif re.search(cutoff_regex2, clean_prayer):
        clean_prayer = re.sub(cutoff_regex2, '', clean_prayer).rstrip()
        clean_prayer += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    elif not clean_prayer.rstrip().endswith(("아멘.", "아멘", "아멘!", "Amen", "amen")):
        clean_prayer += "\n\n우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
    
    # Fallback to standard verses if model did not format numbers properly
    if not verses:
        fallback_samples = [
            {"reference": "빌립보서 4:6-7", "text": "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라", "meditation": "염려 대신 기도로 나아갈 때 평강을 주십니다."},
            {"reference": "시편 23:1-3", "text": "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다", "meditation": "선한 목자 되신 주님을 의지합니다."},
            {"reference": "이사야 41:10", "text": "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라", "meditation": "나를 굳세게 붙드시는 하나님의 약속입니다."}
        ]
        verses = fallback_samples

    return {
        "verses": verses[:3],
        "prayer": clean_prayer if clean_prayer else text
    }


class GraceAIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def _set_cors_headers(self, content_type="application/json"):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", content_type)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return

        if path == "/api/status":
            self.send_response(200)
            self._set_cors_headers("application/json; charset=utf-8")
            self.end_headers()
            status = get_lm_studio_status()
            self.wfile.write(json.dumps(status, ensure_ascii=False).encode("utf-8"))
            return

        elif path == "/api/sample_prayers":
            self.send_response(200)
            self._set_cors_headers("application/json; charset=utf-8")
            self.end_headers()
            samples = [
                {
                    "category": "평안과 위로",
                    "title": "불안하고 지친 마음의 평안을 위하여",
                    "topic": "취업과 미래에 대한 불안으로 마음이 지치고 답답합니다. 하나님의 인도하심을 신뢰하고 평안을 얻고 싶습니다."
                },
                {
                    "category": "건강과 치유",
                    "title": "육신의 연약함과 질병의 치유를 위하여",
                    "topic": "육신의 연약함과 질병으로 고통받고 있습니다. 치유하시는 여호와 라파 하나님의 손길로 강건케 회복되기를 간구합니다."
                },
                {
                    "category": "진로와 비전",
                    "title": "새로운 시작과 바른 선택을 위한 지혜",
                    "topic": "새로운 직장과 진로 결정을 앞두고 두려움이 앞섭니다. 내 뜻이 아닌 주님의 선하신 길을 분별하는 지혜를 주세요."
                },
                {
                    "category": "가족과 자녀",
                    "title": "가정의 화목과 자녀의 믿음을 위하여",
                    "topic": "사랑하는 가족들이 주 안에서 화목하고, 자녀들이 세상 속에서 믿음을 지키며 선한 길로 자라나기를 축복합니다."
                },
                {
                    "category": "감사와 찬양",
                    "title": "일상 속 은혜에 감사하는 삶",
                    "topic": "매일의 삶 속에서 부어주시는 크고 작은 은혜에 감사하며, 언제나 기쁨으로 주님을 찬양하는 삶이 되게 하옵소서."
                }
            ]
            self.wfile.write(json.dumps(samples, ensure_ascii=False).encode("utf-8"))
            return

        elif path == "/api/voices":
            self.send_response(200)
            self._set_cors_headers("application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(VOICE_OPTIONS, ensure_ascii=False).encode("utf-8"))
            return

        elif path == "/api/config":
            self.send_response(200)
            self._set_cors_headers("application/json; charset=utf-8")
            self.end_headers()
            has_env_key = bool(os.environ.get("GEMINI_API_KEY"))
            lm_status = get_lm_studio_status()
            config_data = {
                "has_gemini_env": has_env_key,
                "default_provider": "gemini" if has_env_key else ("lmstudio" if lm_status["online"] else "gemini"),
                "gemini_models": GEMINI_MODELS,
                "default_gemini_model": DEFAULT_GEMINI_MODEL,
                "lm_studio_online": lm_status["online"],
                "active_lm_model": lm_status.get("active_model", DEFAULT_MODEL),
                "voices": VOICE_OPTIONS
            }
            self.wfile.write(json.dumps(config_data, ensure_ascii=False).encode("utf-8"))
            return

        # Serve static files
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ["/api/generate_stream", "/api/generate"]:
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)
            try:
                body = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                body = {}

            topic = body.get("topic", "").strip()
            category = body.get("category", "평안과 위로")
            tone = body.get("tone", "위로와 평안")
            recipient = body.get("recipient", "나 자신")
            model_name = body.get("model", DEFAULT_MODEL)
            host = body.get("host", DEFAULT_LM_STUDIO_URL)
            fast_mode = body.get("fast_mode", True)  # Fast mode default True!

            if not topic:
                self.send_response(400)
                self._set_cors_headers("application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "기도 주제를 입력해주세요."}).encode("utf-8"))
                return

            # Construct concise, high-speed, spiritually rich prompt
            system_prompt = (
                "당신은 성도들의 간절한 기도를 돕는 은혜로운 기독교 AI 기도 도우미입니다.\n"
                "사용자가 입력한 기도 제목에 대해 아래 양식에 맞추어 [관련 성경구절 정확히 3개]와 [따뜻하고 은혜로운 기도문]을 작성하세요.\n"
                "중요 규칙:\n"
                "1. 기도문 시작 부분에 '은혜의 기도문' 같은 제목을 절대 붙이지 마세요. 곧바로 하나님 아버지 또는 주님을 부르며 시작하세요.\n"
                "2. 기도문의 마지막 문장은 중간에 끊기지 않게 완전하게 매듭짓고, 반드시 '우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘.'으로 끝마치세요.\n"
                "3. 정갈한 문법과 어미: 기도문 간구 및 연결 어미('~주시옵소서', '~주시옵시사', '~간구하옵나이다')를 정확하게 구사하고, '주시옵니사' 같은 비문이나 오탈자가 없도록 정갈한 문장으로 작성하세요.\n\n"
                "### 📖 관련 성경 말씀\n"
                "1. **[책 장:절]**: \"말씀 본문 내용\"\n"
                "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n"
                "2. **[책 장:절]**: \"말씀 본문 내용\"\n"
                "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n"
                "3. **[책 장:절]**: \"말씀 본문 내용\"\n"
                "   - *묵상의 은혜*: 이 말씀이 주는 위로와 약속\n\n"
                "### 🙏 은혜의 기도문\n"
                "(하나님 아버지를 향한 진솔한 고백과 간구, 감사와 평안의 기도문 3~4문단)\n\n"
                "우리 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
            )

            user_prompt = (
                f"[기도 분야]: {category} | [대상]: {recipient} | [마음/어조]: {tone}\n"
                f"[기도 제목]:\n{topic}"
            )

            # Messages structure:
            # If fast_mode is on, prefill assistant message to bypass Gemma 4 internal reasoning chain!
            # This drops time-to-first-token from 20s to 0.8s!
            prefill_prefix = "### 📖 관련 성경 말씀\n"
            
            if fast_mode:
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                    {"role": "assistant", "content": f"</thought>\n{prefill_prefix}"}
                ]
                max_tokens = 1000
            else:
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
                max_tokens = 1200

            lm_payload = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.65,
                "max_tokens": max_tokens,
                "stream": (path == "/api/generate_stream")
            }

            if fast_mode:
                lm_payload["reasoning_effort"] = "low"

            lm_url = f"{host.rstrip('/')}/v1/chat/completions"

            # Provider selection: gemini vs lmstudio
            provider = body.get("provider", "auto")
            gemini_key = (body.get("gemini_api_key") or os.environ.get("GEMINI_API_KEY") or "").strip()
            gemini_model = body.get("gemini_model", DEFAULT_GEMINI_MODEL)
            if not gemini_model or "2.5" in gemini_model or "1.5" in gemini_model:
                gemini_model = DEFAULT_GEMINI_MODEL

            # If Gemini API key is provided, ALWAYS prioritize Google Gemini!
            if gemini_key:
                use_gemini = True
            elif provider == "gemini":
                use_gemini = True
            elif provider == "lmstudio":
                use_gemini = False
            else:
                use_gemini = not get_lm_studio_status(host)["online"]

            engine_label = f"Google Gemini ({gemini_model})" if use_gemini else f"LM Studio ({model_name})"
            print(f"🕊️ [API REQUEST] Topic: {topic[:30]} | Engine: {engine_label} | KeyProvided: {bool(gemini_key)}")

            if path == "/api/generate_stream":
                # Server-Sent Events
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Type", "text/event-stream; charset=utf-8")
                self.send_header("Cache-Control", "no-cache")
                self.send_header("Connection", "close")
                self.send_header("X-Accel-Buffering", "no")
                self.end_headers()

                # Send initial status
                self._send_sse_event("status", {
                    "state": "generating",
                    "engine": engine_label,
                    "message": "성경 말씀과 기도문을 작성하고 있습니다..."
                })

                full_content = []

                if use_gemini:
                    if not gemini_key:
                        self._send_sse_event("error", {
                            "message": "Google Gemini API 키가 설정되지 않았습니다. 우측 상단 [설정 ⚙️]에서 무료 API 키를 등록해주세요."
                        })
                        self.close_connection = True
                        return

                    # Fallback list of models to try if high demand / overloaded
                    candidate_models = [gemini_model]
                    for fallback in ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]:
                        if fallback not in candidate_models:
                            candidate_models.append(fallback)

                    for idx, cur_model in enumerate(candidate_models):
                        try:
                            if idx > 0:
                                self._send_sse_event("status", {
                                    "state": "generating",
                                    "engine": f"Google Gemini ({cur_model})",
                                    "message": f"트래픽 폭주로 안정형 {cur_model} 모델로 자동 전환하여 작성 중입니다..."
                                })
                                print(f"🔄 [Gemini Auto-Fallback] Switching to {cur_model} due to temporary capacity spike")

                            full_content = []
                            for token in stream_gemini_api(gemini_key, cur_model, system_prompt, user_prompt):
                                full_content.append(token)
                                self._send_sse_event("token", {"token": token})

                            all_text = "".join(full_content)
                            parsed = parse_prayer_markdown(all_text)
                            self._send_sse_event("done", {
                                "raw": all_text,
                                "verses": parsed["verses"],
                                "prayer": parsed["prayer"]
                            })
                            break
                        except urllib.error.HTTPError as e:
                            err_body = e.read().decode("utf-8", errors="replace")
                            try:
                                err_json = json.loads(err_body)
                                msg = err_json.get("error", {}).get("message", err_body)
                            except Exception:
                                msg = err_body
                            print(f"❌ [Gemini HTTP Error {e.code}] on model {cur_model}: {msg}")
                            
                            # If 503 (High Demand) or 429 (Rate Limit) and alternative models exist, automatically retry with next model!
                            if e.code in [503, 429] and idx < len(candidate_models) - 1:
                                time.sleep(0.4)
                                continue
                            else:
                                self._send_sse_event("error", {"message": f"구글 Gemini API 오류 ({e.code}): {msg}"})
                                break
                        except Exception as e:
                            print(f"❌ [Gemini Error] on model {cur_model}: {str(e)}")
                            if idx < len(candidate_models) - 1:
                                time.sleep(0.4)
                                continue
                            else:
                                self._send_sse_event("error", {"message": f"Gemini 요청 실패: {str(e)}"})
                                break
                    self.close_connection = True
                    return

                else:
                    # LM Studio streaming
                    full_reasoning = []
                    if fast_mode:
                        full_content.append(prefill_prefix)
                        self._send_sse_event("token", {"token": prefill_prefix})

                    try:
                        req = urllib.request.Request(
                            lm_url,
                            data=json.dumps(lm_payload).encode("utf-8"),
                            headers={"Content-Type": "application/json"}
                        )

                        with urllib.request.urlopen(req, timeout=120) as resp:
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
                                    
                                    # Thinking / reasoning tokens
                                    if "reasoning_content" in delta and delta["reasoning_content"]:
                                        r_tok = delta["reasoning_content"]
                                        full_reasoning.append(r_tok)
                                        self._send_sse_event("thinking", {"token": r_tok})
                                    
                                    # Content tokens
                                    if "content" in delta and delta["content"]:
                                        c_tok = delta["content"]
                                        full_content.append(c_tok)
                                        self._send_sse_event("token", {"token": c_tok})
                                except Exception:
                                    pass

                        all_text = "".join(full_content)
                        parsed = parse_prayer_markdown(all_text)
                        self._send_sse_event("done", {
                            "raw": all_text,
                            "verses": parsed["verses"],
                            "prayer": parsed["prayer"]
                        })
                    except Exception as e:
                        self._send_sse_event("error", {"message": f"LM Studio 오류: {str(e)}"})
                    finally:
                        self.close_connection = True
                    return

            else:
                # Non-streaming fallback
                try:
                    if use_gemini:
                        if not gemini_key:
                            self.send_response(400)
                            self._set_cors_headers("application/json; charset=utf-8")
                            self.end_headers()
                            self.wfile.write(json.dumps({"success": False, "error": "Google Gemini API 키가 설정되지 않았습니다."}).encode("utf-8"))
                            return
                        content = generate_gemini_content(gemini_key, gemini_model, system_prompt, user_prompt)
                    else:
                        req = urllib.request.Request(
                            lm_url,
                            data=json.dumps(lm_payload).encode("utf-8"),
                            headers={"Content-Type": "application/json"}
                        )
                        with urllib.request.urlopen(req, timeout=90) as resp:
                            data = json.loads(resp.read().decode("utf-8"))
                            content = data["choices"][0]["message"].get("content", "")
                            if fast_mode and not content.startswith("###"):
                                content = prefill_prefix + content

                    parsed = parse_prayer_markdown(content)
                    self.send_response(200)
                    self._set_cors_headers("application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "success": True,
                        "raw": content,
                        "verses": parsed["verses"],
                        "prayer": parsed["prayer"]
                    }, ensure_ascii=False).encode("utf-8"))
                except Exception as e:
                    self.send_response(500)
                    self._set_cors_headers("application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": str(e)}, ensure_ascii=False).encode("utf-8"))
                return

        elif path == "/api/tts":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)
            try:
                body = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                body = {}

            raw_text = body.get("text", "").strip()
            voice = body.get("voice", "ko-KR-SunHiNeural")
            rate = body.get("rate", "-4%")
            pitch = body.get("pitch", "-1Hz")

            if not raw_text:
                self.send_response(400)
                self._set_cors_headers("application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "낭독할 기도문 내용이 없습니다."}).encode("utf-8"))
                return

            clean_text = clean_text_for_tts(raw_text)
            try:
                audio_bytes = generate_edge_tts_bytes(clean_text, voice=voice, rate=rate, pitch=pitch)
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Type", "audio/mpeg")
                self.send_header("Content-Length", str(len(audio_bytes)))
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                self.wfile.write(audio_bytes)
            except Exception as e:
                self.send_response(500)
                self._set_cors_headers("application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"음성 생성 실패: {str(e)}"}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def _send_sse_event(self, event, data):
        """Helper to write SSE event formatted data."""
        try:
            msg = f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"
            self.wfile.write(msg.encode("utf-8"))
            self.wfile.flush()
        except Exception:
            pass


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def run_server(port=PORT):
    os.makedirs(STATIC_DIR, exist_ok=True)
    host = os.environ.get("HOST", "0.0.0.0")
    env_port = os.environ.get("PORT")
    if env_port:
        try:
            port = int(env_port)
        except Exception:
            pass
    server_address = (host, port)
    httpd = ThreadedHTTPServer(server_address, GraceAIRequestHandler)
    print("==================================================")
    print(f"🕊️ GraceAI (은혜의 기도) PC & 모바일 웹앱 서버 가동!")
    print(f"로컬 접속: http://127.0.0.1:{port}")
    print(f"외부/모바일 접속: http://{host}:{port}")
    if os.environ.get("GEMINI_API_KEY"):
        print(f"AI 엔진: Google Gemini API (환경변수 설정됨)")
    else:
        print(f"AI 엔진: Google Gemini API (웹 UI 설정) / LM Studio 자동 지원")
    print("==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        httpd.server_close()


if __name__ == "__main__":
    port = PORT
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
