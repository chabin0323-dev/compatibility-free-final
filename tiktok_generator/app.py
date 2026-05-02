"""TikTok占い動画生成 Web アプリ (NEXA Tools) - 同期1リクエスト方式"""
import os
import sys
import uuid
from pathlib import Path
from flask import Flask, request, jsonify, send_file, render_template

_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _HERE)

# 起動時フォント確認
_font_path = os.path.join(_HERE, "font.otf")
print(f"[STARTUP] font path: {_font_path}")
print(f"[STARTUP] font exists: {os.path.exists(_font_path)}")
if os.path.exists(_font_path):
    print(f"[STARTUP] font size: {os.path.getsize(_font_path):,} bytes")
else:
    print("[STARTUP] WARNING: font.otf not found!")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

_TMP = Path("/tmp/tiktok")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    article = (data.get("article") or "").strip()
    if not article:
        return jsonify({"error": "記事テキストが必要です"}), 400

    theme = data.get("theme", "mystic")
    if theme not in ("mystic", "dark", "pink"):
        theme = "mystic"

    _TMP.mkdir(parents=True, exist_ok=True)

    from text_parser import parse
    content = parse(article)

    from video_maker import create_video
    job_id = uuid.uuid4().hex[:8]
    out = str(_TMP / f"video_{job_id}.mp4")

    try:
        create_video(content, output_path=out, bgm_path=None, theme=theme, fps=15)
    except Exception as e:
        return jsonify({"error": f"動画生成エラー: {e}"}), 500

    out_path = Path(out)
    if not out_path.exists() or out_path.stat().st_size == 0:
        return jsonify({"error": "動画ファイルの生成に失敗しました"}), 500

    # send_file の代わりに直接バイトを返す
    file_size = out_path.stat().st_size
    print(f"[SEND] Sending video: {file_size:,} bytes")
    with open(out, "rb") as f:
        video_data = f.read()
    from flask import make_response
    resp = make_response(video_data)
    resp.headers["Content-Type"] = "video/mp4"
    resp.headers["Content-Disposition"] = f'attachment; filename="tiktok_{job_id}.mp4"'
    resp.headers["Content-Length"] = str(file_size)
    return resp


if __name__ == "__main__":
    _TMP.mkdir(parents=True, exist_ok=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
