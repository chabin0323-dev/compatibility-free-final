import React, { useEffect, useState } from 'react';

function isTikTokBrowser(): boolean {
  const ua = navigator.userAgent || '';
  // TikTok UA検知
  if (/musical_ly|ByteLocale|ByteFederation|TikTok|Bytedance|ByteWebView|aweme/i.test(ua)) return true;
  // URLパラメータ検知（lit.linkから?from=tiktokで飛んできた場合）
  if (new URLSearchParams(window.location.search).get('from') === 'tiktok') return true;
  // iOS in-appブラウザ（Safariヘッダーなし）
  if (/iPhone|iPod|iPad/.test(ua) && !/Safari/.test(ua) && /AppleWebKit/.test(ua)) return true;
  // Android WebView
  if (/Android/.test(ua) && /wv/.test(ua)) return true;
  return false;
}

const TikTokGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const url = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg,#0a0608 0%,#1a0828 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Noto Sans JP', sans-serif"
    }}>
      <div style={{ maxWidth: '380px', width: '100%', textAlign: 'center' }}>

        <div style={{ fontSize: '52px', marginBottom: '16px' }}>🔮</div>

        <h1 style={{
          fontFamily: 'serif', fontSize: '28px', fontWeight: 700,
          color: '#f8f0e8', marginBottom: '8px', lineHeight: 1.3
        }}>
          Love<span style={{ color: '#c4637a' }}>LAB</span>
        </h1>
        <p style={{ color: '#c9a96e', fontSize: '12px', letterSpacing: '.2em', marginBottom: '32px' }}>
          運命鑑定
        </p>

        <div style={{
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(196,99,122,.3)',
          borderRadius: '20px', padding: '24px', marginBottom: '24px'
        }}>
          <p style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
            ⚠️ TikTokアプリから開いています
          </p>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '13px', lineHeight: 1.8, marginBottom: '0' }}>
            このまま鑑定できます！<br />
            下のボタンでURLをコピーして<br />
            <strong style={{ color: '#c4637a' }}>SafariまたはChromeで開く</strong><br />
            と快適に鑑定できます✨
          </p>
        </div>

        {/* ステップ */}
        <div style={{
          background: 'rgba(255,255,255,.04)', borderRadius: '16px',
          padding: '20px', marginBottom: '24px', textAlign: 'left'
        }}>
          {[
            { step: '1', text: '下の「URLをコピー」をタップ', color: '#c4637a' },
            { step: '2', text: 'ホーム画面に戻る', color: '#c9a96e' },
            { step: '3', text: 'Safari（iPhone）またはChrome（Android）を開く', color: '#c4637a' },
            { step: '4', text: 'アドレスバーに貼り付けてアクセス', color: '#c9a96e' },
          ].map(({ step, text, color }) => (
            <div key={step} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <span style={{
                background: color, color: '#fff', borderRadius: '50%',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', fontWeight: 900, flexShrink: 0
              }}>{step}</span>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleCopy}
          style={{
            width: '100%', padding: '18px', borderRadius: '60px',
            background: copied
              ? 'linear-gradient(135deg,#22c55e,#16a34a)'
              : 'linear-gradient(135deg,#c4637a,#c9a96e)',
            border: 'none', cursor: 'pointer', color: '#fff',
            fontSize: '16px', fontWeight: 700,
            boxShadow: '0 0 30px rgba(196,99,122,.4)',
            marginBottom: '16px'
          }}
        >
          {copied ? '✅ コピーしました！Safariで開いてね' : '📋 URLをコピーする'}
        </button>

        {copied && (
          <div style={{
            background: 'rgba(34,197,94,.1)', border: '1px solid #22c55e',
            borderRadius: '14px', padding: '14px'
          }}>
            <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              コピー完了！
            </p>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '12px', margin: 0, lineHeight: 1.7 }}>
              SafariやChromeを開いて<br />
              アドレスバーに貼り付けてアクセスしてください
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokGuide;
export { isTikTokBrowser };
