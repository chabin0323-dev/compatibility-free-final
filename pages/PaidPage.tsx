
import React, { useState } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const paypalUrl = 'https://www.paypal.com/ncp/payment/AMEJ4V5C564UN';

  const handlePayment = () => {
    window.location.href = paypalUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paypalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div style={{ backgroundColor: '#0f021b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '420px', width: '100%', border: '1px solid rgba(180,100,255,0.4)', borderRadius: '20px', padding: '32px 24px', backgroundColor: 'rgba(30,10,50,0.9)' }}>
        
        <img src="/app_concept.png" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }} alt="concept" />
        
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.6', color: '#ffffff', textAlign: 'center' }}>
          二人の未来が具体的に見える！<br />今だけ開かれる特別価格の扉！
        </h2>

        {/* メイン決済ボタン */}
        <div onClick={handlePayment} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '16px' }}>
          <img src="/image_7.png" style={{ width: '100%', maxWidth: '360px', borderRadius: '12px' }} alt="button" />
        </div>

        <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#ff4da6', margin: '16px 0', textAlign: 'center' }}>使い放題 780円</p>

        {/* ブラウザ警告が出た場合の案内 */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,200,100,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
            ⚠️ 「ブラウザで開いてください」と<br />表示された方へ
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', marginBottom: '16px', lineHeight: '1.8' }}>
            下のボタンをタップすると<br />
            決済URLが自動でコピーされます。<br />
            SafariやChromeに貼り付けて<br />
            そのままご購入いただけます。
          </p>
          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '50px',
              background: copied ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #f7c948, #ff6b35)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              color: '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            {copied ? '✅ コピーしました！Safariに貼り付けてください' : '📋 決済URLをコピーする'}
          </button>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '11px', marginBottom: '10px' }}>安心のPayPal決済に対応</p>
          <img src="/cards.png" style={{ width: '100%', maxWidth: '280px' }} alt="cards" />
        </div>

      </div>
    </div>
  );
};

export default PaidPage;
