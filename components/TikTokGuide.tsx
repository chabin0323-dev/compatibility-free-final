import React from 'react';

export function isTikTokBrowser(): boolean {
  return new URLSearchParams(window.location.search).get('from') === 'tiktok';
}

const TikTokGuide: React.FC = () => {
  const goToApp = () => {
    window.location.href = '/compatibility-free';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0608',
      fontFamily: "'Noto Sans JP', sans-serif",
      color: '#f0ece8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>

      <div style={{ fontSize: '56px', marginBottom: '12px' }}>🔮</div>

      <h1 style={{
        fontFamily: 'serif', fontSize: '32px', fontWeight: 700,
        color: '#f8f0e8', marginBottom: '4px',
      }}>
        Love<span style={{ color: '#c4637a' }}>LAB</span>
      </h1>
      <p style={{ color: '#c9a96e', fontSize: '12px', letterSpacing: '.2em', marginBottom: '32px' }}>
        運命鑑定
      </p>

      {/* TikTokから開いた場合の案内 */}
      <div style={{
        background: 'rgba(196,99,122,.1)',
        border: '2px solid #c4637a',
        borderRadius: '24px',
        padding: '24px 20px',
        maxWidth: '320px',
        width: '100%',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24', marginBottom: '16px' }}>
          📱 TikTokから開いた方へ
        </p>
        <div style={{ textAlign: 'left' }}>
          {[
            { n: '1', text: '画面右上の「…」をタップ', color: '#c4637a' },
            { n: '2', text: '「ブラウザで開く」または「Safariで開く」を選択', color: '#c9a96e' },
          ].map(({ n, text, color }) => (
            <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
              <span style={{
                background: color, color: '#fff',
                borderRadius: '50%', width: '24px', height: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 900, flexShrink: 0,
              }}>{n}</span>
              <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safariで開いた後 or 既にブラウザの場合 */}
      <div style={{
        background: 'rgba(201,169,110,.08)',
        border: '1px solid rgba(201,169,110,.3)',
        borderRadius: '20px',
        padding: '16px 20px',
        maxWidth: '320px',
        width: '100%',
        marginBottom: '24px',
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '12px' }}>
          Safariで開いた方・ブラウザで見ている方
        </p>
        <button
          onClick={goToApp}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '60px',
            background: 'linear-gradient(135deg,#c4637a,#c9a96e)',
            border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: '16px', fontWeight: 700,
            boxShadow: '0 0 24px rgba(196,99,122,.4)',
          }}
        >
          ✨ 無料鑑定を始める
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '11px' }}>
        © NEXA | LoveLAB 運命鑑定
      </p>
    </div>
  );
};

export default TikTokGuide;
