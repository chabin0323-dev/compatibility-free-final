"""TikTok占い動画自動生成CLI (NEXA / LoveLAB)"""
import argparse
import sys
from pathlib import Path


def _p(msg: str):
    sys.stdout.buffer.write((msg + "\n").encode("utf-8", errors="replace"))
    sys.stdout.buffer.flush()


def main():
    parser = argparse.ArgumentParser(
        description="🔮 TikTok占い動画自動生成ツール (NEXA / LoveLAB)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  py -3 main.py article.txt
  py -3 main.py article.txt --theme pink --bgm bgm.mp3
  py -3 main.py article.txt -o my_video.mp4 --no-bgm

BGM生成 (初回のみ):
  py -3 generate_bgm.py
        """,
    )
    parser.add_argument("input", help="入力テキストファイル (.txt)")
    parser.add_argument("-o", "--output", default="output/video.mp4", help="出力MP4 (default: output/video.mp4)")
    parser.add_argument("--theme", choices=["dark", "mystic", "pink"], default="mystic", help="動画テーマ")
    parser.add_argument("--bgm", help="BGMファイル (mp3/wav/m4a)")
    parser.add_argument("--no-bgm", action="store_true", help="BGMなし")
    parser.add_argument("--fps", type=int, default=30, help="フレームレート (default: 30)")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"エラー: ファイルが見つかりません → {args.input}")
        sys.exit(1)

    article_text = input_path.read_text(encoding="utf-8").strip()
    if not article_text:
        print("エラー: ファイルが空です")
        sys.exit(1)

    _p(f"\n[START] TikTok動画生成を開始します")
    _p(f"   入力  : {args.input} ({len(article_text)}文字)")
    _p(f"   テーマ: {args.theme}")
    _p(f"   出力  : {args.output}\n")

    from claude_client import generate_content

    _p("[AI] Claude APIでコンテンツを生成中...")
    content = generate_content(article_text)

    _p(f"\n[OK] 生成コンテンツ:")
    _p(f"   フック : {content['hook']}")
    for i, line in enumerate(content["script_lines"], 1):
        _p(f"   [{i}]    : {line}")
    _p(f"   CTA   : {content.get('cta', '-').replace(chr(10), ' ')}")

    bgm_path = None
    if not args.no_bgm:
        if args.bgm:
            bgm_path = args.bgm
        else:
            for candidate in ["bgm.mp3", "output/bgm.mp3", "assets/bgm.mp3"]:
                if Path(candidate).exists():
                    bgm_path = candidate
                    break
            if bgm_path is None:
                _p("\n[INFO] BGMなし (bgm.mp3 が見つかりません。py -3 generate_bgm.py で生成できます)")

    from video_maker import create_video

    _p("\n[VIDEO] 動画を生成中...")
    output_path = create_video(
        content=content,
        output_path=args.output,
        bgm_path=bgm_path,
        theme=args.theme,
        fps=args.fps,
    )

    _p(f"\n[DONE] 完了 → {output_path}")
    _p("\n" + "-" * 52)
    _p("[CAPTION] 投稿キャプション:")
    _p(content["caption"])
    _p("\n[HASHTAG] ハッシュタグ:")
    _p(" ".join(f'#{t.lstrip("#")}' for t in content["hashtags"]))
    _p("-" * 52)


if __name__ == "__main__":
    main()
