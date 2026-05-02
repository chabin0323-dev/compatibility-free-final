"""Claude API integration: 占いTikTok台本・キャプション・ハッシュタグ生成"""
import json
import os
import re

import anthropic
from dotenv import load_dotenv

load_dotenv()

_SYSTEM = {
    "type": "text",
    "text": (
        "あなたはTikTok占い動画の台本作成専門家です。\n"
        "ターゲット: 女性/30代\n"
        "ブランド: NEXA / LoveLAB\n"
        "スタイル: 神秘的・共感型・引き込み型\n"
        "URL: https://nexa-lovelab.com\n"
        "CTA: プロフィールから無料で占えます"
    ),
    "cache_control": {"type": "ephemeral"},
}

_PROMPT_TEMPLATE = """\
以下の占い記事からTikTok動画コンテンツを生成してください。

記事:
{article}

JSONのみ出力（説明不要）:
{{
  "hook": "視聴者を3秒で引き込むフック文（15〜25文字。「実は」「知ってた？」「〜な人限定」等で始める）",
  "script_lines": [
    "本文テキスト行1（20文字以内）",
    "本文テキスト行2（20文字以内）",
    "本文テキスト行3（20文字以内）",
    "本文テキスト行4（20文字以内）",
    "本文テキスト行5（20文字以内）"
  ],
  "cta": "プロフィールから\\n無料で占えます",
  "caption": "TikTok投稿キャプション（120文字以内、絵文字あり）",
  "hashtags": ["占い","恋愛占い","運命","相性診断","片思い","恋愛運","TikTok占い","運命の人","復縁","彼の本音"]
}}

フック文の例（参考）:
- 実はこれ、彼があなたを好きなサインです
- 好き避けしてる人だけ見て
- 運命の人に出会う前に必ず起きること
- 連絡が来ない本当の理由
"""

_FALLBACK_HASHTAGS = [
    "占い", "恋愛占い", "運命の人", "相性診断", "片思い",
    "復縁", "恋愛運", "TikTok占い", "彼の本音", "恋愛相談",
]


def generate_content(article_text: str) -> dict:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system=[_SYSTEM],
        messages=[{"role": "user", "content": _PROMPT_TEMPLATE.format(article=article_text)}],
    )

    raw = response.content[0].text
    m = re.search(r"\{[\s\S]*\}", raw)
    if not m:
        raise ValueError(f"JSONを解析できませんでした:\n{raw[:400]}")

    data = json.loads(m.group())

    # Normalize / fallback
    if "cta" not in data or not data["cta"]:
        data["cta"] = "プロフィールから\n無料で占えます"
    if "hashtags" not in data or len(data["hashtags"]) < 5:
        data["hashtags"] = _FALLBACK_HASHTAGS
    if "script_lines" not in data:
        data["script_lines"] = []
    if "caption" not in data or not data["caption"]:
        data["caption"] = data["hook"] + " #占い #恋愛"
    if "hook" not in data:
        data["hook"] = "あなたの運命、占います"

    return data
