"""edge-tts で日本語テキストを音声合成（APIキー不要）"""
import asyncio
from pathlib import Path

VOICE = "ja-JP-NanamiNeural"  # 自然な日本語女声


async def _speak(text: str, out_path: str):
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(out_path)


def generate(content: dict, out_path: str) -> bool:
    """動画コンテンツから音声ファイルを生成。成功時 True を返す"""
    lines = []
    if content.get("hook"):
        lines.append(content["hook"])
    for line in content.get("script_lines", []):
        if line and line.strip():
            lines.append(line.strip())
    cta = content.get("cta", "プロフィールから無料で占えます").replace("\n", "")
    if cta:
        lines.append(cta)

    text = "。".join(lines)
    if not text:
        return False

    try:
        asyncio.run(_speak(text, out_path))
        return Path(out_path).exists() and Path(out_path).stat().st_size > 0
    except Exception as e:
        print(f"[TTS] 生成失敗: {e}")
        return False
