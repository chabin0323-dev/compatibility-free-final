import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FreePage from './pages/FreePage';
import ResultPage from './pages/ResultPage';
import PaidPage from './pages/PaidPage';
import TikTokGuide, { isTikTokBrowser } from './components/TikTokGuide';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => onFinish(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; opacity: number; }[] = [];
    const colors = ['#ffd700', '#ff69b4', '#ffaaff', '#ffffff', '#ff4da6'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 2 + 0.5,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random(),
      });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.font = `${p.size * 3}px serif`;
        ctx.globalAlpha = p.opacity * 0.7;
        ctx.fillText('✦', p.x, p.y);
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #1a0035, #3d0068, #1a0035)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 3 ? 0 : 1,
      transition: 'opacity 0.8s ease',
      zIndex: 9999,
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,255,0.15) 0%, transparent 70%)', animation: 'pulseRing 1.5s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(255,180,255,0.4)', animation: 'pulseRing 1.5s ease-in-out infinite 0.3s' }} />
      <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,220,100,0.5)', animation: 'pulseRing 1.5s ease-in-out infinite 0.6s' }} />
      <div style={{
        position: 'relative', zIndex: 2,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'scale(1)' : 'scale(0.7)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: phase >= 1 ? 'drop-shadow(0 0 20px rgba(255,100,255,0.8))' : 'none',
      }}>
        <img
          src="https://raw.githubusercontent.com/chabin0323-dev/aisou-fortune-host/main/lovelab-logo.png"
          alt="LoveLAB"
          style={{ width: '75vw', maxWidth: '320px', borderRadius: '16px' }}
        />
      </div>
      <div style={{
        position: 'relative', zIndex: 2, marginTop: '24px',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease', textAlign: 'center',
      }}>
        <div style={{
          fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px',
          background: 'linear-gradient(90deg, #ffd700, #ffaaff, #ffd700)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'shimmer 2s linear infinite',
        }}>✦ 運命鑑定 ✦</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,200,255,0.7)', marginTop: '6px', letterSpacing: '2px' }}>
          あなた専用の診断サービス
        </div>
      </div>
      <style>{`
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // /tiktok をリアルブラウザで開いた場合：レンダー前に即リダイレクト
  if (path === '/tiktok') {
    const ua = navigator.userAgent;
    const isReal = /Version\/[\d.]+.*Mobile.*Safari/i.test(ua)
      || /CriOS\/[\d.]+/.test(ua)
      || /Chrome\/[\d.]+ /.test(ua)
      || /Firefox\/[\d.]+/.test(ua);
    if (isReal) {
      window.location.replace('/compatibility-free?skip_splash=1');
      return null;
    }
  }

  const skipSplash = path === '/paid' || path === '/tiktok' || params.get('skip_splash') === '1';
  const [showSplash, setShowSplash] = useState(!skipSplash);
  const [isTikTok] = useState(() => isTikTokBrowser());

  if (isTikTok) return <TikTokGuide />;

  return showSplash ? (
    <SplashScreen onFinish={() => setShowSplash(false)} />
  ) : (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0612]">
        <Routes>
          <Route path="/" element={<Navigate to="/compatibility-free" replace />} />
          <Route path="/tiktok" element={<TikTokGuide />} />
          <Route path="/compatibility-free" element={<FreePage />} />
          <Route path="/result/:sessionId" element={<ResultPage />} />
          <Route path="/paid" element={<PaidPage />} />
          <Route path="*" element={<Navigate to="/compatibility-free" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
