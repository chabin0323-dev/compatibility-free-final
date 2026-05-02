"""TikTok占い動画生成 Web アプリ (NEXA Tools) - APIキー不要版"""
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


def _process(job_id: str, content: dict, theme: str):
    try:
        _update(job_id, progress="動画を生成中...")
        from video_maker import create_video
        Path("output").mkdir(exist_ok=True)
        out = f"output/video_{job_id}.mp4"
        create_video(content, output_path=out, bgm_path=None, theme=theme, fps=24)
        _update(job_id, status="done", video_path=out)
    except Exception as e:
        _update(job_id, status="error", error=str(e))


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}

    hook = (data.get("hook") or "").strip()
    if not hook:
        return jsonify({"error": "フック文が必要です"}), 400

    script_lines = [l.strip() for l in (data.get("script_lines") or []) if str(l).strip()]
    if not script_lines:
        return jsonify({"error": "スクリプトを1行以上入力してください"}), 400

    cta = (data.get("cta") or "プロフィールから\n無料で占えます").strip()
    theme = data.get("theme", "mystic")
    if theme not in ("mystic", "dark", "pink"):
        theme = "mystic"

    content = {
        "hook": hook,
        "script_lines": script_lines,
        "cta": cta,
    }

    job_id = uuid.uuid4().hex[:10]
    with _lock:
        _jobs[job_id] = {"status": "processing", "progress": "動画を生成中..."}

    threading.Thread(target=_process, args=(job_id, content, theme), daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/api/status/<job_id>")
def status(job_id):
    with _lock:
        job = dict(_jobs.get(job_id, {"status": "not_found"}))
    return jsonify({
        "status": job.get("status"),
        "progress": job.get("progress", ""),
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
