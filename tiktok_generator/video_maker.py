"""PIL + bundled FFmpeg で縦型TikTok動画を生成する"""
import os
import re
import subprocess
import sys
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

try:
    import imageio_ffmpeg
    _FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    _FFMPEG = "ffmpeg"

WIDTH, HEIGHT = 540, 960


def _p(msg: str):
    sys.stdout.buffer.write((msg + "\n").encode("utf-8", errors="replace"))
    sys.stdout.buffer.flush()


# ---- テーマ ----
THEMES = {
    "dark":   {"top": (8,5,22),   "bot": (25,8,55),   "hook": (210,130,255), "text": (235,235,255), "accent": (140,70,210)},
    "mystic": {"top": (15,4,35),  "bot": (50,8,85),   "hook": (255,170,255), "text": (245,230,255), "accent": (190,70,235)},
    "pink":   {"top": (48,4,36),  "bot": (95,12,70),  "hook": (255,205,220), "text": (255,235,242), "accent": (250,90,155)},
}

# ---- フォント ----
_FONT_PATHS = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "font.otf"),
    "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "C:/Windows/Fonts/meiryo.ttc",
    "C:/Windows/Fonts/YuGothB.ttc",
    "C:/Windows/Fonts/msgothic.ttc",
]
_font_cache: dict = {}

_EMOJI_RE = re.compile(
    "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF"
    "\U0001F900-\U0001F9FF\U00002600-\U000026FF]+",
    flags=re.UNICODE,
)


def _get_font(size: int) -> ImageFont.FreeTypeFont:
    if size in _font_cache:
        return _font_cache[size]
    for path in _FONT_PATHS:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, size)
                _font_cache[size] = font
                return font
            except Exception:
                continue
    # fc-list fallback
    try:
        result = subprocess.run(
            ["fc-list", ":lang=ja", "--format=%{file}\n"],
            capture_output=True, text=True, timeout=5
        )
        for f in result.stdout.split("\n"):
            f = f.strip()
            if f and os.path.exists(f):
                try:
                    font = ImageFont.truetype(f, size)
                    _font_cache[size] = font
                    return font
                except Exception:
                    pass
    except Exception:
        pass
    font = ImageFont.load_default(size=size)
    _font_cache[size] = font
    return font


# ---- 背景生成 ----
def _gradient_base(top: tuple, bot: tuple) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        t = y / HEIGHT
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        draw.line([(0, y), (WIDTH, y)], fill=c)
    return img


def _add_bokeh(img: Image.Image, accent: tuple, seed: int):
    rng = random.Random(seed)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # 大きなソフトサークル（ボケ効果）
    for _ in range(8):
        cx = rng.randint(-80, WIDTH + 80)
        cy = rng.randint(-80, HEIGHT + 80)
        r = rng.randint(50, 160)
        a = rng.randint(18, 50)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*accent, a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=35))
    base = img.convert("RGBA")
    return Image.alpha_composite(base, overlay).convert("RGB")


def _add_stars(img: Image.Image, seed: int):
    rng = random.Random(seed + 100)
    draw = ImageDraw.Draw(img)
    for _ in range(150):
        x = rng.randint(0, WIDTH)
        y = rng.randint(0, int(HEIGHT * 0.9))
        sz = rng.choice([1, 1, 1, 2, 2])
        br = rng.randint(80, 220)
        draw.ellipse([x - sz, y - sz, x + sz, y + sz], fill=(br, br, br))
    return img


def _photo_bg(img_path: str, accent: tuple) -> Image.Image:
    """ユーザー提供の写真を背景に使用（暗めオーバーレイ付き）"""
    try:
        photo = Image.open(img_path).convert("RGB")
        # クロップしてフィット
        pw, ph = photo.size
        target_r = WIDTH / HEIGHT
        src_r = pw / ph
        if src_r > target_r:
            new_w = int(ph * target_r)
            left = (pw - new_w) // 2
            photo = photo.crop((left, 0, left + new_w, ph))
        else:
            new_h = int(pw / target_r)
            top = (ph - new_h) // 2
            photo = photo.crop((0, top, pw, top + new_h))
        photo = photo.resize((WIDTH, HEIGHT), Image.LANCZOS)
        # 暗め半透明オーバーレイ
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 140))
        result = photo.convert("RGBA")
        result = Image.alpha_composite(result, overlay)
        return result.convert("RGB")
    except Exception as e:
        _p(f"  [IMG] 画像読み込み失敗: {e}")
        return None


