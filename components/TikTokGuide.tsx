import React from 'react';

function isRealBrowser(): boolean {
  const ua = navigator.userAgent;
  if (/Version\/[\d.]+.*Mobile.*Safari/i.test(ua)) return true; // 本物のiOS Safari
  if (/CriOS\/[\d.]+/i.test(ua)) return true;  // Chrome on iOS
  if (/FxiOS\/[\d.]+/i.test(ua)) return true;  // Firefox on iOS
  if (/Chrome\/[\d.]+ /.test(ua) && !/Chromium/.test(ua) && !/Android.*wv/.test(ua)) return true; // Desktop/Android Chrome
  if (/Firefox\/[\d.]+/.test(ua)) return true;
  return false;
}

export function isTikTokBrowser(): boolean {
  return new URLSearchParams(window.location.search).get('from') === 'tiktok';
}

const TikTokGuide: React.FC = () => {
  const goToApp = () => { window.location.href = '/compatibility-free'; };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0608',
      fontFamily: "'Noto Sans JP', sans-serif",
      color: '#f0ece8',
      overflow: 'hidden',
    }}>

      {/* 右上アニメ指 */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '90px', height: '90px', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          width: '52px', height: '52px', borderRadius: '50%',
          border: '2.5px solid #c4637a',
          animation: 'ping 1.3s ease-out infinite',
          opacity: 0,
        }} />
        <div style={{
          position: 'absolute', top: '22px', right: '22px',
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(196,99,122,.25)',
          border: '1.5px solid #c9a96e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          animation: 'bounce 1s ease-in-out infinite',
        }}>👆</div>
      </div>

      {/* メイン */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '60px 28px 40px',
        textAlign: 'center',
      }}>

        <div style={{ fontSize: '60px', marginBottom: '16px', filter: 'drop-shadow(0 0 12px rgba(196,99,122,.5))' }}>🔮</div>

        <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 700, color: '#f8f0e8', marginBottom: '4px', letterSpacing: '.04em' }}>
          Love<span style={{ color: '#c4637a' }}>LAB</span>
        </h1>
        <p style={{ color: '#c9a96e', fontSize: '11px', letterSpacing: '.3em', marginBottom: '48px', textTransform: 'uppercase' }}>
          運命鑑定
        </p>

        {/* ガイドカード */}
        <div style={{
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(196,99,122,.35)',
          borderRadius: '28px',
          padding: '32px 24px',
          maxWidth: '300px',
          width: '100%',
          marginBottom: '48px',
        }}>
          <p style={{ fontSize: '13px', color: '#c9a96e', letterSpacing: '.1em', marginBottom: '20px' }}>
            ✦ TikTokから開いた方へ ✦
          </p>

          {[
            { n: '1', text: '右上の「…」をタップ', color: '#c4637a' },
            { n: '2', text: '「ブラウザで開く」または\n「Safariで開く」を選択', color: '#c9a96e' },
            { n: '3', text: '即・無料鑑定スタート🔮', color: '#c4637a' },
          ].map(({ n, text, color }) => (
            <div key={n} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start', textAlign: 'left' }}>
              <span style={{
                background: color, color: '#fff',
                borderRadius: '50%', width: '26px', height: '26px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 900, flexShrink: 0, marginTop: '1px',
              }}>{n}</span>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '14px', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{
          width: '48px', height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(196,99,122,.4),transparent)',
          marginBottom: '24px',
        }} />

        {/* Safariで開いた後用ボタン */}
        <button
          onClick={goToApp}
          style={{
            width: '100%', maxWidth: '300px', padding: '16px',
            borderRadius: '60px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#c4637a,#c9a96e)',
            color: '#fff', fontSize: '15px', fontWeight: 700,
            boxShadow: '0 0 24px rgba(196,99,122,.4)',
            marginBottom: '20px',
          }}
        >
          ✨ Safariで開いたらここをタップ
        </button>

        <p style={{ color: 'rgba(255,255,255,.18)', fontSize: '11px', letterSpacing: '.05em' }}>
          © NEXA | LoveLAB 運命鑑定
        </p>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: .8; }
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
};

export default TikTokGuide;
