"""記事テキストをAIなしで動画コンテンツに変換する"""
import re

_HASHTAGS = [
    "占い", "恋愛占い", "運命の人", "相性診断", "片思い",
    "復縁", "恋愛運", "TikTok占い", "彼の本音", "恋愛相談",
]


def parse(article: str) -> dict:
    text = re.sub(r"[ \t]+", " ", article.strip())
    sentences = [s.strip() for s in re.split(r"[。！？\n]", text) if s.strip()]

    # フック：最初の文を22文字以内
    hook = (sentences[0][:22]) if sentences else "あなたの運命を占います"

    # スクリプト：残り文を20文字以内に切り出し5行
    script_lines = []
    for sent in sentences[1:]:
        while len(sent) > 20:
            script_lines.append(sent[:20])
            sent = sent[20:]
        if sent:
            script_lines.append(sent)
        if len(script_lines) >= 5:
            break

    # 不足分を最初の文から補完
    if len(script_lines) < 3 and sentences:
        extra = sentences[0]
        while len(extra) > 20 and len(script_lines) < 5:
            script_lines.append(extra[:20])
            extra = extra[20:]

    script_lines = script_lines[:5]

    # キャプション
    caption = text[:100].replace("\n", " ")

    # TTS用フルテキスト（記事全体を使う）
    full_tts = "。".join(sentences)

    return {
        "hook": hook,
        "script_lines": script_lines,
        "cta": "プロフィールから\n無料で占えます",
        "caption": caption,
        "hashtags": _HASHTAGS,
        "full_tts": full_tts,
    }
