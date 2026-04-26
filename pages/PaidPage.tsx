import React, { useState } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const paypalUrl = 'https://www.paypal.com/ncp/payment/AMEJ4V5C564UN';

  const handleDirectPayment = () => {
    window.location.href = paypalUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paypalUrl).then(() => {
      setCopied(true);
      setShowGuide(true);
      setTimeout(() => setCopied(false), 30000);
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

        {/* コピー前 */}
        {!showGuide && (
          <div style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.4)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
              ⚠️ 「ブラウザで開いてください」と<br />表示された方へ
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', marginBottom: '12px', lineHeight: '1.8' }}>
              下のボタンをタップすると<br />決済URLが自動でコピーされます
            </p>
            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(90deg, #9333ea, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'white' }}
            >
              📋 決済URLをコピーする
            </button>
          </div>
        )}

        {/* コピー後の詳細ガイド */}
        {showGuide && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e', borderRadius: '16px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', margin: '0 0 8px' }}>✅</p>
              <p style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>URLをコピーしました！</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' }}>このページを閉じずに下の手順を見ながら進めてください</p>
            </div>

            {/* iPhoneガイド */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                📱 iPhoneの方（Safari）
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>1</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>ホームボタンを押す</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>このTikTokを一度閉じてホーム画面に戻ります</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>2</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>Safariアプリを探してタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>青いコンパスマークのアプリです🧭</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>3</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>画面上のアドレスバーをタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>URLが入力できる細長い欄をタップします</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>4</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>「ペースト」をタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>アドレスバーの上に「ペースト」と出てくるのでタップします</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>5</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>「Go」または「開く」をタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>PayPalの決済ページが開きます🎉</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Androidガイド */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ color: '#f7c948', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
                🤖 Androidの方（Chrome）
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>1</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>戻るボタンでホーム画面に戻る</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>TikTokを閉じてホーム画面に戻ります</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>2</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>Chromeアプリを開く</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>赤・黄・緑・青の丸いアイコンです🌐</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>3</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>アドレスバーをタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>画面上部のURL入力欄をタップします</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>4</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>長押しして「貼り付け」をタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>アドレスバーを長押しすると「貼り付け」が出ます</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>5</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px' }}>Enterをタップ</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>PayPalの決済ページが開きます🎉</p>
                  </div>
                </div>
              </div>
            </div>

            {/* もう一度コピーボタン */}
            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', background: copied ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #9333ea, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}
            >
              {copied ? '✅ コピー済み！' : '📋 もう一度URLをコピーする'}
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
