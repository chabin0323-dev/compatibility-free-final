import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildFortuneBundle, type ActiveTabKey } from '../services/fortuneEngine';

const PAID_URL = 'https://note.com/like_swan6953';

type RevealStep =
  | 'intro'
  | 'score'
  | 'emotion'
  | 'destiny'
  | 'detail'
  | 'biorhythm'
  | 'final';

const STEP_ORDER: RevealStep[] = [
  'intro',
  'score',
  'emotion',
  'destiny',
  'detail',
  'biorhythm',
  'final',
];

const STEP_LABELS: Record<Exclude<RevealStep, 'intro'>, string> = {
  score: '点数',
  emotion: '本音',
  destiny: '運命',
  detail: '分析',
  biorhythm: '流れ',
  final: '結論',
};

const LOCKED_STEPS: RevealStep[] = ['emotion', 'destiny', 'detail', 'biorhythm', 'final'];

function truncateText(text: string, max = 90) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function getPreviewText(
  step: RevealStep,
  fortune: ReturnType<typeof buildFortuneBundle>
) {
  switch (step) {
    case 'emotion':
      return truncateText(`今、${fortune.partnerName}さんの心には、あなたを無視できない感情の揺れが出ています。${fortune.tabs.blood.content}`, 96);
    case 'destiny':
      return truncateText(`このご縁は偶然より深い意味を持っています。${fortune.destinyAnalysis.content}`, 96);
    case 'detail':
      return truncateText(`${fortune.tabs.name.title}。${fortune.tabs.name.content}`, 96);
    case 'biorhythm':
      return truncateText(`今週は動いて良い日と慎重にしたい日の差が出やすい流れです。${fortune.biorhythmData[0]?.note ?? ''}`, 96);
    case 'final':
      return truncateText(`${fortune.actionGuide} この恋をどう動かすべきかの最終判断がここにあります。`, 96);
    default:
      return '';
  }
}

