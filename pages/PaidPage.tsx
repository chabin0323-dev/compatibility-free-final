import React, { useState } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const paypalUrl = 'https://www.paypal.com/ncp/payment/AMEJ4V5C564UN';

  const handleDirectPayment = () => {
    window.location.href = paypalUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paypalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 10000);
    }).catch(() => {
      window.location.href = paypalUrl;
    });
  };

  return (
    <div style={{ backgroundColor: '#0f021b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '420px', width: '100%', border: '1px solid rgba(180,100,255,0.4)', borderRadius: '20px', padding: '32px 24px', backgroundColor: 'rgba(30,10,50,0.9)' }}>

        <img src="/app_concept.png" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }} alt="concept" />

        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.6', color: '#ffffff', textAlign: 'center' }}>
          二人の未来が具体的に見える！<br />今だけ開かれる特別価格の扉！
        </h2>

        <p style={{ fontWeight: 'bold', fontSize: '28px', color: '#ff4da6', margin: '16px 0', textAlign: 'center' }}>使い放題 780円</p>

        {/* メイン決済ボタン */}
        <div onClick={handleDirectPayment} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '16px' }}>
          <img src="/image_7.png" style={{ width: '100%', maxWidth: '360px', borderRadius: '12px' }} alt="button" />
        </div>

        {/* 区切り */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>うまく開けない方はこちら</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* コピーボタン */}
        {!copied ? (
          <div style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.4)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', marginBottom: '12px', lineHeight: '1.8' }}>
              「ブラウザで開いてください」と表示された方は<br />下のボタンでURLをコピーして<br />Safariのアドレスバーにタップで貼り付けてください
            </p>
            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(90deg, #9333ea, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'white' }}
            >
              📋 決済URLをコピーする
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', margin: '0 0 8px' }}>✅</p>
            <p style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px' }}>コピーしました！</p>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>1️⃣</span>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>Safariを開く</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>2️⃣</span>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>アドレスバーをタップ →「ペースト」をタップ</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>3️⃣</span>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>PayPalで決済完了🎉</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '13px', color: 'white' }}
            >
              📋 もう一度コピーする
            </button>
          </div>
        )}

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '11px', marginBottom: '10px' }}>安心のPayPal決済に対応</p>
          <img src="/cards.png" style={{ width: '100%', maxWidth: '280px' }} alt="cards" />
        </div>

      </div>
    </div>
  );
};

export default PaidPage;
