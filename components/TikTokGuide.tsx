import React from 'react';

export function isTikTokBrowser(): boolean {
  return new URLSearchParams(window.location.search).get('from') === 'tiktok';
}

const TikTokGuide: React.FC = () => {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0608',
      fontFamily: "'Noto Sans JP', sans-serif",
      color: '#f0ece8',
      overflow: 'hidden',
    }}>

      {/* 右上を指す矢印アニメーション */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '200px', height: '200px',
        pointerEvents: 'none',
      }}>
        {/* 光るリング */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '60px', height: '60px',
          borderRadius: '50%',
          border: '3px solid #c4637a',
          animation: 'ping 1.2s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'rgba(196,99,122,.3)',
          border: '2px solid #c9a96e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          animation: 'bounce 1s ease-in-out infinite',
        }}>👆</div>
        {/* 矢印ライン */}
        <svg style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px' }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#c9a96e" />
            </marker>
          </defs>
          <path
            d="M 160 180 Q 100 120 55 48"
            stroke="#c9a96e" strokeWidth="2.5" fill="none"
            strokeDasharray="6 4"
            markerEnd="url(#arrow)"
          />
        </svg>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '80px 24px 40px',
        textAlign: 'center',
      }}>

        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔮</div>

        <h1 style={{
          fontFamily: 'serif', fontSize: '32px', fontWeight: 700,
          color: '#f8f0e8', marginBottom: '4px',
        }}>
          Love<span style={{ color: '#c4637a' }}>LAB</span>
        </h1>
        <p style={{ color: '#c9a96e', fontSize: '12px', letterSpacing: '.2em', marginBottom: '40px' }}>
          運命鑑定
        </p>

        {/* メインガイド */}
        <div style={{
          background: 'rgba(196,99,122,.12)',
          border: '2px solid #c4637a',
          borderRadius: '24px',
          padding: '28px 24px',
          maxWidth: '320px',
          width: '100%',
          marginBottom: '32px',
        }}>
          <p style={{
            fontSize: '18px', fontWeight: 900, color: '#fff',
            marginBottom: '20px', lineHeight: 1.5,
          }}>
            右上の<br />
            <span style={{
              background: '#c4637a', color: '#fff',
              padding: '2px 12px', borderRadius: '20px',
              fontSize: '20px',
            }}>ブラウザで開く</span><br />
            をタップ！
          </p>

          {/* ステップ */}
          <div style={{ textAlign: 'left' }}>
            {[
              { n: '1', text: '画面右上の「…」または🔗をタップ', color: '#c4637a' },
              { n: '2', text: '「ブラウザで開く」または「Safariで開く」を選択', color: '#c9a96e' },
              { n: '3', text: 'そのまま無料鑑定スタート🔮', color: '#c4637a' },
            ].map(({ n, text, color }) => (
              <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
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

        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '11px', lineHeight: 1.8 }}>
          © NEXA | LoveLAB 運命鑑定
        </p>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default TikTokGuide;
