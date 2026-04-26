import React, { useState } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const paypalUrl = 'https://www.paypal.com/ncp/payment/AMEJ4V5C564UN';

  const handleTap = () => {
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

        {/* コピー前の表示 */}
        {!copied && (
          <>
            {/* 手順ガイド */}
            <div style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.4)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>📱 かんたん3ステップで購入</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>1</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>下のボタンをタップ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>2</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Safariを開いてアドレスバーに貼り付け</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>3</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>PayPalで決済完了🎉</span>
                </div>
              </div>
            </div>

            {/* メインボタン */}
            <div onClick={handleTap} style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '20px' }}>
              <img src="/image_7.png" style={{ width: '100%', maxWidth: '360px', borderRadius: '12px' }} alt="button" />
            </div>
          </>
        )}

        {/* コピー後の表示 */}
        {copied && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))', border: '2px solid #22c55e', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
              <p style={{ fontSize: '40px', margin: '0 0 8px' }}>✅</p>
              <p style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>URLをコピーしました！</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                次の手順で購入できます：
              </p>
            </div>

            {/* 次のステップ案内 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>1️⃣</span>
                <div>
                  <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>Safariを開く</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>ホーム画面からSafariアプリをタップ</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>2️⃣</span>
                <div>
                  <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>アドレスバーをタップ</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>「ペースト」をタップしてURLを貼り付け</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>3️⃣</span>
                <div>
                  <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>PayPalで決済</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>PayPalまたはカードでかんたん決済🎉</p>
                </div>
              </div>
            </div>

            {/* もう一度コピーボタン */}
            <button
              onClick={handleTap}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(90deg, #9333ea, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}
            >
              📋 もう一度URLをコピーする
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
