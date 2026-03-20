import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildFortuneBundle, type ActiveTabKey } from '../services/fortuneEngine';

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

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data] = useState<any>(() => {
    if (location.state) {
      localStorage.setItem('last_fortune_data', JSON.stringify(location.state));
      return location.state;
    }
    const saved = localStorage.getItem('last_fortune_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [showManual, setShowManual] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTabKey>('name');
  const [currentStep, setCurrentStep] = useState<RevealStep>('intro');
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);

  const [animatedConfessionRate, setAnimatedConfessionRate] = useState(0);
  const [animatedIntimacyLevel, setAnimatedIntimacyLevel] = useState(0);

  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const fortune = useMemo(() => {
    if (!data) return null;
    return buildFortuneBundle(data);
  }, [data]);

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const handleBackToTop = () => {
    navigate('/', {
      state: {
        keepPartnerName: data?.partnerName,
        keepRelationship: data?.relationship,
      },
    });
  };

  const scrollToTopAnchor = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      setCurrentStep(nextStep);
      setTimeout(() => {
        scrollToTopAnchor();
      }, 60);
    }
  };

  const jumpToStep = (step: RevealStep) => {
    if (step === 'intro') return;
    setCurrentStep(step);
    setTimeout(() => {
      scrollToTopAnchor();
    }, 60);
  };

  const skipIntro = () => {
    setShowIntroOverlay(false);
    setCurrentStep('score');
    setTimeout(() => {
      scrollToTopAnchor();
    }, 60);
  };

  useEffect(() => {
    if (!fortune) return;

    setScore(0);

    let current = 0;
    const target = fortune.finalScore;
    const totalFrames = 92;
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;

      const eased = progress < 1 ? 1 - Math.pow(1 - progress, 3) : 1;
      const overshoot =
        progress < 0.84
          ? 0
          : Math.sin((progress - 0.84) * Math.PI * 4.2) * 3.2 * (1 - progress);

      current = Math.round(target * eased + overshoot);

      if (current > 100) current = 100;
      if (current < 0) current = 0;

      setScore(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setScore(target);
      }
    }, 26);

    return () => clearInterval(timer);
  }, [fortune]);

  useEffect(() => {
    if (!fortune) return;

    setAnimatedConfessionRate(0);
    setAnimatedIntimacyLevel(0);

    let confessionFrame = 0;
    let intimacyFrame = 0;
    const confessionFrames = 64;
    const intimacyFrames = 70;

    const confessionTimer = setInterval(() => {
      confessionFrame += 1;
      const p = confessionFrame / confessionFrames;
      const eased = 1 - Math.pow(1 - p, 3);
      const overshoot =
        p < 0.76 ? 0 : Math.sin((p - 0.76) * Math.PI * 3) * 5.2 * (1 - p);
      const next = Math.round(fortune.confessionRate * eased + overshoot);
      setAnimatedConfessionRate(Math.max(0, Math.min(100, next)));

      if (confessionFrame >= confessionFrames) {
        clearInterval(confessionTimer);
        setAnimatedConfessionRate(fortune.confessionRate);
      }
    }, 24);

    const intimacyTimer = setInterval(() => {
      intimacyFrame += 1;
      const p = intimacyFrame / intimacyFrames;
      const eased = 1 - Math.pow(1 - p, 3);
      const overshoot =
        p < 0.76 ? 0 : Math.sin((p - 0.76) * Math.PI * 3) * 5.2 * (1 - p);
      const next = Math.round(fortune.intimacyLevel * eased + overshoot);
      setAnimatedIntimacyLevel(Math.max(0, Math.min(100, next)));

      if (intimacyFrame >= intimacyFrames) {
        clearInterval(intimacyTimer);
        setAnimatedIntimacyLevel(fortune.intimacyLevel);
      }
    }, 24);

    return () => {
      clearInterval(confessionTimer);
      clearInterval(intimacyTimer);
    };
  }, [fortune]);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowIntroOverlay(false);
      setCurrentStep('score');
    }, 6000);

    return () => {
      clearTimeout(hideTimer);
    };
  }, []);

  if (!data || !fortune) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-purple-200 font-bold">
        鑑定データ復元中...
      </div>
    );
  }

  const scoreGlowClass =
    fortune.finalScore >= 90
      ? 'drop-shadow-[0_0_18px_rgba(251,191,36,0.5)]'
      : fortune.finalScore >= 80
      ? 'drop-shadow-[0_0_18px_rgba(236,72,153,0.45)]'
      : 'drop-shadow-[0_0_18px_rgba(168,85,247,0.4)]';

  return (
    <div className="min-h-screen bg-[#05020a] text-white p-4 font-sans relative overflow-x-hidden">
      <div ref={topAnchorRef} />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b1144_0%,#12091f_35%,#05020a_75%)]" />
        <motion.div
          animate={{ opacity: [0.28, 0.5, 0.28], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[440px] h-[440px] rounded-full bg-purple-700/15 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-3xl"
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.08, 0.5, 0.08], y: [0, -8, 0] }}
            transition={{ duration: 3 + (i % 5) * 0.6, repeat: Infinity, delay: i * 0.18 }}
            style={{
              top: `${(i * 9.7) % 100}%`,
              left: `${(i * 17.2) % 100}%`,
            }}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
          />
        ))}
      </div>

      <AnimatePresence>
        {showIntroOverlay && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[120] bg-[#05020a]/95 backdrop-blur-xl flex items-center justify-center px-6"
          >
            <div className="w-full max-w-md text-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative mx-auto w-56 h-56 mb-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-purple-400/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border border-pink-300/20"
                />
                <motion.div
                  animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.96, 1.04, 0.96] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="absolute inset-10 rounded-full bg-gradient-to-br from-purple-500/25 via-pink-400/20 to-yellow-300/20 blur-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] tracking-[0.45em] text-purple-200/80 mb-2">PERSONAL READING</p>
                    <p className="text-4xl">✦</p>
                  </div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl font-black mb-3 leading-tight"
              >
                あなたと<span className="text-[#f9a620]">{fortune.partnerName}</span>の
                <br />
                運命解析を開始します
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-sm text-gray-300 leading-relaxed mb-8"
              >
                入力された情報から、二人の波動・感情・流れを統合し、
                あなただけの鑑定結果を静かに解き明かしています。
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={skipIntro}
                className="px-5 py-3 rounded-full border border-white/15 bg-white/5 text-xs tracking-widest text-gray-200 active:scale-95"
              >
                すぐに見る
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto relative z-10 pb-28">
        <div className="sticky top-0 z-40 pt-2 pb-4 bg-gradient-to-b from-[#05020a] via-[#05020a]/95 to-transparent backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="bg-gradient-to-r from-[#ff7e61]/20 via-[#f9a620]/10 to-[#22d3ee]/20 border border-white/20 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md text-left">
              <span className="bg-gradient-to-r from-[#ff7e61] via-[#f9a620] to-[#22d3ee] bg-clip-text text-transparent text-[10px] font-black tracking-[0.18em] uppercase">
                {fortune.displayDate} 鑑定書
              </span>
            </div>

            <button
              onClick={() => setShowManual(true)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-purple-300 shadow-lg active:scale-90 transition-transform backdrop-blur-md text-lg"
            >
              🔖
            </button>
          </div>

          <div className="mb-3">
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.45 }}
                className="h-full bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {(['score', 'emotion', 'destiny', 'detail', 'biorhythm', 'final'] as const).map((step) => {
              const isActive = currentStep === step;

              return (
                <button
                  key={step}
                  onClick={() => jumpToStep(step)}
                  className={`rounded-2xl py-2 text-[10px] font-black transition-all border ${
                    isActive
                      ? 'bg-purple-700/80 border-purple-300/40 text-white'
                      : 'bg-white/10 border-white/10 text-gray-200 active:scale-95'
                  }`}
                >
                  {STEP_LABELS[step]}
                </button>
              );
            })}
          </div>
        </div>

        <header className="text-left mb-6 mt-2">
          <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-2 uppercase">
            only for you
          </p>
          <h1 className="text-3xl font-black mb-2 leading-tight">
            あなた <span className="text-gray-600 font-light mx-1">&</span>{' '}
            <span className="text-[#f9a620]">{fortune.partnerName}</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-[10px] tracking-widest font-bold">鑑定番号: MS-2026-V3</p>
            <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-purple-200">
              関係性：{fortune.relationship}
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentStep === 'score' && (
            <motion.section
              key="score"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-[#13091f]/70 border border-white/10 rounded-[32px] px-5 py-6 shadow-2xl backdrop-blur-xl">
                <p className="text-center text-[10px] tracking-[0.35em] text-gray-400 mb-3 uppercase">
                  destiny score
                </p>

                <div className="grid grid-cols-[1.1fr_0.9fr] gap-4 items-center mb-5">
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ rotate: -220, scale: 0.86, opacity: 0.2 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{
                        duration: 2.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative w-44 h-44 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.03, 1], opacity: [0.55, 0.95, 0.55] }}
                        transition={{ duration: 2.8, repeat: Infinity }}
                        className="absolute inset-4 rounded-full bg-pink-500/10 blur-2xl"
                      />
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="88"
                          cy="88"
                          r="74"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="88"
                          cy="88"
                          r="60"
                          stroke="currentColor"
                          strokeWidth="1"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <motion.circle
                          cx="88"
                          cy="88"
                          r="74"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={464.96}
                          strokeDashoffset={464.96 - (464.96 * score) / 100}
                          className={`text-pink-500 ${scoreGlowClass}`}
                          initial={{ strokeDashoffset: 464.96 }}
                          animate={{ strokeDashoffset: 464.96 - (464.96 * score) / 100 }}
                          transition={{
                            duration: 2.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </svg>

                      <div className="absolute text-center">
                        <motion.div
                          animate={
                            score === fortune.finalScore
                              ? { scale: [1, 1.06, 0.985, 1] }
                              : { scale: 1 }
                          }
                          transition={{ duration: 1.15 }}
                        >
                          <span className="text-6xl font-black italic tracking-tighter">{score}</span>
                          <span className="text-base font-bold block -mt-2">点</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: 24, scaleX: 0.4, scaleY: 0.92 }}
                      animate={{ opacity: 1, x: 0, scaleX: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.28,
                        type: 'spring',
                        stiffness: 120,
                        damping: 14,
                      }}
                      className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left"
                    >
                      <p className="text-[10px] text-pink-300 font-bold mb-1 tracking-wider uppercase">告白成功率</p>
                      <div className="text-2xl font-black text-white mb-2">
                        {animatedConfessionRate}
                        <span className="text-xs ml-0.5">%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0, scaleX: 0.3 }}
                          animate={{ width: `${animatedConfessionRate}%`, scaleX: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 110,
                            damping: 13,
                            mass: 1.05,
                          }}
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 origin-left"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 24, scaleX: 0.4, scaleY: 0.92 }}
                      animate={{ opacity: 1, x: 0, scaleX: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.42,
                        type: 'spring',
                        stiffness: 120,
                        damping: 14,
                      }}
                      className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left"
                    >
                      <p className="text-[10px] text-blue-300 font-bold mb-1 tracking-wider uppercase">二人の親密度</p>
                      <div className="text-2xl font-black text-white mb-2">
                        {animatedIntimacyLevel}
                        <span className="text-xs ml-0.5">%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0, scaleX: 0.3 }}
                          animate={{ width: `${animatedIntimacyLevel}%`, scaleX: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 110,
                            damping: 13,
                            mass: 1.05,
                          }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 origin-left"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-2 uppercase">
                    special reading
                  </p>
                  <h2 className="text-xl font-black mb-3 leading-tight">
                    二人の波動は、
                    <span className="bg-gradient-to-r from-pink-400 via-[#f9a620] to-cyan-300 bg-clip-text text-transparent">
                      {fortune.finalScore >= 90
                        ? '強く結びついています'
                        : fortune.finalScore >= 80
                        ? '美しく共鳴しています'
                        : fortune.finalScore >= 70
                        ? '静かに引き合っています'
                        : '変化の途中にあります'}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    あなたの入力情報から導かれたこの数値は、
                    {fortune.partnerName}さんとの今の関係性・感情の温度・未来の流れを総合したものです。
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                >
                  相手の本音へ進む
                </button>
              </div>
            </motion.section>
          )}

          {currentStep === 'emotion' && (
            <motion.section
              key="emotion"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-[#1a0e2d]/80 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] tracking-[0.35em] text-pink-300 mb-3 uppercase">hidden emotion</p>
                <h3 className="text-2xl font-black mb-5 leading-tight">
                  {fortune.partnerName}さんの心は、
                  <span className="text-[#f9a620]">あなたを強く意識しています</span>
                </h3>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      表面では落ち着いて見えても、内側ではあなたの存在が想像以上に大きくなっています。
                      関係性がどうであれ、心の深い部分であなたを“無関係ではいられない相手”として捉えています。
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-300/10 rounded-3xl p-5">
                    <p className="text-sm text-gray-100 leading-relaxed">
                      {fortune.tabs.blood.content}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-black/20 rounded-3xl p-5 border border-white/5">
                  <p className="text-[10px] tracking-[0.3em] text-purple-300 mb-2 uppercase">読み解きポイント</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    相手の心は、強く惹かれているほど慎重になります。
                    つまり反応が控えめでも、それは温度が低いのではなく、
                    あなたを意識しているからこその揺れである可能性があります。
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                >
                  運命分析へ進む
                </button>
              </div>
            </motion.section>
          )}

          {currentStep === 'destiny' && (
            <motion.section
              key="destiny"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-[#160a2b]/85 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">destiny analysis</p>
                <h3 className="text-2xl font-black mb-5 leading-tight">
                  このご縁は、
                  <span className="text-[#f9a620]">偶然より深い意味を持っています</span>
                </h3>

                <div className="grid grid-cols-1 gap-5">
                  <div className="bg-[#1a0e2d]/60 border border-white/10 rounded-[28px] p-6">
                    <h4 className="text-[#f9a620] font-black mb-3">⬢ 二人の総合運勢</h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {fortune.generalFortune.content}
                    </p>
                  </div>

                  <div className="bg-[#1a0e2d]/60 border border-white/10 rounded-[28px] p-6">
                    <h4 className="text-purple-400 font-black mb-3">🔗 運命分析</h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {fortune.destinyAnalysis.content}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-900/35 to-indigo-900/35 p-5">
                  <p className="text-[10px] tracking-[0.3em] text-purple-300 mb-2 uppercase">重要な示唆</p>
                  <p className="text-sm text-white leading-relaxed">
                    この関係は、ただ「好きかどうか」だけで判断しない方が良いご縁です。
                    つながる意味が深いほど、進み方はゆっくりでも、残るものは強くなります。
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                >
                  詳細分析を見る
                </button>
              </div>
            </motion.section>
          )}

          {currentStep === 'detail' && (
            <motion.section
              key="detail"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-[#160a2b]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="px-8 pt-8 pb-5">
                  <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">deep reading</p>
                  <h3 className="text-2xl font-black leading-tight">
                    角度を変えるほど、
                    <span className="text-[#f9a620]">二人の本質が見えてきます</span>
                  </h3>
                </div>

                <div className="grid grid-cols-4 border-b border-white/5 bg-white/[0.02]">
                  {[
                    { label: '姓名', key: 'name' as ActiveTabKey },
                    { label: '星座', key: 'star' as ActiveTabKey },
                    { label: '血液', key: 'blood' as ActiveTabKey },
                    { label: '五行', key: 'five' as ActiveTabKey },
                  ].map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                      <motion.button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        animate={
                          isActive
                            ? {
                                boxShadow: [
                                  '0 0 0 rgba(168,85,247,0)',
                                  '0 0 22px rgba(168,85,247,0.38)',
                                  '0 0 12px rgba(236,72,153,0.26)',
                                ],
                              }
                            : {
                                boxShadow: '0 0 0 rgba(0,0,0,0)',
                              }
                        }
                        transition={{
                          duration: 1.8,
                          repeat: isActive ? Infinity : 0,
                          repeatType: 'reverse',
                        }}
                        className={`relative py-5 text-[12px] font-black tracking-[0.08em] transition-all ${
                          isActive
                            ? 'bg-gradient-to-b from-purple-700/90 to-pink-700/50 text-white'
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            animate={{ opacity: [0.22, 0.5, 0.22] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-yellow-200/10 pointer-events-none"
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="p-8 min-h-[220px] text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <h4 className="text-[#f9a620] text-lg font-black mb-4">
                        {fortune.tabs[activeTab].title}
                      </h4>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {fortune.tabs[activeTab].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="px-8 pb-8">
                  <div className="bg-black/20 rounded-3xl p-5 border border-white/5">
                    <h4 className="text-purple-300 text-sm font-black mb-3 flex items-center gap-2">
                      <span>💡</span> 今、最も効くアドバイス
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed italic mb-6">
                      「{fortune.advice}」
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[#f9a620] text-[10px] font-bold mb-1 uppercase">Lucky No.</p>
                        <p className="text-3xl font-black text-white">{fortune.luckyNumber}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-blue-400 text-[10px] font-bold mb-1 uppercase">Lucky Color</p>
                        <p className="text-sm font-black text-white leading-tight">{fortune.luckyColor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                >
                  これからの流れを見る
                </button>
              </div>
            </motion.section>
          )}

          {currentStep === 'biorhythm' && (
            <motion.section
              key="biorhythm"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-[#160a2b]/80 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase text-center">
                  next 7 days
                </p>
                <h3 className="text-2xl font-black text-center mb-8 leading-tight">
                  二人の流れは、
                  <span className="text-[#f9a620]">この7日でこう動きます</span>
                </h3>

                <div className="space-y-5">
                  {fortune.biorhythmData.map((item, i) => (
                    <motion.div
                      key={`${item.date}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white/5 rounded-2xl p-5 border border-white/5 text-left"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-black ${i === 0 ? 'text-pink-500' : 'text-gray-300'}`}>
                            {item.date}
                          </span>
                          {i === 0 && (
                            <span className="text-[9px] px-2 py-1 rounded-full border border-pink-400/30 bg-pink-500/10 text-pink-200">
                              鑑定日
                            </span>
                          )}
                          <div className="flex text-[12px] tracking-widest">
                            <span className="text-[#f9a620]">{'★'.repeat(item.activeStars)}</span>
                            <span className="text-gray-600">{'★'.repeat(item.inactiveStars)}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-gray-400">{item.score}%</span>
                      </div>

                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.1 }}
                          className={`h-full rounded-full ${
                            item.score >= 90
                              ? 'bg-gradient-to-r from-pink-500 to-yellow-400'
                              : item.score >= 70
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : item.score >= 50
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                              : 'bg-gradient-to-r from-slate-500 to-indigo-700'
                          }`}
                        />
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed">{item.note}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                >
                  最後の結論を見る
                </button>
              </div>
            </motion.section>
          )}

          {currentStep === 'final' && (
            <motion.section
              key="final"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-b from-[#1b0d31]/95 to-[#12091f]/95 border border-white/10 rounded-[36px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <p className="text-[10px] tracking-[0.4em] text-purple-300 mb-3 uppercase text-center">
                  final guidance
                </p>
                <h3 className="text-3xl font-black text-center mb-6 leading-tight">
                  このご縁を動かす鍵は、
                  <span className="bg-gradient-to-r from-pink-400 via-[#f9a620] to-cyan-300 bg-clip-text text-transparent">
                    あなたの一歩
                  </span>
                  です
                </h3>

                <div className="rounded-[28px] bg-white/5 border border-white/10 p-6 mb-6">
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">
                    ✦ 本日の行動指針
                  </h4>
                  <p className="text-base font-bold text-white leading-relaxed">
                    {fortune.actionGuide}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="rounded-[28px] bg-gradient-to-r from-purple-900/35 to-indigo-900/35 border border-purple-400/20 p-5">
                    <p className="text-[10px] tracking-[0.3em] text-purple-300 mb-2 uppercase">結論</p>
                    <p className="text-sm text-gray-100 leading-relaxed">
                      今の二人は、表面以上に深い流れの中にいます。
                      大きな奇跡は、派手な行動ではなく、
                      正しいタイミングでの静かな一言から始まります。
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-gradient-to-r from-pink-900/20 to-yellow-900/20 border border-yellow-300/10 p-5">
                    <p className="text-[10px] tracking-[0.3em] text-[#f9a620] mb-2 uppercase">あなたへのメッセージ</p>
                    <p className="text-sm text-gray-100 leading-relaxed">
                      この鑑定は「可能性があるか」ではなく、
                      「どうすればその可能性を現実に近づけるか」を示しています。
                      あなたの魅力は、すでに相手の内側へ届き始めています。
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => jumpToStep('score')}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                  >
                    最初から見直す
                  </button>

                  <button
                    onClick={handleBackToTop}
                    className="w-full py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md"
                  >
                    鑑定を終了して戻る
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-left"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="bg-[#1a0e2d] border border-purple-500/40 w-full max-w-sm rounded-[32px] p-8 relative shadow-[0_0_50px_rgba(168,85,247,0.4)]"
            >
              <button onClick={() => setShowManual(false)} className="absolute top-6 right-6 text-gray-500 text-xl">
                ✕
              </button>

              <h2 className="text-2xl font-black text-purple-300 mb-6">🔖 取扱説明書</h2>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-[50vh] pr-2">
                <section>
                  <h3 className="text-purple-400 font-black mb-1">1. 鑑定の流れ</h3>
                  <p>
                    この鑑定は「点数 → 本音 → 運命 → 分析 → 流れ → 結論」の順で読み進める構成です。
                    上部のメニューをタップすると、見たい項目へすぐ移動できます。
                  </p>
                </section>

                <section>
                  <h3 className="text-[#f9a620] font-black mb-1">2. スコア演出について</h3>
                  <p>
                    相性スコアは、円が大きく回転しながら表示される特別演出になっています。
                    数字は0から上昇し、最終的な鑑定点に到達します。
                  </p>
                </section>

                <section>
                  <h3 className="text-pink-400 font-black mb-1">3. 告白成功率・親密度</h3>
                  <p>
                    告白成功率と二人の親密度は、バーが伸びる演出で表示されます。
                    どちらも入力情報をもとに算出されており、スコアと連動した内容になっています。
                  </p>
                </section>

                <section>
                  <h3 className="text-blue-400 font-black mb-1">4. 詳細分析タブ</h3>
                  <p>
                    「姓名・星座・血液・五行」の4つの視点から相性を読み解けます。
                    選択中のタブは発光表示され、現在見ている分析内容が分かりやすくなっています。
                  </p>
                </section>

                <section>
                  <h3 className="text-emerald-400 font-black mb-1">5. 週間バイオリズム</h3>
                  <p>
                    週間バイオリズムは、各日付ごとの流れを日付単位で表示しています。
                    星の数・スコア・注意点は、その日そのものの運気に基づいています。
                  </p>
                </section>

                <section>
                  <h3 className="text-yellow-300 font-black mb-1">6. 導入演出について</h3>
                  <p>
                    鑑定開始時には、あなたとお相手の運命解析を始める導入演出が表示されます。
                    「すぐに見る」を押すと、いつでもその場で結果画面へ進めます。
                  </p>
                </section>

                <section>
                  <h3 className="text-purple-300 font-black mb-1">7. 鑑定結果の特徴</h3>
                  <p>
                    この結果は、入力された情報をもとに一貫したロジックで生成されています。
                    同じ条件なら同じ結果になり、日付が変わればその日の流れに応じて内容も変化します。
                  </p>
                </section>

                <section>
                  <h3 className="text-rose-300 font-black mb-1">8. プライバシー</h3>
                  <p>
                    ご入力いただいた情報はクラウド上には保存されず、
                    お使いのスマートフォンやブラウザ内部にのみ保持されます。
                    外部に個人情報を残さない設計のため、
                    プライバシー面でも安心してお使いいただけます。
                    音は再生されないため、静かな場所でもご利用しやすい仕様です。
                  </p>
                </section>
              </div>

              <button
                onClick={() => setShowManual(false)}
                className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-black text-white shadow-lg"
              >
                理解しました
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultPage;
