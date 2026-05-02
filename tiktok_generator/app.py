"""TikTok占い動画生成 Web アプリ (NEXA Tools)"""
import os
import sys
import uuid
from pathlib import Path
from flask import Flask, request, jsonify, make_response, render_template

_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _HERE)

_font_path = os.path.join(_HERE, "font.otf")
print(f"[STARTUP] font: {_font_path} / exists: {os.path.exists(_font_path)}")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50MB（画像アップロード対応）

_TMP = Path("/tmp/tiktok")
_UPLOAD = Path("/tmp/tiktok_uploads")

ALLOWED_IMG = {".jpg", ".jpeg", ".png", ".webp"}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    # --- フォームデータ（画像あり）またはJSON ---
    if request.content_type and "multipart/form-data" in request.content_type:
        article = (request.form.get("article") or "").strip()
        theme = request.form.get("theme", "mystic")
        voice_key = request.form.get("voice", "nanami")
        uploaded_files = request.files.getlist("photos")
    else:
        data = request.get_json(silent=True) or {}
        article = (data.get("article") or "").strip()
        theme = data.get("theme", "mystic")
        voice_key = data.get("voice", "nanami")
        uploaded_files = []

    if not article:
        return jsonify({"error": "記事テキストが必要です"}), 400
    if theme not in ("mystic", "dark", "pink"):
        theme = "mystic"

    job_id = uuid.uuid4().hex[:8]
    _TMP.mkdir(parents=True, exist_ok=True)
    _UPLOAD.mkdir(parents=True, exist_ok=True)

    # 画像保存
    img_paths = []
    for f in uploaded_files:
        if f and f.filename:
            ext = Path(f.filename).suffix.lower()
            if ext in ALLOWED_IMG:
                img_path = _UPLOAD / f"{job_id}_{len(img_paths)}{ext}"
                f.save(str(img_path))
                img_paths.append(str(img_path))

    from text_parser import parse
    content = parse(article)
    content["voice_key"] = voice_key

    from video_maker import create_video
    out = str(_TMP / f"video_{job_id}.mp4")
    try:
        create_video(content, output_path=out, bgm_path=None,
                     theme=theme, fps=15, img_paths=img_paths)
    except Exception as e:
        return jsonify({"error": f"動画生成エラー: {e}"}), 500
    finally:
        for p in img_paths:
            Path(p).unlink(missing_ok=True)

    out_path = Path(out)
    if not out_path.exists() or out_path.stat().st_size == 0:
        return jsonify({"error": "動画ファイルの生成に失敗しました"}), 500

    size = out_path.stat().st_size
    print(f"[DONE] job={job_id} size={size:,} bytes")
    return jsonify({"job_id": job_id, "size": size})


@app.route("/api/download/<job_id>")
def download(job_id):
    if not job_id.replace("-", "").isalnum():
        return "invalid", 400
    p = _TMP / f"video_{job_id}.mp4"
    if not p.exists() or p.stat().st_size == 0:
        return "ファイルが見つかりません。再生成してください。", 404
    with open(str(p), "rb") as f:
        data = f.read()
    resp = make_response(data)
    resp.headers["Content-Type"] = "video/mp4"
    resp.headers["Content-Disposition"] = f'attachment; filename="tiktok_{job_id}.mp4"'
    resp.headers["Content-Length"] = str(len(data))
    return resp


@app.route("/api/preview/<job_id>")
def preview(job_id):
    """ブラウザ内プレビュー用（ストリーミング）"""
    if not job_id.replace("-", "").isalnum():
        return "invalid", 400
    p = _TMP / f"video_{job_id}.mp4"
    if not p.exists() or p.stat().st_size == 0:
        return "Not found", 404
    with open(str(p), "rb") as f:
        data = f.read()
    resp = make_response(data)
    resp.headers["Content-Type"] = "video/mp4"
    resp.headers["Accept-Ranges"] = "bytes"
    return resp


if __name__ == "__main__":
    _TMP.mkdir(parents=True, exist_ok=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
