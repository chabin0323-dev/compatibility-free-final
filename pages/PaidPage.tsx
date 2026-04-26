import React, { useState } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const paypalUrl = 'https://www.paypal.com/ncp/payment/AMEJ4V5C564UN';

  const handleTap = () => {
    navigator.clipboard.writeText(paypalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }).catch(() => {
      window.location.href = paypalUrl;
    });
  };

  return (
    <div style={{ backgroundColor: '#0f021b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '420px', width: '100%', border: '1px solid rgba(180,100,255,0.4)', borderRadius: '20px', padding: '32px 24px', backgroundColor: 'rgba(30,10,50,0.9)' }}>

        <img src="/app_concept.png" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }} alt="concept" />

        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.6', color: '#ffffff', textAlign: 'center' }}>
          二人の未来が具体的に見える！<br />今だけ開かれる特別価格の扉！
        </h2>

        {/* 手順ガイド */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ color: '#f7c948', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>🛒 ご購入の手順</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#9333ea', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>1</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>下のボタンをタップ（URLが自動コピー）</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#9333ea', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>2</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Safariを開いてアドレスバーに貼り付け</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#9333ea', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>3</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>PayPalでご購入完了🎉</span>
            </div>
          </div>
        </div>

        {/* メインボタン */}
        <div onClick={handleTap} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '16px', position: 'relative' }}>
          <img src="/image_7.png" style={{ width: '100%', maxWidth: '360px', borderRadius: '12px', opacity: copied ? 0.7 : 1, transition: 'opacity 0.3s' }} alt="button" />
          {copied && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.85)', borderRadius: '12px', padding: '12px 20px', whiteSpace: 'nowrap' }}>
              <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>✅ コピー完了！</p>
              <p style={{ color: 'white', fontSize: '11px', margin: '4px 0 0' }}>Safariを開いて貼り付けてください</p>
            </div>
          )}
        </div>

        <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#ff4da6', margin: '16px 0', textAlign: 'center' }}>使い放題 780円</p>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '11px', marginBottom: '10px' }}>安心のPayPal決済に対応</p>
          <img src="/cards.png" style={{ width: '100%', maxWidth: '280px' }} alt="cards" />
        </div>

      </div>
    </div>
  );
};

export default PaidPage;
