"""
TikTok縦型スライドショー動画自動生成スクリプト
仕様: 1080x1920px, 90秒, 7枚スライド, 13秒/枚
"""

import os
import sys
import subprocess
import logging
from datetime import datetime

# ログ設定
os.makedirs("output", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("output/processing_log.txt", encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)

# ライブラリ自動インストール
def ensure_packages():
    pkgs = ["moviepy", "pillow", "numpy"]
    for pkg in pkgs:
        try:
            __import__(pkg if pkg != "pillow" else "PIL")
        except ImportError:
            log.info(f"{pkg} をインストール中...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "--quiet"])

ensure_packages()

import re
import math
import urllib.request
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# moviepy インポート（バージョン差異を吸収）
try:
    from moviepy.editor import (
        ImageClip, AudioFileClip, CompositeVideoClip,
        concatenate_videoclips
    )
    MOVIEPY_V1 = True
except ImportError:
    from moviepy import (
        ImageClip, AudioFileClip, CompositeVideoClip,
        concatenate_videoclips
    )
    MOVIEPY_V1 = False

# ========== 定数 ==========
WIDTH, HEIGHT = 1080, 1920
SLIDE_COUNT = 7
SLIDE_DURATION = 13          # 秒
TOTAL_DURATION = SLIDE_COUNT * SLIDE_DURATION  # 91秒（≒90秒）
FPS = 30
BGM_VOLUME = 0.4
MAX_CAPTION_LEN = 40

FONT_PATHS = [
    r"C:/Windows/Fonts/msgothic.ttc",
    r"C:/Windows/Fonts/YuGothR.ttc",
    r"C:/Windows/Fonts/meiryo.ttc",
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
]

# ========== フォント取得 ==========
def get_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_PATHS:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    # IPAexゴシック自動ダウンロード
    ipa_path = "output/ipaexg.ttf"
    if not os.path.exists(ipa_path):
        log.info("IPAexゴシックをダウンロード中...")
        url = "https://moji.or.jp/wp-content/ipafont/IPAexfont/ipaexg00401.zip"
        try:
            zip_path = "output/ipaexg.zip"
            urllib.request.urlretrieve(url, zip_path)
            import zipfile
            with zipfile.ZipFile(zip_path, "r") as z:
                for name in z.namelist():
                    if name.endswith(".ttf"):
                        with z.open(name) as src, open(ipa_path, "wb") as dst:
                            dst.write(src.read())
                        break
            os.remove(zip_path)
        except Exception as e:
            log.warning(f"フォントダウンロード失敗: {e} → デフォルトフォントを使用")
            return ImageFont.load_default()
    if os.path.exists(ipa_path):
        return ImageFont.truetype(ipa_path, size)
    return ImageFont.load_default()

# ========== キャプション分割 ==========
def split_captions(text: str, n: int = SLIDE_COUNT) -> list[str]:
    # 空白・改行を正規化
    text = re.sub(r"\s+", " ", text.strip())
    if not text:
        return [f"スライド {i+1}" for i in range(n)]

    # 句読点で分割
    sentences = re.split(r"(?<=[。！？\n])", text)
    sentences = [s.strip() for s in sentences if s.strip()]

    # n個のチャンクに均等配分
    total = len(sentences)
    captions = []
    for i in range(n):
        start = math.floor(i * total / n)
        end = math.floor((i + 1) * total / n)
        chunk = "".join(sentences[start:end])
        # 長すぎる場合は切り詰め
        if len(chunk) > MAX_CAPTION_LEN:
            chunk = chunk[:MAX_CAPTION_LEN - 1] + "…"
        captions.append(chunk if chunk else f"スライド {i+1}")

    return captions

# ========== 画像リサイズ・クロップ ==========
def fit_image(img_path: str) -> Image.Image:
    try:
        img = Image.open(img_path).convert("RGB")
    except Exception as e:
        log.warning(f"画像読み込み失敗 {img_path}: {e} → 黒画像で代替")
        return Image.new("RGB", (WIDTH, HEIGHT), (20, 20, 20))

    target_ratio = WIDTH / HEIGHT
    w, h = img.size
    src_ratio = w / h

    if src_ratio > target_ratio:
        # 横長 → 高さ基準でリサイズ後に中央クロップ
        new_h = HEIGHT
        new_w = int(w * HEIGHT / h)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        left = (new_w - WIDTH) // 2
        img = img.crop((left, 0, left + WIDTH, HEIGHT))
    else:
        # 縦長・正方形 → 幅基準でリサイズ後に中央クロップ
        new_w = WIDTH
        new_h = int(h * WIDTH / w)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        top = (new_h - HEIGHT) // 2
        img = img.crop((0, top, WIDTH, top + HEIGHT))

    return img.resize((WIDTH, HEIGHT), Image.LANCZOS)

# ========== キャプション描画 ==========
def draw_caption(img: Image.Image, caption: str) -> Image.Image:
    if not caption:
        return img

    draw = ImageDraw.Draw(img, "RGBA")
    font_size = 52
    font = get_font(font_size)

    # テキスト折り返し（1行 MAX_CAPTION_LEN 文字）
    line_len = 18
    lines = []
    remaining = caption
    while remaining:
        lines.append(remaining[:line_len])
        remaining = remaining[line_len:]

    line_h = font_size + 12
    total_text_h = line_h * len(lines)
    padding = 24
    box_h = total_text_h + padding * 2
    box_top = HEIGHT - box_h - 80  # 下部80px余白

    # 半透明黒背景
    draw.rectangle(
        [(0, box_top), (WIDTH, box_top + box_h)],
        fill=(0, 0, 0, 160),
    )

    # テキスト（縁取り → 白文字）
    y = box_top + padding
    for line in lines:
        # テキスト幅を計算して中央揃え
        try:
            bbox = font.getbbox(line)
            text_w = bbox[2] - bbox[0]
        except AttributeError:
            text_w = len(line) * font_size * 0.6
        x = (WIDTH - text_w) // 2

        # 黒縁取り（8方向）
        for dx, dy in [(-2,-2),(0,-2),(2,-2),(-2,0),(2,0),(-2,2),(0,2),(2,2)]:
            draw.text((x + dx, y + dy), line, font=font, fill=(0, 0, 0, 255))
        # 白文字
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += line_h

    return img

# ========== スライド画像生成 ==========
def make_slide_frame(img_path: str, caption: str) -> np.ndarray:
    img = fit_image(img_path)
    img = draw_caption(img, caption)
    return np.array(img)

# ========== メイン処理 ==========
def main():
    log.info("=" * 50)
    log.info("TikTok動画生成 開始")
    log.info(f"開始時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # ディレクトリ準備
    os.makedirs("inputs/images", exist_ok=True)
    os.makedirs("output", exist_ok=True)

    # 記事テキスト読み込み
    article_path = "inputs/article.txt"
    if os.path.exists(article_path):
        with open(article_path, encoding="utf-8") as f:
            article_text = f.read()
        log.info(f"記事読み込み完了: {len(article_text)}文字")
    else:
        log.warning("inputs/article.txt が見つかりません → ダミーキャプションを使用")
        article_text = ""

    captions = split_captions(article_text, SLIDE_COUNT)

    # キャプション一覧保存
    with open("output/captions.txt", "w", encoding="utf-8") as f:
        for i, cap in enumerate(captions, 1):
            f.write(f"スライド{i}: {cap}\n")
    log.info("キャプション分割完了:")
    for i, cap in enumerate(captions, 1):
        log.info(f"  [{i}] {cap}")

    # 画像ファイル収集
    img_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    img_files = sorted(
        [str(p) for p in Path("inputs/images").iterdir()
         if p.suffix.lower() in img_exts]
    )
    log.info(f"画像ファイル数: {len(img_files)}")

    if not img_files:
        log.warning("画像が見つかりません → グラデーション背景で代替")
        # グラデーション画像を生成
        colors = [
            (30, 60, 120), (80, 20, 100), (120, 40, 20),
            (20, 100, 80), (100, 80, 20), (60, 20, 100), (20, 80, 120),
        ]
        for i, color in enumerate(colors):
            grad = Image.new("RGB", (WIDTH, HEIGHT))
            draw = ImageDraw.Draw(grad)
            for y in range(HEIGHT):
                r = int(color[0] * (1 - y/HEIGHT) + 10 * (y/HEIGHT))
                g = int(color[1] * (1 - y/HEIGHT) + 10 * (y/HEIGHT))
                b = int(color[2] * (1 - y/HEIGHT) + 10 * (y/HEIGHT))
                draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
            path = f"inputs/images/gradient_{i+1:02d}.png"
            grad.save(path)
            img_files.append(path)
        log.info(f"グラデーション画像 {len(img_files)} 枚を生成しました")

    # 画像が7枚未満の場合はループで補完
    while len(img_files) < SLIDE_COUNT:
        img_files.extend(img_files)
    img_files = img_files[:SLIDE_COUNT]

    # スライドクリップ生成
    clips = []
    for i in range(SLIDE_COUNT):
        log.info(f"スライド {i+1}/{SLIDE_COUNT} 生成中: {os.path.basename(img_files[i])}")
        try:
            frame = make_slide_frame(img_files[i], captions[i])
            clip = ImageClip(frame, duration=SLIDE_DURATION)
            clip = clip.with_fps(FPS)
            clips.append(clip)
        except Exception as e:
            log.error(f"スライド {i+1} 生成エラー: {e} → スキップして黒画面で代替")
            black = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
            clips.append(ImageClip(black, duration=SLIDE_DURATION).with_fps(FPS))

    # 動画結合
    log.info("スライドを結合中...")
    video = concatenate_videoclips(clips, method="compose")

    # BGM合成
    bgm_path = "inputs/bgm.mp3"
    if os.path.exists(bgm_path):
        log.info("BGMを合成中...")
        try:
            audio = AudioFileClip(bgm_path)
            # ループして動画尺に合わせる
            if audio.duration < video.duration:
                loops = math.ceil(video.duration / audio.duration)
                from moviepy.audio.AudioClip import concatenate_audioclips
                audio = concatenate_audioclips([audio] * loops)
            audio = audio.subclip(0, video.duration).volumex(BGM_VOLUME)
            video = video.set_audio(audio)
            log.info("BGM合成完了")
        except Exception as e:
            log.warning(f"BGM合成エラー: {e} → 無音で続行")
    else:
        log.info("BGMファイルなし → 無音で処理")

    # 書き出し
    output_path = "output/output_video.mp4"
    log.info(f"動画書き出し中: {output_path}")
    log.info(f"予想尺: {video.duration:.1f}秒 ({SLIDE_COUNT}枚 × {SLIDE_DURATION}秒)")

    video.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        bitrate="4000k",
        preset="medium",
        threads=4,
        logger=None,
    )

    log.info("=" * 50)
    log.info(f"完了! → {output_path}")
    log.info(f"終了時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\n✅ 動画生成完了: {os.path.abspath(output_path)}")
    print(f"   尺: {video.duration:.1f}秒 | 解像度: {WIDTH}x{HEIGHT} | {FPS}fps")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log.critical(f"致命的エラー: {e}", exc_info=True)
        sys.exit(1)
