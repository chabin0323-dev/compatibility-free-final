"""TikTok占い動画生成 Web アプリ (NEXA Tools)"""
import os
import sys
import uuid
import threading
from pathlib import Path
from flask import Flask, request, jsonify, send_file, render_template

sys.path.insert(0, os.path.dirname(__file__))

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

_jobs: dict = {}
_lock = threading.Lock()


def _update(job_id: str, **kwargs):
    with _lock:
        if job_id in _jobs:
            _jobs[job_id].update(kwargs)


def _process(job_id: str, article: str, theme: str, use_bgm: bool):
    try:
        _update(job_id, progress="Claude APIでコンテンツを生成中...")
        from claude_client import generate_content
        content = generate_content(article)

        _update(job_id, content=content, progress="動画を生成中...")
        from video_maker import create_video
        bgm = "bgm.mp3" if use_bgm and Path("bgm.mp3").exists() else None
        out = f"output/video_{job_id}.mp4"
        Path("output").mkdir(exist_ok=True)
        create_video(content, output_path=out, bgm_path=bgm, theme=theme, fps=24)

        _update(job_id, status="done", video_path=out)
    except Exception as e:
        _update(job_id, status="error", error=str(e))


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

    job_id = uuid.uuid4().hex[:10]
    with _lock:
        _jobs[job_id] = {"status": "processing", "progress": "開始中..."}

    threading.Thread(
        target=_process,
        args=(job_id, article, theme, bool(data.get("bgm", True))),
        daemon=True,
    ).start()
    return jsonify({"job_id": job_id})


@app.route("/api/status/<job_id>")
def status(job_id):
    with _lock:
        job = dict(_jobs.get(job_id, {"status": "not_found"}))
    return jsonify({
        "status": job.get("status"),
        "progress": job.get("progress", ""),
        "content": job.get("content") if job.get("status") == "done" else None,
        "error": job.get("error") if job.get("status") == "error" else None,
    })


@app.route("/api/download/<job_id>")
def download(job_id):
    with _lock:
        job = _jobs.get(job_id, {})
    if job.get("status") != "done":
        return jsonify({"error": "まだ準備できていません"}), 404
    return send_file(
        job["video_path"],
        mimetype="video/mp4",
        as_attachment=True,
        download_name=f"tiktok_{job_id}.mp4",
    )


if __name__ == "__main__":
    Path("output").mkdir(exist_ok=True)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
