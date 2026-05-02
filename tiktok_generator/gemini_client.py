"""Gemini API: 占いTikTok台本・キャプション・ハッシュタグ生成"""
import json
import os
import re

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

_model = genai.GenerativeModel("gemini-1.5-flash")

_PROMPT = """\
あなたはTikTok占い動画の台本作成専門家です。
ターゲット: 女性/30代 / ブランド: NEXA LoveLAB / URL: https://nexa-lovelab.com

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
"""

_FALLBACK_HASHTAGS = [
    "占い", "恋愛占い", "運命の人", "相性診断", "片思い",
    "復縁", "恋愛運", "TikTok占い", "彼の本音", "恋愛相談",
]


def generate_content(article_text: str) -> dict:
    response = _model.generate_content(_PROMPT.format(article=article_text))
    raw = response.text
    m = re.search(r"\{[\s\S]*\}", raw)
    if not m:
        raise ValueError(f"JSONを解析できませんでした: {raw[:300]}")

    data = json.loads(m.group())

    if "cta" not in data or not data["cta"]:
        data["cta"] = "プロフィールから\n無料で占えます"
    if "hashtags" not in data or len(data["hashtags"]) < 5:
        data["hashtags"] = _FALLBACK_HASHTAGS
    if "script_lines" not in data:
        data["script_lines"] = []
    if "caption" not in data or not data["caption"]:
        data["caption"] = data.get("hook", "") + " #占い #恋愛"
    if "hook" not in data:
        data["hook"] = "あなたの運命、占います"

    return data
