'use client';

import React, { useState, useEffect, useRef } from 'react';

const PaidPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setShowGuide(true);
      setTimeout(() => setCopied(false), 30000);
    }).catch(() => {
      prompt('このURLをコピーしてください:', url);
    });
  };

  useEffect(() => {
    if (rendered.current) return;
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AfUn22zK4UsNWfThHlT_1sqvEi8gmtXHZ4jWMYafWPrX4bBorPFvMY8ZTuZAqTfVXygpK95YmdkZsj-N&currency=JPY&locale=ja_JP';
    script.async = true;
    script.onload = () => {
      if (rendered.current) return;
      rendered.current = true;
      (window as any).paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 50 },
        createOrder: (_data: any, actions: any) =>
          actions.order.create({
            purchase_units: [{ amount: { value: '780', currency_code: 'JPY' }, description: 'LoveLAB 運命鑑定' }]
          }),
        onApprove: (_data: any, actions: any) =>
          actions.order.capture().then(() => { window.location.href = '/thanks'; }),
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          alert('決済中にエラーが発生しました。しばらくしてから再度お試しください。');
        }
      }).render(paypalRef.current);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ background: '#0a0608', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans JP', sans-serif", padding: '32px 20px', color: '#f0ece8' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.5em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '8px' }}>NEXA | AI Fortune</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 700, color: '#f8f0e8', lineHeight: 1.1 }}>
            Love<span style={{ color: '#c4637a' }}>LAB</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.45)', marginTop: '8px' }}>運命鑑定 — あなたの本質と愛の行方を読み解く</p>
        </div>

        {/* Features */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(196,99,122,.2)', borderRadius: '18px', padding: '20px', marginBottom: '24px' }}>
          {[
            ['🔮', '本質鑑定', '生年月日・血液型・星座・干支から本質を分析'],
            ['💫', '縁の深さ', 'なぜ惹かれるのか、二人の魂の接点を解読'],
            ['📅', '運気の波', '今年の流れと、動くべきベストタイミング'],
            ['💌', '成就の鍵', 'この恋を実らせるための具体的なアドバイス'],
            ['♾️', '使い放題', '一度購入すればいつでも何度でも鑑定可能'],
          ].map(([icon, strong, text]) => (
            <div key={strong} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>{icon}</span>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.82)', lineHeight: 1.7 }}>
                <strong style={{ color: '#c9a96e', fontWeight: 500 }}>{strong}</strong>：{text}
              </p>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.3em', color: 'rgba(255,255,255,.35)', marginBottom: '4px', fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase' }}>Special Price</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '58px', fontWeight: 700, color: '#c4637a', lineHeight: 1 }}>
            <span style={{ fontSize: '32px', verticalAlign: 'super' }}>¥</span>780
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.3)', marginTop: '4px' }}>買い切り | 使い放題 | 即日アクセス</p>
        </div>

        {/* PayPal SDK Button */}
        <div ref={paypalRef} id="paypal-button-container" style={{ marginBottom: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '10px' }}>決済ボタンを読み込み中...</p>
        </div>

        {/* Direct PayPal fallback */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,.25)', marginBottom: '8px' }}>ボタンが表示されない場合はこちら</p>
          <a
            href="https://www.paypal.com/ncp/payment/AMEJ4V5C564UN?country.x=JP&locale.x=ja_JP"
            style={{ display: 'block', padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg,#c4637a,#c9a96e)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '15px', textAlign: 'center', boxShadow: '0 0 30px rgba(196,99,122,.4)' }}
          >
            ✨ 今すぐ運命鑑定を受ける（780円）
          </a>
        </div>

        {/* TikTok guide */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '11px', textAlign: 'center', marginBottom: '12px', letterSpacing: '.05em' }}>決済が完了しない場合はこちら</p>

          {!showGuide && (
            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(90deg,#9333ea,#ec4899)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}
            >
              📋 決済URLをコピーしてブラウザで開く
            </button>
          )}

          {showGuide && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ background: 'rgba(34,197,94,.1)', border: '2px solid #22c55e', borderRadius: '14px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '28px', margin: '0 0 6px' }}>✅</p>
                <p style={{ color: '#22c55e', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>URLをコピーしました！</p>
              </div>

              {[
                { os: '📱 iPhoneの方（Safari）', color: '#f7c948', steps: ['ホーム画面に戻る', 'Safariを開く', 'アドレスバーをタップ', '「ペースト」をタップ', '「Go」をタップ → 決済ページへ'] },
                { os: '🤖 Androidの方（Chrome）', color: '#60a5fa', steps: ['ホーム画面に戻る', 'Chromeを開く', 'アドレスバーをタップ', '長押し→「貼り付け」をタップ', 'Enterをタップ → 決済ページへ'] },
              ].map(({ os, color, steps }) => (
                <div key={os} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '14px', padding: '14px', marginBottom: '10px' }}>
                  <p style={{ color, fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>{os}</p>
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <span style={{ background: color, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#000', flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '12px', margin: 0, lineHeight: 1.6 }}>{step}</p>
                    </div>
                  ))}
                </div>
              ))}

              <button
                onClick={handleCopy}
                style={{ width: '100%', padding: '12px', borderRadius: '50px', background: copied ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#9333ea,#ec4899)', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: 'white' }}
              >
                {copied ? '✅ コピー済み！' : '📋 もう一度URLをコピーする'}
              </button>
            </div>
          )}
        </div>

        {/* Cards */}
        <div style={{ background: 'rgba(255,255,255,.96)', borderRadius: '14px', padding: '14px', textAlign: 'center', marginTop: '16px', boxShadow: '0 4px 20px rgba(0,0,0,.25)' }}>
          <p style={{ color: '#666', fontSize: '10px', marginBottom: '10px', letterSpacing: '.15em', fontWeight: 600 }}>安心のPayPal決済に対応</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {[
              { label: 'VISA', bg: 'linear-gradient(135deg,#1a1f71,#2b3296)', color: '#fff' },
              { label: 'JCB', bg: 'linear-gradient(135deg,#003087,#0070ba)', color: '#fff' },
              { label: 'AMEX', bg: 'linear-gradient(135deg,#2557d6,#1a44c0)', color: '#fff' },
              { label: 'PayPal', bg: 'linear-gradient(135deg,#003087,#009cde)', color: '#fff' },
              { label: '🍎 Pay', bg: '#000', color: '#fff' },
            ].map(({ label, bg, color }) => (
              <span key={label} style={{ background: bg, color, fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '5px', boxShadow: '0 2px 6px rgba(0,0,0,.18)' }}>{label}</span>
            ))}
            <span style={{ background: '#fff', border: '1px solid #ddd', fontSize: '11px', fontWeight: 900, padding: '4px 6px', borderRadius: '5px', boxShadow: '0 2px 6px rgba(0,0,0,.1)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: 16, height: 11, background: 'linear-gradient(to right, #eb001b 50%, #f79e1b 50%)', borderRadius: '2px', display: 'inline-block' }}></span>
              <span style={{ color: '#333' }}>Master</span>
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,.15)', lineHeight: 1.9 }}>
          © NEXA | AI Fortune
        </p>
      </div>
    </div>
  );
};

export default PaidPage;
