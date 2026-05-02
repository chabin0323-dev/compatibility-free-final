"""日本語TTS音声合成（edge-tts → gTTS フォールバック）"""
import asyncio
from pathlib import Path

VOICES = {
    "nanami":  ("ja-JP-NanamiNeural",  "七海（女性・自然）"),
    "aoi":     ("ja-JP-AoiNeural",     "葵（女性・明るい）"),
    "shiori":  ("ja-JP-ShioriNeural",  "詩織（女性・優しい）"),
    "mayu":    ("ja-JP-MayuNeural",    "真夕（女性・落ち着き）"),
    "keita":   ("ja-JP-KeitaNeural",   "慶太（男性・自然）"),
    "daichi":  ("ja-JP-DaichiNeural",  "大地（男性・低め）"),
}
DEFAULT_VOICE = "nanami"


def _full_text(content: dict) -> str:
    text = content.get("full_tts", "")
    if text:
        return text
    parts = []
    if content.get("hook"):
        parts.append(content["hook"])
    parts.extend(l for l in content.get("script_lines", []) if l)
    cta = content.get("cta", "プロフィールから無料で占えます").replace("\n", "")
    if cta:
        parts.append(cta)
    return "。".join(parts)


async def _edge_speak(text: str, voice_id: str, out_path: str):
    import edge_tts
    comm = edge_tts.Communicate(text, voice_id)
    await comm.save(out_path)


def _try_edge(text: str, voice_id: str, out_path: str) -> bool:
    try:
        asyncio.run(_edge_speak(text, voice_id, out_path))
        ok = Path(out_path).exists() and Path(out_path).stat().st_size > 1000
        if ok:
            print(f"[TTS] edge-tts OK: {Path(out_path).stat().st_size:,} bytes")
        return ok
    except Exception as e:
        print(f"[TTS] edge-tts 失敗: {e}")
        return False


def _try_gtts(text: str, out_path: str) -> bool:
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang="ja", slow=False)
        tts.save(out_path)
        ok = Path(out_path).exists() and Path(out_path).stat().st_size > 1000
        if ok:
            print(f"[TTS] gTTS OK: {Path(out_path).stat().st_size:,} bytes")
        return ok
    except Exception as e:
        print(f"[TTS] gTTS 失敗: {e}")
        return False


def generate(content: dict, out_path: str, voice_key: str = DEFAULT_VOICE) -> bool:
    text = _full_text(content)
    if not text:
        return False

    voice_id, _ = VOICES.get(voice_key, VOICES[DEFAULT_VOICE])

    # edge-tts を試みる
    if _try_edge(text, voice_id, out_path):
        return True

    # gTTS でリトライ
    print("[TTS] gTTS にフォールバック...")
    return _try_gtts(text, out_path)
