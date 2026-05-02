"""PIL + bundled FFmpeg で縦型TikTok動画を生成する"""
import os
import re
import subprocess
import sys
from pathlib import Path


def _p(msg: str):
    """UTF-8 safe print for Windows consoles"""
    sys.stdout.buffer.write((msg + "\n").encode("utf-8", errors="replace"))
    sys.stdout.buffer.flush()

import numpy as np
from PIL import Image, ImageDraw, ImageFont

try:
    import imageio_ffmpeg
    _FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    _FFMPEG = "ffmpeg"

# Render無料プランのCPU制限に合わせて低解像度で生成（TikTokは540x960でも十分）
WIDTH, HEIGHT = 540, 960

THEMES = {
    "dark": {
        "bg_top":    (10,  10,  26),
        "bg_bottom": (30,  10,  60),
        "hook_color":  (220, 140, 255),
        "text_color":  (240, 240, 255),
        "accent":      (150,  80, 220),
        "stars": True,
    },
    "mystic": {
        "bg_top":    (18,   5,  38),
        "bg_bottom": (55,  10,  90),
        "hook_color":  (255, 180, 255),
        "text_color":  (245, 235, 255),
        "accent":      (200,  80, 240),
        "stars": True,
    },
    "pink": {
        "bg_top":    (50,   5,  38),
        "bg_bottom": (100, 15,  75),
        "hook_color":  (255, 210, 225),
        "text_color":  (255, 240, 245),
        "accent":      (255, 100, 160),
        "stars": False,
    },
}

_FONT_PATHS = [
    # Linux (Render)
    "/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJKjp-Regular.otf",
    # Windows
    "C:/Windows/Fonts/meiryo.ttc",
    "C:/Windows/Fonts/YuGothB.ttc",
    "C:/Windows/Fonts/YuGothM.ttc",
    "C:/Windows/Fonts/msgothic.ttc",
    "C:/Windows/Fonts/msmincho.ttc",
]
_font_cache: dict = {}

_EMOJI_RE = re.compile(
    "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF"
    "\U00002702-\U000027B0\U000024C2-\U0001F251"
    "\U0001F900-\U0001F9FF\U00002600-\U000026FF]+",
    flags=re.UNICODE,
)


def _find_font_path() -> str | None:
    """fc-list でシステムの日本語フォントを動的に検索"""
    try:
        result = subprocess.run(
            ["fc-list", ":lang=ja", "--format=%{file}\n"],
            capture_output=True, text=True, timeout=5
        )
        for f in result.stdout.split("\n"):
            f = f.strip()
            if f and os.path.exists(f):
                return f
    except Exception:
        pass
    return None


def _get_font(size: int) -> ImageFont.FreeTypeFont:
    if size in _font_cache:
        return _font_cache[size]
    # まず静的パスを試す
    for path in _FONT_PATHS:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, size)
                _font_cache[size] = font
                return font
            except Exception:
                continue
    # fc-list でシステムフォントを動的検索（Linux/Render対応）
    dyn = _find_font_path()
    if dyn:
        try:
            font = ImageFont.truetype(dyn, size)
            _font_cache[size] = font
            return font
        except Exception:
            pass
    font = ImageFont.load_default(size=size)
    _font_cache[size] = font
    return font


def _blend(color: tuple, alpha: float, bg: tuple) -> tuple:
    return tuple(int(color[i] * alpha + bg[i] * (1 - alpha)) for i in range(3))


