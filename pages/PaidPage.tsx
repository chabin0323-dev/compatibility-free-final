'use client';

import React from 'react';

const PaidPage: React.FC = () => {
  return (
    <div style={{
      background: '#0a0608', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Noto Sans JP', sans-serif",
      padding: '48px 20px 64px', color: '#f0ece8'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.5em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '10px' }}>NEXA &nbsp;|&nbsp; AI Fortune</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '54px', fontWeight: 700, color: '#f8f0e8', lineHeight: 1.1, letterSpacing: '.04em' }}>
            Love<span style={{ color: '#c4637a' }}>LAB</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)', marginTop: '10px' }}>運命鑑定 — あなたの本質と愛の行方を読み解く</p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(196,99,122,.3))' }} />
          <span style={{ color: '#c9a96e', fontSize: '13px', letterSpacing: '6px' }}>✦ ✦ ✦</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(196,99,122,.3),transparent)' }} />
        </div>

        {/* Features */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(196,99,122,.18)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
          {[
            ['🔮', '本質鑑定', '生年月日・血液型・星座・干支から本質を分析'],
            ['💫', '縁の深さ', 'なぜ惹かれるのか、二人の魂の接点を解読'],
            ['📅', '運気の波', '今年の流れと、動くべきベストタイミング'],
            ['💌', '成就の鍵', 'この恋を実らせるための具体的なアドバイス'],
            ['♾️', '使い放題', '一度購入すればいつでも何度でも鑑定可能'],
          ].map(([icon, strong, text], i, arr) => (
            <div key={strong as string} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', minWidth: '28px', textAlign: 'center' }}>{icon}</span>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#c9a96e', fontWeight: 500 }}>{strong}</strong>：{text}
              </p>
            </div>
          ))}
        </div>

        {/* Relationship tags */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#c9a96e', letterSpacing: '.1em', marginBottom: '14px', fontFamily: "'Noto Serif JP',serif", fontWeight: 600 }}>✦ こんな関係も鑑定できます ✦</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {['💕 恋人','💘 片思い','💍 夫婦','🤝 友人','💼 仕事仲間','📋 商談相手','👔 上司'].map(tag => (
              <span key={tag} style={{ fontSize: '13px', color: '#f0ece8', background: 'rgba(196,99,122,.12)', border: '1px solid rgba(196,99,122,.4)', borderRadius: '20px', padding: '8px 16px', fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: '32px', background: 'rgba(201,169,110,.06)', border: '1px solid rgba(201,169,110,.2)', borderRadius: '20px', padding: '24px 20px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '.5em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '4px', fontFamily: "'Cormorant Garamond', serif" }}>✦ Special Price ✦</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '72px', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg,#f5e6a3 0%,#c9a96e 35%,#f0d080 65%,#c4637a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '8px 0' }}>
            <span style={{ fontSize: '38px', verticalAlign: 'super' }}>¥</span>780
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', letterSpacing: '.08em' }}>買い切り &nbsp;|&nbsp; 使い放題 &nbsp;|&nbsp; 即日アクセス</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,.2)', letterSpacing: '.05em', marginBottom: '14px' }}>── お支払い方法を選択 ──</p>
        <a href="https://note.com/like_swan6953/membership" target="_blank" rel="noreferrer noopener" style={{ display: 'block', width: '100%', padding: '18px', borderRadius: '9999px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #ec4899, #9333ea)', backgroundSize: '200% auto', animation: 'shimmerBtn 2s linear infinite', fontWeight: 900, color: 'white', boxShadow: '0 0 40px rgba(236,72,153,.7), 0 0 80px rgba(168,85,247,.5)', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.05em', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}>
          noteで申し込む（月額¥980・7日間無料）
        </a>

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)', marginTop: '12px', textAlign: 'center' }}>安心のnote決済対応</p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,.2)', letterSpacing: '.05em' }}>© NEXA | AI Fortune</p>
      </div>
      <style>{`
        @keyframes shimmerBtn { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
      `}</style>
    </div>
  );
};

export default PaidPage;
