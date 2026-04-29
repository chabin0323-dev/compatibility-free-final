'use client';

import React, { useEffect, useRef } from 'react';

const PaidPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const appleRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AfUn22zK4UsNWfThHlT_1sqvEi8gmtXHZ4jWMYafWPrX4bBorPFvMY8ZTuZAqTfVXygpK95YmdkZsj-N&currency=JPY&locale=ja_JP&enable-funding=applepay&components=buttons';
    script.async = true;
    script.onload = () => {
      if (rendered.current) return;
      rendered.current = true;
      const pp = (window as any).paypal;

      const orderConfig = {
        createOrder: (_: any, actions: any) =>
          actions.order.create({
            purchase_units: [{ amount: { value: '780', currency_code: 'JPY' }, description: 'LoveLAB 運命鑑定' }]
          }),
        onApprove: (_: any, actions: any) =>
          actions.order.capture().then(() => { window.location.href = '/thanks'; }),
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          alert('決済中にエラーが発生しました。しばらくしてから再度お試しください。');
        }
      };

      // ① クレジット/デビットカード
      if (cardRef.current) {
        pp.Buttons({
          ...orderConfig,
          fundingSource: pp.FUNDING.CARD,
          style: { shape: 'pill', height: 52 },
        }).render(cardRef.current).catch(() => {});
      }

      // ② Apple Pay（iOSのみ自動表示）
      if (appleRef.current) {
        pp.Buttons({
          ...orderConfig,
          fundingSource: pp.FUNDING.APPLEPAY,
          style: { shape: 'pill', height: 52 },
        }).render(appleRef.current).catch(() => {});
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{
      background: '#0a0608', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Noto Sans JP', sans-serif",
      padding: '48px 20px 64px', color: '#f0ece8'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.5em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '10px' }}>
            NEXA &nbsp;|&nbsp; AI Fortune
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '54px', fontWeight: 700, color: '#f8f0e8', lineHeight: 1.1, letterSpacing: '.04em' }}>
            Love<span style={{ color: '#c4637a' }}>LAB</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', marginTop: '10px', letterSpacing: '.04em' }}>
            運命鑑定 — あなたの本質と愛の行方を読み解く
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(196,99,122,.3))' }} />
          <span style={{ color: '#c9a96e', fontSize: '13px', letterSpacing: '6px' }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(196,99,122,.3),transparent)' }} />
        </div>

        {/* Features */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(196,99,122,.18)', borderRadius: '20px', padding: '22px 20px', marginBottom: '28px' }}>
          {[
            ['🔮', '本質鑑定', '生年月日・血液型・星座・干支から本質を分析'],
            ['💫', '縁の深さ', 'なぜ惹かれるのか、二人の魂の接点を解読'],
            ['📅', '運気の波', '今年の流れと、動くべきベストタイミング'],
            ['💌', '成就の鍵', 'この恋を実らせるための具体的なアドバイス'],
            ['♾️', '使い放題', '一度購入すればいつでも何度でも鑑定可能'],
          ].map(([icon, strong, text], i, arr) => (
            <div key={strong as string} style={{
              display: 'flex', gap: '12px', padding: '11px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>{icon}</span>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#c9a96e', fontWeight: 500 }}>{strong}</strong>：{text}
              </p>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.35em', color: 'rgba(255,255,255,.45)', marginBottom: '8px', fontFamily: "'Cormorant Garamond', serif", textTransform: 'uppercase' }}>
            Special Price
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '64px', fontWeight: 700, lineHeight: 1,
            background: 'linear-gradient(135deg, #f5e6a3 0%, #c9a96e 40%, #f0d080 70%, #c4637a 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            <span style={{ fontSize: '34px', verticalAlign: 'super' }}>¥</span>780
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)', marginTop: '8px', letterSpacing: '.08em' }}>
            買い切り &nbsp;|&nbsp; 使い放題 &nbsp;|&nbsp; 即日アクセス
          </p>
        </div>

        {/* Payment label */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,.45)', letterSpacing: '.1em', marginBottom: '16px' }}>
          ── お支払い方法を選択 ──
        </p>

        {/* ① クレジット/デビットカード */}
        <div ref={cardRef} id="card-container" style={{ marginBottom: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,.25)', fontSize: '12px', textAlign: 'center', padding: '8px' }}>読み込み中...</p>
        </div>

        {/* ② Apple Pay */}
        <div ref={appleRef} id="apple-container" style={{ marginBottom: '24px' }} />

        {/* Cards */}
        <div style={{
          background: 'rgba(255,255,255,.97)', borderRadius: '16px',
          padding: '16px 20px', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,.3)'
        }}>
          <p style={{ color: '#777', fontSize: '11px', marginBottom: '12px', letterSpacing: '.15em', fontWeight: 600 }}>
            安心のPayPal決済に対応
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { label: 'VISA', bg: 'linear-gradient(135deg,#1a1f71,#2b3296)', color: '#fff' },
              { label: 'JCB', bg: 'linear-gradient(135deg,#003087,#0070ba)', color: '#fff' },
              { label: 'AMEX', bg: 'linear-gradient(135deg,#2557d6,#1a44c0)', color: '#fff' },
              { label: 'PayPal', bg: 'linear-gradient(135deg,#003087,#009cde)', color: '#fff' },
              { label: '🍎 Pay', bg: '#000', color: '#fff' },
            ].map(({ label, bg, color }) => (
              <span key={label} style={{
                background: bg, color, fontSize: '11px', fontWeight: 900,
                padding: '5px 11px', borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,.2)'
              }}>{label}</span>
            ))}
            <span style={{
              background: '#fff', border: '1px solid #e0e0e0', fontSize: '11px', fontWeight: 900,
              padding: '5px 8px', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,.08)',
              display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ width: 18, height: 12, background: 'linear-gradient(to right,#eb001b 50%,#f79e1b 50%)', borderRadius: '2px', display: 'inline-block' }} />
              <span style={{ color: '#333' }}>Master</span>
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: 'rgba(255,255,255,.2)', letterSpacing: '.05em' }}>
          © NEXA | AI Fortune
        </p>
      </div>
    </div>
  );
};

export default PaidPage;