def _mid_bg(theme: dict) -> tuple:
    t, b = theme["bg_top"], theme["bg_bottom"]
    return tuple((t[i] + b[i]) // 2 for i in range(3))


def _gradient_bg(theme: dict) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    top, bot = theme["bg_top"], theme["bg_bottom"]
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(top[0] + (bot[0] - top[0]) * t)
        g = int(top[1] + (bot[1] - top[1]) * t)
        b = int(top[2] + (bot[2] - top[2]) * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
    return img


def _draw_stars(img: Image.Image, seed: int = 7):
    import random
    rng = random.Random(seed)
    draw = ImageDraw.Draw(img)
    for _ in range(180):
        x = rng.randint(0, WIDTH)
        y = rng.randint(0, int(HEIGHT * 0.88))
        size = rng.choice([1, 1, 1, 2, 2, 3])
        br = rng.randint(70, 210)
        draw.ellipse([x - size, y - size, x + size, y + size], fill=(br, br, br))


def _draw_text_block(draw: ImageDraw.Draw, text: str, font,
                     center_y: int, color: tuple, alpha: float,
                     bg_mid: tuple, slide: int = 0):
    lines = [_EMOJI_RE.sub("", l).strip() for l in text.split("\n")]
    lines = [l for l in lines if l]
    line_h = font.size + 14
    total_h = len(lines) * line_h
    start_y = center_y - total_h // 2 + slide

    blended = _blend(color, alpha, bg_mid)
    shadow_c = _blend((0, 0, 0), alpha * 0.55, bg_mid)

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_w = bbox[2] - bbox[0]
        x = (WIDTH - text_w) // 2
        y = start_y + i * line_h
        draw.text((x + 3, y + 3), line, font=font, fill=shadow_c)
        draw.text((x, y), line, font=font, fill=blended)


def _make_frame(scene: str, text: str, alpha: float,
                theme: dict, base_bg: Image.Image) -> Image.Image:
    img = base_bg.copy()
    draw = ImageDraw.Draw(img)
    bg_mid = _mid_bg(theme)
    slide = int(28 * (1 - alpha))

    if scene == "hook":
        font = _get_font(36)
        acc = _blend(theme["accent"], alpha * 0.7, bg_mid)
        y_line = HEIGHT // 2 - 65
        draw.line([(55, y_line), (WIDTH - 55, y_line)], fill=acc, width=2)
        _draw_text_block(draw, text, font, HEIGHT // 2, theme["hook_color"], alpha, bg_mid, slide)
        draw.line([(55, HEIGHT // 2 + 65), (WIDTH - 55, HEIGHT // 2 + 65)], fill=acc, width=2)

    elif scene == "content":
        font = _get_font(26)
        acc = _blend(theme["accent"], alpha, bg_mid)
        cx, cy = 44, HEIGHT // 2 + slide
        draw.polygon([(cx, cy - 6), (cx + 7, cy), (cx, cy + 6), (cx - 7, cy)], fill=acc)
        _draw_text_block(draw, text, font, HEIGHT // 2, theme["text_color"], alpha, bg_mid, slide)

    elif scene == "cta":
        font = _get_font(30)
        _draw_text_block(draw, text, font, HEIGHT // 2 - 15, theme["hook_color"], alpha, bg_mid, slide)
        acc = _blend(theme["accent"], alpha, bg_mid)
        ay = HEIGHT // 2 + 50 + slide
        draw.polygon([(WIDTH // 2, ay + 16), (WIDTH // 2 - 13, ay), (WIDTH // 2 + 13, ay)], fill=acc)

    return img


def _scene_frames(scene: str, text: str, duration: float,
                  theme: dict, base_bg: Image.Image, fps: int):
    n = int(duration * fps)
    fade = int(fps * 0.42)
    for i in range(n):
        if i < fade:
            alpha = i / fade
        elif i > n - fade:
            alpha = (n - i) / fade
        else:
            alpha = 1.0
        yield _make_frame(scene, text, max(0.0, min(1.0, alpha)), theme, base_bg)


def create_video(content: dict, output_path: str = "output/video.mp4",
                 bgm_path: str = None, theme: str = "mystic", fps: int = 30) -> str:
    cfg = THEMES.get(theme, THEMES["mystic"])

    _p("  [BG] 背景を作成中...")
    base_bg = _gradient_bg(cfg)
    if cfg.get("stars"):
        _draw_stars(base_bg)

    scenes = [("hook", content["hook"], 4.0)]
    for line in content["script_lines"]:
        scenes.append(("content", line, 3.0))
    scenes.append(("cta", content.get("cta", "プロフィールから\n無料で占えます"), 5.0))

    total_dur = sum(d for _, _, d in scenes)
    _p(f"  [時間] {total_dur:.0f}秒 / {len(scenes)}シーン")

    out = Path(output_path).with_suffix(".mp4")
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = str(out.with_stem(out.stem + "_tmp"))

    cmd_video = [
        _FFMPEG, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}", "-pix_fmt", "rgb24", "-r", str(fps),
        "-i", "pipe:0",
        "-vcodec", "libx264", "-preset", "fast", "-crf", "22",
        "-pix_fmt", "yuv420p",
        tmp_path,
    ]

    proc = subprocess.Popen(cmd_video, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for idx, (stype, text, dur) in enumerate(scenes):
        label = (text[:16] + "...") if len(text) > 16 else text
        label = _EMOJI_RE.sub("", label).strip()
        _p(f"  [{idx + 1}/{len(scenes)}] {stype}: {label}")
        for frame in _scene_frames(stype, text, dur, cfg, base_bg, fps):
            proc.stdin.write(np.array(frame).tobytes())

    proc.stdin.close()
    ret = proc.wait()
    if ret != 0:
        raise RuntimeError("FFmpegでの動画書き出しに失敗しました")

    # BGMミックス（失敗時は音声なしでフォールバック）
    _p("  [BGM] BGMをミックス中...")
    fade_out_st = max(1.0, total_dur - 2.0)
    mixed = False

    if bgm_path and Path(bgm_path).exists():
        cmd_mix = [
            _FFMPEG, "-y", "-i", tmp_path,
            "-stream_loop", "-1", "-i", bgm_path,
            "-map", "0:v", "-map", "1:a",
            "-af", f"volume=0.45,afade=t=in:st=0:d=1,afade=t=out:st={fade_out_st:.1f}:d=2",
            "-shortest", "-c:v", "copy", "-c:a", "aac", str(out),
        ]
        r = subprocess.run(cmd_mix, stderr=subprocess.DEVNULL)
        if r.returncode == 0 and Path(str(out)).exists() and Path(str(out)).stat().st_size > 0:
            mixed = True

    if not mixed:
        # 音声なしでそのままコピー（最も安全）
        cmd_copy = [_FFMPEG, "-y", "-i", tmp_path, "-c", "copy", str(out)]
        subprocess.run(cmd_copy, check=True, stderr=subprocess.DEVNULL)

    Path(tmp_path).unlink(missing_ok=True)

    return str(out)
