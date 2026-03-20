const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// ② CORSを許可 (ブラウザ差によるエラー防止)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ③ キャッシュを無効化 (履歴アクセスと新規アクセスの差をなくす)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// スタティックファイルの配信 (ビルド成果物が dist ディレクトリにあると仮定)
// 通常のReactアプリへのアクセスはここで処理されます (index.htmlがあればルートもここで処理)
app.use(express.static(path.join(__dirname, 'dist')));

// ① ルートURLハンドラー (静的ファイルがない場合やヘルスチェック用)
app.get("/", (req, res) => {
  // ④ レスポンスのContent-Typeを明示
  // メッセージがテキストなので text/plain を設定
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send("サービスは稼働中です");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