def _make_scene_bg(theme: dict, scene_idx: int, img_paths: list) -> Image.Image:
    """シーンごとに異なる背景を生成"""
    if img_paths:
        path = img_paths[scene_idx % len(img_paths)]
        bg = _photo_bg(path, theme["accent"])
        if bg:
            return bg

    # グラデーション + ボケ（シーンごとにシードを変えて変化をつける）
    bg = _gradient_base(theme["top"], theme["bot"])
    bg = _add_bokeh(bg, theme["accent"], seed=scene_idx * 7 + 1)
    bg = _add_stars(bg, seed=scene_idx + 42)
    return bg


# ---- テキスト描画 ----
def _blend(color: tuple, alpha: float, bg: tuple) -> tuple:
    return tuple(int(color[i] * alpha + bg[i] * (1 - alpha)) for i in range(3))


def _draw_text(draw: ImageDraw.Draw, text: str, font,
               center_y: int, color: tuple, alpha: float,
               bg: tuple, slide: int = 0):
    lines = [_EMOJI_RE.sub("", l).strip() for l in text.split("\n") if l.strip()]
    lh = font.size + 12
    total = len(lines) * lh
    sy = center_y - total // 2 + slide
    blended = _blend(color, alpha, bg)
    shadow = _blend((0, 0, 0), alpha * 0.6, bg)
    for i, line in enumerate(lines):
        if not line:
            continue
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        x = (WIDTH - tw) // 2
        y = sy + i * lh
        draw.text((x + 2, y + 2), line, font=font, fill=shadow)
        draw.text((x, y), line, font=font, fill=blended)


