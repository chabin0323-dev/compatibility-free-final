"""神秘的なアンビエントBGMをFFmpegで生成するユーティリティ"""
import argparse
import subprocess
from pathlib import Path

try:
    import imageio_ffmpeg
    _FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    _FFMPEG = "ffmpeg"


def generate_bgm(output: str = "bgm.mp3", duration: int = 90):
    """Aマイナー和音ベースの神秘的アンビエントBGMを生成"""
    # A=220Hz, C=261Hz, E=329Hz + 低音ドローン (110Hz) + 高倍音
    expr = (
        "0.28*sin(220*2*PI*t)"
        "+0.20*sin(261*2*PI*t)"
        "+0.14*sin(329*2*PI*t)"
        "+0.10*sin(110*2*PI*t)"
        "+0.06*sin(440*2*PI*t)"
        "+0.04*sin(130*2*PI*t)"
    )
    cmd = [
        _FFMPEG, "-y",
        "-f", "lavfi",
        "-i", f"aevalsrc={expr}:s=44100",
        "-af", (
            f"aecho=0.8:0.88:60:0.5,"
            f"aecho=0.6:0.90:120:0.3,"
            f"volume=0.38,"
            f"afade=t=in:st=0:d=3,"
            f"afade=t=out:st={duration - 3}:d=3"
        ),
        "-t", str(duration),
        "-acodec", "libmp3lame", "-q:a", "4",
        output,
    ]
    subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
    print(f"✅ BGM生成完了 → {output} ({duration}秒)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="神秘的アンビエントBGMを生成")
    parser.add_argument("-o", "--output", default="bgm.mp3", help="出力ファイル (default: bgm.mp3)")
    parser.add_argument("-d", "--duration", type=int, default=90, help="秒数 (default: 90)")
    args = parser.parse_args()
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    generate_bgm(args.output, args.duration)
