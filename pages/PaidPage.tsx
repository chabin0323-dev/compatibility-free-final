import React from 'react';

const PaidPage: React.FC = () => {
  const handlePayment = () => {
    window.open('https://www.paypal.com/ncp/payment/AMEJ4V5C564UN', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#0f021b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '420px', width: '100%', border: '1px solid rgba(180,100,255,0.4)', borderRadius: '20px', padding: '32px 24px', backgroundColor: 'rgba(30,10,50,0.9)' }}>
        <img src="/app_concept.png" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }} alt="concept" />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.6', color: '#ffffff', textAlign: 'center' }}>
          二人の未来が具体的に見える！<br />今だけ開かれる特別価格の扉！
        </h2>
        <div onClick={handlePayment} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <img src="/image_7.png" style={{ width: '100%', maxWidth: '360px', borderRadius: '12px' }} alt="button" />
        </div>
        <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#ff4da6', margin: '20px 0', textAlign: 'center' }}>使い放題 780円</p>
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#333', fontSize: '11px', marginBottom: '10px' }}>安心のPayPal決済に対応</p>
          <img src="/cards.png" style={{ width: '100%', maxWidth: '280px' }} alt="cards" />
        </div>
      </div>
    </div>
  );
};

export default PaidPage;
