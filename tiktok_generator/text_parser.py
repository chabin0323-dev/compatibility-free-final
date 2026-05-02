"""記事テキストをAIなしで動画コンテンツに変換する"""
import re

_HASHTAGS = [
    "占い", "恋愛占い", "運命の人", "相性診断", "片思い",
    "復縁", "恋愛運", "TikTok占い", "彼の本音", "恋愛相談",
]

_HOOK_PREFIXES = ["実は", "知ってた？", "これ知ってる？", "見て", "必見"]


def parse(article: str) -> dict:
    # 改行・空白を正規化
    text = re.sub(r"[ \t]+", " ", article.strip())
    lines = [l.strip() for l in re.split(r"[。！？\n]", text) if l.strip()]

    # フック文：最初の文を20文字以内で
    hook_raw = lines[0] if lines else "あなたの運命を占います"
    hook = hook_raw[:22]

    # スクリプト：残りの文を20文字以内に切り出し5行
    script_lines = []
    for line in lines[1:]:
        # 20文字を超える場合は分割
        while len(line) > 20:
            script_lines.append(line[:20])
            line = line[20:]
        if line:
            script_lines.append(line)
        if len(script_lines) >= 5:
            break

    # 5行未満なら最初の文を分割して補完
    if len(script_lines) < 3 and lines:
        fallback = lines[0]
        while len(fallback) > 20:
            script_lines.append(fallback[:20])
            fallback = fallback[20:]
        if fallback:
            script_lines.append(fallback)

    script_lines = script_lines[:5]

    # キャプション：記事の最初の100文字
    caption = text[:100].replace("\n", " ")

    return {
        "hook": hook,
        "script_lines": script_lines,
        "cta": "プロフィールから\n無料で占えます",
        "caption": caption,
        "hashtags": _HASHTAGS,
    }