const LockedPanel: React.FC<{
  title: string;
  subtitle: string;
  preview: string;
  buttonLabel: string;
  onOpenPaid: () => void;
}> = ({ title, subtitle, preview, onOpenPaid }) => {
  return (
    <div className="bg-[#1a0e2d]/80 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] tracking-[0.35em] text-pink-300 mb-3 uppercase">locked reading</p>
      <h3 className="text-2xl font-black mb-4 leading-tight">{title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed mb-5">{subtitle}</p>
      <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 overflow-hidden mb-6">
        <div className="blur-[4px] select-none pointer-events-none">
          <p className="text-sm text-gray-200 leading-relaxed">{preview}</p>
          <p className="text-sm text-gray-200 leading-relaxed mt-3">この先では、相手の本音・二人の未来・動くべき時期・最終結論まで深く読み解かれます。</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12091f]/35 to-[#12091f]/82" />
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <div className="px-4 py-2 rounded-full bg-black/45 border border-white/15 text-xs font-black text-purple-100 backdrop-blur-md">🔒 ここから先は有料版で公開</div>
        </div>
      </div>
      <button
        onClick={onOpenPaid}
        style={{ width: '100%', padding: '16px', borderRadius: '9999px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #ec4899, #9333ea)', backgroundSize: '200% auto', animation: 'shimmerBtn 2s linear infinite', fontWeight: 900, color: 'white', boxShadow: '0 0 30px rgba(236,72,153,0.6), 0 0 60px rgba(168,85,247,0.4)', border: 'none', cursor: 'pointer', fontSize: '15px', letterSpacing: '0.05em' }}
      >
        完全鑑定を読む
      </button>
      <style>{`@keyframes shimmerBtn { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}</style>
    </div>
  );
};

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data] = useState<any>(() => {
    if (location.state) { localStorage.setItem('last_fortune_data', JSON.stringify(location.state)); return location.state; }
    const saved = localStorage.getItem('last_fortune_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTabKey>('name');
  const [currentStep, setCurrentStep] = useState<RevealStep>('intro');
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);
  const [animatedConfessionRate, setAnimatedConfessionRate] = useState(0);
  const [animatedIntimacyLevel, setAnimatedIntimacyLevel] = useState(0);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const fortune = useMemo(() => { if (!data) return null; return buildFortuneBundle(data); }, [data]);
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = ((stepIndex + 1) / STEP_ORDER.length) * 100;
  const openPaid = () => { window.open(PAID_URL, '_blank'); };
  const handleBackToTop = () => { navigate('/compatibility-free', { state: { keepPartnerName: data?.partnerName, keepRelationship: data?.relationship } }); };
  const scrollToTopAnchor = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (topAnchorRef.current) { topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };
  const handleNextStep = () => { const i = STEP_ORDER.indexOf(currentStep); if (i < STEP_ORDER.length - 1) { setCurrentStep(STEP_ORDER[i + 1]); setTimeout(() => { scrollToTopAnchor(); }, 60); } };
  const jumpToStep = (step: RevealStep) => { if (step === 'intro') return; setCurrentStep(step); setTimeout(() => { scrollToTopAnchor(); }, 60); };
  const skipIntro = () => { setShowIntroOverlay(false); setCurrentStep('score'); setTimeout(() => { scrollToTopAnchor(); }, 60); };

  useEffect(() => {
    if (!fortune) return;
    setScore(0); let current = 0; const target = fortune.finalScore; const totalFrames = 92; let frame = 0;
    const timer = setInterval(() => { frame += 1; const progress = frame / totalFrames; const eased = progress < 1 ? 1 - Math.pow(1 - progress, 3) : 1; const overshoot = progress < 0.84 ? 0 : Math.sin((progress - 0.84) * Math.PI * 4.2) * 3.2 * (1 - progress); current = Math.round(target * eased + overshoot); if (current > 100) current = 100; if (current < 0) current = 0; setScore(current); if (frame >= totalFrames) { clearInterval(timer); setScore(target); } }, 26);
    return () => clearInterval(timer);
  }, [fortune]);

  useEffect(() => {
    if (!fortune) return;
    setAnimatedConfessionRate(0); setAnimatedIntimacyLevel(0);
    let cf = 0; let inf = 0;
    const ct = setInterval(() => { cf += 1; const p = cf / 64; const e = 1 - Math.pow(1 - p, 3); const o = p < 0.76 ? 0 : Math.sin((p - 0.76) * Math.PI * 3) * 5.2 * (1 - p); setAnimatedConfessionRate(Math.max(0, Math.min(100, Math.round(fortune.confessionRate * e + o)))); if (cf >= 64) { clearInterval(ct); setAnimatedConfessionRate(fortune.confessionRate); } }, 24);
    const it = setInterval(() => { inf += 1; const p = inf / 70; const e = 1 - Math.pow(1 - p, 3); const o = p < 0.76 ? 0 : Math.sin((p - 0.76) * Math.PI * 3) * 5.2 * (1 - p); setAnimatedIntimacyLevel(Math.max(0, Math.min(100, Math.round(fortune.intimacyLevel * e + o)))); if (inf >= 70) { clearInterval(it); setAnimatedIntimacyLevel(fortune.intimacyLevel); } }, 24);
    return () => { clearInterval(ct); clearInterval(it); };
  }, [fortune]);

  useEffect(() => { const t = setTimeout(() => { setShowIntroOverlay(false); setCurrentStep('score'); }, 5000); return () => { clearTimeout(t); }; }, []);

  if (!data || !fortune) { return <div className="min-h-screen bg-black flex items-center justify-center text-purple-200 font-bold">鑑定データ復元中...</div>; }

  const scoreGlowClass = fortune.finalScore >= 90 ? 'drop-shadow-[0_0_18px_rgba(251,191,36,0.5)]' : fortune.finalScore >= 80 ? 'drop-shadow-[0_0_18px_rgba(236,72,153,0.45)]' : 'drop-shadow-[0_0_18px_rgba(168,85,247,0.4)]';

  return (
    <div className="min-h-screen bg-[#05020a] text-white p-4 font-sans relative overflow-x-hidden">
      <div ref={topAnchorRef} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b1144_0%,#12091f_35%,#05020a_75%)]" />
        <motion.div animate={{ opacity: [0.28, 0.5, 0.28], scale: [1, 1.08, 1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-purple-700/15 blur-3xl" />
        <motion.div animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.04, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-3xl" />
        {[...Array(20)].map((_, i) => (<motion.div key={i} animate={{ opacity: [0.08, 0.5, 0.08], y: [0, -8, 0] }} transition={{ duration: 3 + (i % 5) * 0.6, repeat: Infinity, delay: i * 0.18 }} style={{ top: `${(i * 9.7) % 100}%`, left: `${(i * 17.2) % 100}%` }} className="absolute w-[2px] h-[2px] bg-white rounded-full" />))}
      </div>

      <AnimatePresence>
        {showIntroOverlay && (
          <motion.div key="intro-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} className="fixed inset-0 z-[120] bg-[#05020a]/95 backdrop-blur-xl flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center relative">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="relative mx-auto w-56 h-56 mb-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-purple-400/20" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute inset-3 rounded-full border border-pink-300/20" />
                <motion.div animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 2.8, repeat: Infinity }} className="absolute inset-10 rounded-full bg-gradient-to-br from-purple-500/25 via-pink-400/20 to-yellow-300/20 blur-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 10px rgba(255,100,255,0.6))', 'drop-shadow(0 0 25px rgba(255,100,255,1))', 'drop-shadow(0 0 10px rgba(255,100,255,0.6))'] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{
                      fontSize: '36px', fontWeight: 700, letterSpacing: '0.04em',
                      fontFamily: 'Georgia, serif',
                      background: 'linear-gradient(135deg, #ffaaff 0%, #ffd700 40%, #ff69b4 70%, #ffaaff 100%)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmerLogo 2s linear infinite',
                    }}>
                      Love<span style={{ WebkitTextFillColor: '#ff69b4' }}>LAB</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,220,200,0.7)', letterSpacing: '4px', marginTop: '2px', textTransform: 'uppercase' }}>
                      AI Fortune
                    </div>
                  </motion.div>
                </div>
                <style>{`@keyframes shimmerLogo { 0%{background-position:200% center} 100%{background-position:-200% center} }`}</style>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-3xl font-black mb-3 leading-tight">あなたと<span className="text-[#f9a620]">{fortune.partnerName}</span>の<br />無料鑑定を開始します</motion.h2>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }} className="text-sm text-gray-300 leading-relaxed mb-8">まずは無料で、二人の相性・今の流れ・動くべき気配を読み解きます。核心部分はこの先で確認できます。</motion.p>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={skipIntro} className="px-5 py-3 rounded-full border border-white/15 bg-white/5 text-xs tracking-widest text-gray-200 active:scale-95">すぐに見る</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto relative z-10 pb-28">
        <div className="sticky top-0 z-40 pt-2 pb-4 bg-gradient-to-b from-[#05020a] via-[#05020a]/95 to-transparent backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="bg-gradient-to-r from-[#ff7e61]/20 via-[#f9a620]/10 to-[#22d3ee]/20 border border-white/20 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md text-left"><span className="bg-gradient-to-r from-[#ff7e61] via-[#f9a620] to-[#22d3ee] bg-clip-text text-transparent text-[10px] font-black tracking-[0.18em] uppercase">{fortune.displayDate} 鑑定書</span></div>
            <button onClick={handleBackToTop} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-purple-300 shadow-lg active:scale-90 transition-transform backdrop-blur-md text-lg">←</button>
          </div>
          <div className="mb-3"><div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden"><motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.45 }} className="h-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400" /></div></div>
          <div className="grid grid-cols-6 gap-2">
            {(['score', 'emotion', 'destiny', 'detail', 'biorhythm', 'final'] as const).map((step) => {
              const isActive = currentStep === step;
              const isLocked = LOCKED_STEPS.includes(step);
              return (<button key={step} onClick={() => jumpToStep(step)} className={`rounded-2xl py-2 text-[10px] font-black transition-all border ${isActive ? 'bg-purple-700/80 border-purple-300/40 text-white' : 'bg-white/10 border-white/10 text-gray-200 active:scale-95'}`}>{STEP_LABELS[step]}{isLocked ? '🔒' : ''}</button>);
            })}
          </div>
        </div>

        <header className="text-left mb-6 mt-2">
          <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-2 uppercase">only for you</p>
          <h1 className="text-3xl font-black mb-2 leading-tight">あなた <span className="text-gray-600 font-light mx-1">&</span>{' '}<span className="text-[#f9a620]">{fortune.partnerName}</span></h1>
          <div className="flex items-center gap-2 flex-wrap"><p className="text-gray-500 text-[10px] tracking-widest font-bold">鑑定番号: MS-2026-V3</p><span className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-purple-200">関係性：{fortune.relationship}</span></div>
        </header>

        <AnimatePresence mode="wait">
          {currentStep === 'score' && (
            <motion.section key="score" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <div className="bg-[#13091f]/70 border border-white/10 rounded-[32px] px-5 py-6 shadow-2xl backdrop-blur-xl">
                <p className="text-center text-[10px] tracking-[0.35em] text-gray-400 mb-3 uppercase">destiny score</p>
                <div className="grid grid-cols-[1.1fr_0.9fr] gap-4 items-center mb-5">
                  <div className="flex justify-center">
                    <motion.div initial={{ rotate: -220, scale: 0.86, opacity: 0.2 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} className="relative w-44 h-44 flex items-center justify-center">
                      <motion.div animate={{ scale: [1, 1.03, 1], opacity: [0.55, 0.95, 0.55] }} transition={{ duration: 2.8, repeat: Infinity }} className="absolute inset-4 rounded-full bg-pink-500/10 blur-2xl" />
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                        <circle cx="88" cy="88" r="60" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/5" />
                        <motion.circle cx="88" cy="88" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={464.96} strokeDashoffset={464.96 - (464.96 * score) / 100} className={`text-pink-500 ${scoreGlowClass}`} initial={{ strokeDashoffset: 464.96 }} animate={{ strokeDashoffset: 464.96 - (464.96 * score) / 100 }} transition={{ duration: 2.1, ease: [0.16, 1, 0.3, 1] }} />
                      </svg>
                      <div className="absolute text-center"><motion.div animate={score === fortune.finalScore ? { scale: [1, 1.06, 0.985, 1] } : { scale: 1 }} transition={{ duration: 1.15 }}><span className="text-6xl font-black italic tracking-tighter">{score}</span><span className="text-base font-bold block -mt-2">点</span></motion.div></div>
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <motion.div initial={{ opacity: 0, x: 24, scaleX: 0.4, scaleY: 0.92 }} animate={{ opacity: 1, x: 0, scaleX: 1, scaleY: 1 }} transition={{ delay: 0.28, type: 'spring', stiffness: 120, damping: 14 }} className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left">
                      <p className="text-[10px] text-pink-300 font-bold mb-1 tracking-wider uppercase">告白成功率</p>
                      <div className="text-2xl font-black text-white mb-2">{animatedConfessionRate}<span className="text-xs ml-0.5">%</span></div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden"><motion.div initial={{ width: 0, scaleX: 0.3 }} animate={{ width: `${animatedConfessionRate}%`, scaleX: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 13, mass: 1.05 }} className="h-full bg-gradient-to-r from-pink-500 to-rose-400 origin-left" /></div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 24, scaleX: 0.4, scaleY: 0.92 }} animate={{ opacity: 1, x: 0, scaleX: 1, scaleY: 1 }} transition={{ delay: 0.42, type: 'spring', stiffness: 120, damping: 14 }} className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left">
                      <p className="text-[10px] text-blue-300 font-bold mb-1 tracking-wider uppercase">二人の親密度</p>
                      <div className="text-2xl font-black text-white mb-2">{animatedIntimacyLevel}<span className="text-xs ml-0.5">%</span></div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden"><motion.div initial={{ width: 0, scaleX: 0.3 }} animate={{ width: `${animatedIntimacyLevel}%`, scaleX: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 13, mass: 1.05 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 origin-left" /></div>
                    </motion.div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-2 uppercase">special reading</p>
                  <h2 className="text-xl font-black mb-3 leading-tight">二人の波動は、<span className="bg-gradient-to-r from-pink-400 via-[#f9a620] to-cyan-300 bg-clip-text text-transparent">{fortune.finalScore >= 90 ? '強く結びついています' : fortune.finalScore >= 80 ? '美しく共鳴しています' : fortune.finalScore >= 70 ? '静かに引き合っています' : '変化の途中にあります'}</span></h2>
                  <p className="text-sm text-gray-300 leading-relaxed">あなたの入力情報から導かれたこの数値は、{fortune.partnerName}さんとの今の関係性・感情の温度・未来の流れを総合したものです。</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button onClick={openPaid} style={{ width: '100%', padding: '18px', borderRadius: '9999px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #ec4899, #9333ea)', backgroundSize: '200% auto', animation: 'shimmerBtn 2s linear infinite', fontWeight: 900, color: 'white', boxShadow: '0 0 40px rgba(236,72,153,0.7), 0 0 80px rgba(168,85,247,0.5)', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.05em' }}>
                  完全鑑定を読む
                </button>
                <div style={{ fontSize: '48px', marginTop: '12px', animation: 'unlockPulse 1.5s ease-in-out infinite' }}>🔓</div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>安心のnote決済対応</p>
              </div>
              <style>{`
                @keyframes unlockPulse { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,200,100,0.6)); } 50% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(255,200,100,1)); } }
                @keyframes shimmerBtn { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
              `}</style>
            </motion.section>
          )}

          {currentStep === 'emotion' && (
            <motion.section key="emotion" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <LockedPanel title={`${fortune.partnerName}さんの本音は、この先で明らかになります`} subtitle="今、相手があなたをどう見ているか。好意・迷い・距離感の核心は有料版で公開されます。" preview={getPreviewText('emotion', fortune)} buttonLabel="相手の本音を開く" onOpenPaid={openPaid} />
              <div className="mt-6 flex justify-center"><button onClick={handleNextStep} className="px-8 py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md">運命分析の予告を見る</button></div>
            </motion.section>
          )}

          {currentStep === 'destiny' && (
            <motion.section key="destiny" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <LockedPanel title="二人の未来には、まだ見えていない流れがあります" subtitle="このご縁が進展へ向かうのか、停滞なのか、再接近の兆しがあるのか。未来の本筋は有料版で公開されます。" preview={getPreviewText('destiny', fortune)} buttonLabel="二人の未来を見る" onOpenPaid={openPaid} />
              <div className="mt-6 flex justify-center"><button onClick={handleNextStep} className="px-8 py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md">詳細分析の予告を見る</button></div>
            </motion.section>
          )}

          {currentStep === 'detail' && (
            <motion.section key="detail" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <div className="bg-[#160a2b]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="px-8 pt-8 pb-5"><p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">deep reading</p><h3 className="text-2xl font-black leading-tight">角度を変えるほど、<span className="text-[#f9a620]">二人の本質が見えてきます</span></h3></div>
                <div className="grid grid-cols-4 border-b border-white/5 bg-white/[0.02]">
                  {[{ label: '姓名', key: 'name' as ActiveTabKey }, { label: '星座', key: 'star' as ActiveTabKey }, { label: '血液', key: 'blood' as ActiveTabKey }, { label: '五行', key: 'five' as ActiveTabKey }].map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative py-5 text-[12px] font-black tracking-[0.08em] transition-all ${isActive ? 'bg-gradient-to-b from-purple-700/90 to-pink-700/50 text-white' : 'bg-white/5 text-gray-400'}`}><span className="relative z-10">{tab.label}</span></button>);
                  })}
                </div>
                <div className="p-8 min-h-[220px] text-left">
                  <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 overflow-hidden">
                    <div className="blur-[4px] select-none pointer-events-none"><h4 className="text-[#f9a620] text-lg font-black mb-4">{fortune.tabs[activeTab].title}</h4><p className="text-sm text-gray-200 leading-relaxed">{fortune.tabs[activeTab].content}</p></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12091f]/30 to-[#12091f]/84" />
                    <div className="absolute inset-x-0 bottom-5 flex justify-center"><div className="px-4 py-2 rounded-full bg-black/45 border border-white/15 text-xs font-black text-purple-100 backdrop-blur-md">🔒 分析全文は有料版で公開</div></div>
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <button onClick={openPaid} style={{ width: '100%', padding: '18px', borderRadius: '9999px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #ec4899, #9333ea)', backgroundSize: '200% auto', animation: 'shimmerBtn 2s linear infinite', fontWeight: 900, color: 'white', boxShadow: '0 0 40px rgba(236,72,153,0.7), 0 0 80px rgba(168,85,247,0.5)', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.05em' }}>
                    完全鑑定を読む
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}><span style={{ fontSize: '36px', animation: 'unlockPulse 1.5s ease-in-out infinite', display: 'inline-block' }}>🔓</span></div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>安心のnote決済対応</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center"><button onClick={handleNextStep} className="px-8 py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md">今後の流れを見る</button></div>
            </motion.section>
          )}

          {currentStep === 'biorhythm' && (
            <motion.section key="biorhythm" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <LockedPanel title="二人の流れは、この先で詳しく分かります" subtitle="今週の中で動くべき日、慎重にしたい日、連絡や告白に向くタイミングは有料版で公開されます。" preview={getPreviewText('biorhythm', fortune)} buttonLabel="二人の流れを開く" onOpenPaid={openPaid} />
              <div className="mt-6 flex justify-center"><button onClick={handleNextStep} className="px-8 py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md">最後の結論を見る</button></div>
            </motion.section>
          )}

          {currentStep === 'final' && (
            <motion.section key="final" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mb-8">
              <LockedPanel title="この恋の結論は、まだ無料版では公開していません" subtitle="進むべきか、待つべきか。告白の時期、成功率を上げる方法、最終判断はこの先にあります。" preview={getPreviewText('final', fortune)} buttonLabel="相手の本音と結論を見る" onOpenPaid={openPaid} />

              {/* アップセルセクション */}
              <div style={{ marginTop: '40px', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(80,20,120,0.85) 0%, rgba(30,5,60,0.95) 100%)', borderRadius: '24px', border: '1px solid rgba(200,120,255,0.35)', boxShadow: '0 0 40px rgba(160,80,255,0.2)', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#d8a0ff', marginBottom: '16px', textTransform: 'uppercase' as const }}>next reading</p>
                <h2 style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.7, marginBottom: '20px', color: 'white' }}>
                  相性鑑定で「二人の関係」がわかった今——<br />
                  <span style={{ color: '#f9a620' }}>次は「あなた自身」を知ることで、</span><br />
                  この恋はもっと動かせます。
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.82)', marginBottom: '12px' }}>
                  相手の気持ちや二人の流れを読み解いても、<br />
                  <strong style={{ color: '#ffffff' }}>あなた自身の本質・使命・今年の運気</strong>を知らなければ、<br />
                  最善のタイミングで動くことはできません。
                </p>
                <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.82)', marginBottom: '28px' }}>
                  個人鑑定では、あなたの生年月日・姓名・星座から<br />
                  <strong style={{ color: '#f9a620' }}>「なぜこの人に惹かれるのか」「いつ動くべきか」<br />「この恋を成就させる鍵」</strong>まで深く読み解きます。
                </p>
                <a href="https://kojin-sales.vercel.app/" target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', padding: '18px', borderRadius: '9999px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #ec4899, #9333ea)', backgroundSize: '200% auto', animation: 'shimmerBtn 2s linear infinite', fontWeight: 900, color: 'white', boxShadow: '0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(168,85,247,0.4)', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.05em', textDecoration: 'none', boxSizing: 'border-box' as const }}>
                  ✨ あなた自身の運命鑑定を見る<br />
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>特別価格 1,980円</span>
                </a>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '12px' }}>安心のnote決済対応</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button onClick={() => jumpToStep('score')} className="w-full py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md">最初から見直す</button>
                <button onClick={handleBackToTop} className="w-full py-4 rounded-full bg-black/25 border border-white/10 font-black text-gray-300 active:scale-95 transition-all">鑑定を終了して戻る</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultPage;
