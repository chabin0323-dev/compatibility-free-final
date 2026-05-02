"""edge-tts で日本語テキストを音声合成（APIキー不要）"""
import asyncio
from pathlib import Path

# 選択可能な日本語音声
VOICES = {
    "nanami":  ("ja-JP-NanamiNeural",  "七海（女性・自然）"),
    "aoi":     ("ja-JP-AoiNeural",     "葵（女性・明るい）"),
    "shiori":  ("ja-JP-ShioriNeural",  "詩織（女性・優しい）"),
    "mayu":    ("ja-JP-MayuNeural",    "真夕（女性・落ち着き）"),
    "keita":   ("ja-JP-KeitaNeural",   "慶太（男性・自然）"),
    "daichi":  ("ja-JP-DaichiNeural",  "大地（男性・低め）"),
}
DEFAULT_VOICE = "nanami"


async def _speak(text: str, voice_id: str, out_path: str):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice_id)
    await communicate.save(out_path)


def generate(content: dict, out_path: str, voice_key: str = DEFAULT_VOICE) -> bool:
    """動画コンテンツから音声を生成。成功時 True を返す。"""
    voice_id, _ = VOICES.get(voice_key, VOICES[DEFAULT_VOICE])

    # full_tts があれば記事全文、なければ動画テキストを結合
    text = content.get("full_tts", "")
    if not text:
        parts = []
        if content.get("hook"):
            parts.append(content["hook"])
        parts.extend(l for l in content.get("script_lines", []) if l)
        cta = content.get("cta", "プロフィールから無料で占えます").replace("\n", "")
        if cta:
            parts.append(cta)
        text = "。".join(parts)

    if not text:
        return False

    try:
        asyncio.run(_speak(text, voice_id, out_path))
        ok = Path(out_path).exists() and Path(out_path).stat().st_size > 0
        if ok:
            print(f"[TTS] OK: {voice_id} / {Path(out_path).stat().st_size:,} bytes")
        return ok
    except Exception as e:
        print(f"[TTS] 失敗: {e}")
        return False