# ---- フレーム生成 ----
def _make_frame(scene: str, text: str, alpha: float,
                theme: dict, base_bg: Image.Image) -> Image.Image:
    img = base_bg.copy()
    draw = ImageDraw.Draw(img)
    mid_bg = tuple((theme["top"][i] + theme["bot"][i]) // 2 for i in range(3))
    slide = int(25 * (1 - alpha))

    if scene == "hook":
        font = _get_font(36)
        acc = _blend(theme["accent"], alpha * 0.8, mid_bg)
        draw.line([(50, HEIGHT // 2 - 62), (WIDTH - 50, HEIGHT // 2 - 62)], fill=acc, width=2)
        _draw_text(draw, text, font, HEIGHT // 2, theme["hook"], alpha, mid_bg, slide)
        draw.line([(50, HEIGHT // 2 + 62), (WIDTH - 50, HEIGHT // 2 + 62)], fill=acc, width=2)

    elif scene == "content":
        font = _get_font(28)
        acc = _blend(theme["accent"], alpha, mid_bg)
        cy = HEIGHT // 2 + slide
        draw.polygon([(42, cy - 6), (42 + 8, cy), (42, cy + 6), (42 - 8, cy)], fill=acc)
        _draw_text(draw, text, font, HEIGHT // 2, theme["text"], alpha, mid_bg, slide)

    elif scene == "cta":
        font = _get_font(32)
        _draw_text(draw, text, font, HEIGHT // 2 - 15, theme["hook"], alpha, mid_bg, slide)
        acc = _blend(theme["accent"], alpha, mid_bg)
        ay = HEIGHT // 2 + 55 + slide
        draw.polygon([(WIDTH//2, ay+14), (WIDTH//2-12, ay), (WIDTH//2+12, ay)], fill=acc)

    return img


def _scene_frames(scene: str, text: str, duration: float,
                  theme: dict, base_bg: Image.Image, fps: int):
    n = int(duration * fps)
    fade = int(fps * 0.4)
    for i in range(n):
        if i < fade:
            alpha = i / fade
        elif i > n - fade:
            alpha = (n - i) / fade
        else:
            alpha = 1.0
        yield _make_frame(scene, text, max(0.0, min(1.0, alpha)), theme, base_bg)


# ---- メイン ----
def create_video(content: dict, output_path: str = "output/video.mp4",
                 bgm_path: str = None, theme: str = "mystic",
                 fps: int = 15, img_paths: list = None) -> str:
    cfg = THEMES.get(theme, THEMES["mystic"])

    scenes = [("hook", content["hook"], 4.0)]
    for line in content["script_lines"]:
        scenes.append(("content", line, 3.0))
    scenes.append(("cta", content.get("cta", "プロフィールから\n無料で占えます"), 5.0))
    total_dur = sum(d for _, _, d in scenes)

    _p(f"  [動画] {total_dur:.0f}秒 / {len(scenes)}シーン / {theme}")

    out = Path(output_path).with_suffix(".mp4")
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = str(out.with_stem(out.stem + "_tmp"))

    # フレームをFFmpegにパイプ
    cmd_video = [
        _FFMPEG, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}", "-pix_fmt", "rgb24", "-r", str(fps),
        "-i", "pipe:0",
        "-vcodec", "libx264", "-preset", "fast", "-crf", "22",
        "-pix_fmt", "yuv420p", tmp_path,
    ]
    proc = subprocess.Popen(cmd_video, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for idx, (stype, text, dur) in enumerate(scenes):
        label = _EMOJI_RE.sub("", (text[:14] + "..." if len(text) > 14 else text)).strip()
        _p(f"  [{idx+1}/{len(scenes)}] {stype}: {label}")
        bg = _make_scene_bg(cfg, idx, img_paths or [])
        for frame in _scene_frames(stype, text, dur, cfg, bg, fps):
            proc.stdin.write(np.array(frame).tobytes())

    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError("FFmpegでの動画書き出しに失敗しました")

    # 音声合成（TTS → BGMファイル → サイン波）
    mixed = False
    tts_path = str(out.with_stem(out.stem + "_tts")) + ".mp3"
    voice_key = content.get("voice_key", "nanami")

    # 1) TTS
    try:
        _p("  [TTS] 音声を生成中...")
        from tts_generator import generate as gen_tts
        if gen_tts(content, tts_path, voice_key):
            cmd_tts = [
                _FFMPEG, "-y", "-i", tmp_path, "-i", tts_path,
                "-map", "0:v", "-map", "1:a",
                "-af", "volume=1.3,afade=t=out:st=" + f"{max(1.0, total_dur - 1.5):.1f}:d=1.5",
                "-c:v", "copy", "-c:a", "aac", "-shortest", str(out),
            ]
            r = subprocess.run(cmd_tts, stderr=subprocess.DEVNULL)
            if r.returncode == 0 and Path(str(out)).exists() and Path(str(out)).stat().st_size > 0:
                mixed = True
                _p("  [TTS] 完了")
            Path(tts_path).unlink(missing_ok=True)
    except Exception as e:
        _p(f"  [TTS] スキップ: {e}")

    # 2) BGMファイル
    if not mixed and bgm_path and Path(bgm_path).exists():
        cmd_bgm = [
            _FFMPEG, "-y", "-i", tmp_path, "-stream_loop", "-1", "-i", bgm_path,
            "-map", "0:v", "-map", "1:a",
            "-af", "volume=0.4", "-shortest", "-c:v", "copy", "-c:a", "aac", str(out),
        ]
        r = subprocess.run(cmd_bgm, stderr=subprocess.DEVNULL)
        if r.returncode == 0 and Path(str(out)).exists() and Path(str(out)).stat().st_size > 0:
            mixed = True

    # 3) 無音コピー
    if not mixed:
        subprocess.run([_FFMPEG, "-y", "-i", tmp_path, "-c", "copy", str(out)],
                       check=True, stderr=subprocess.DEVNULL)

    Path(tmp_path).unlink(missing_ok=True)
    return str(out)
