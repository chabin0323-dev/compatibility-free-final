import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildFortuneBundle } from '../services/fortuneEngine';

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

// ここを note の決済ページURL に変更してください
const PAID_URL = 'https://aisou-fortune-host.vercel.app/';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const [showManual, setShowManual] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStep, setCurrentStep] = useState<RevealStep>('intro');
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);
  const [animatedConfessionRate, setAnimatedConfessionRate] = useState(0);
  const [animatedIntimacyLevel, setAnimatedIntimacyLevel] = useState(0);

  const [data] = useState<any>(() => {
    try {
      if (location.state) {
        localStorage.setItem('last_fortune_data', JSON.stringify(location.state));
        return location.state;
      }

      const saved = localStorage.getItem('last_fortune_data');
      if (!saved) return null;

      return JSON.parse(saved);
    } catch (error) {
      console.error('last_fortune_data load error:', error);
      return null;
    }
  });

  const fortune = useMemo(() => {
    try {
      if (!data) return null;
      return buildFortuneBundle(data);
    } catch (error) {
      console.error('buildFortuneBundle error:', error);
      return null;
    }
  }, [data]);

  const safePartnerName = fortune?.partnerName || data?.partnerName || 'お相手';
  const safeRelationship = fortune?.relationship || data?.relationship || '未設定';
  const safeDisplayDate = fortune?.displayDate || '本日';
  const safeFinalScore = typeof fortune?.finalScore === 'number' ? fortune.finalScore : 78;
  const safeConfessionRate = typeof fortune?.confessionRate === 'number' ? fortune.confessionRate : 72;
  const safeIntimacyLevel = typeof fortune?.intimacyLevel === 'number' ? fortune.intimacyLevel : 68;

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const handleBackToTop = () => {
    navigate('/compatibility-free', {
      state: {
        keepPartnerName: data?.partnerName || '',
        keepRelationship: data?.relationship || '',
      },
    });
  };

  const scrollToTopAnchor = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openPaidPage = () => {
    window.location.href = PAID_URL;
  };

  // 無料版は score の次に locked へ行くだけ
  const handleNextStep = () => {
    if (currentStep === 'score') {
      setCurrentStep('emotion');
      setTimeout(() => {
        scrollToTopAnchor();
      }, 60);
      return;
    }

    openPaidPage();
  };

  // 無料版では score 以外はすべてロック画面へ固定
  const jumpToStep = (step: RevealStep) => {
    if (step === 'intro') return;

    if (step === 'score') {
      setCurrentStep('score');
    } else if (step === 'emotion') {
      setCurrentStep('emotion');
    } else if (step === 'destiny') {
      setCurrentStep('destiny');
    } else if (step === 'detail') {
      setCurrentStep('detail');
    } else if (step === 'biorhythm') {
      setCurrentStep('biorhythm');
    } else if (step === 'final') {
      setCurrentStep('final');
    }

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
    if (!fortune) {
      setScore(0);
      return;
    }

    setScore(0);

    let current = 0;
    const target = safeFinalScore;
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
  }, [fortune, safeFinalScore]);

  useEffect(() => {
    if (!fortune) {
      setAnimatedConfessionRate(0);
      setAnimatedIntimacyLevel(0);
      return;
    }

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
      const next = Math.round(safeConfessionRate * eased + overshoot);
      setAnimatedConfessionRate(Math.max(0, Math.min(100, next)));

      if (confessionFrame >= confessionFrames) {
        clearInterval(confessionTimer);
        setAnimatedConfessionRate(safeConfessionRate);
      }
    }, 24);

    const intimacyTimer = setInterval(() => {
      intimacyFrame += 1;
      const p = intimacyFrame / intimacyFrames;
      const eased = 1 - Math.pow(1 - p, 3);
      const overshoot =
        p < 0.76 ? 0 : Math.sin((p - 0.76) * Math.PI * 3) * 5.2 * (1 - p);
      const next = Math.round(safeIntimacyLevel * eased + overshoot);
      setAnimatedIntimacyLevel(Math.max(0, Math.min(100, next)));

      if (intimacyFrame >= intimacyFrames) {
        clearInterval(intimacyTimer);
        setAnimatedIntimacyLevel(safeIntimacyLevel);
      }
    }, 24);

    return () => {
      clearInterval(confessionTimer);
      clearInterval(intimacyTimer);
    };
  }, [fortune, safeConfessionRate, safeIntimacyLevel]);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setShowIntroOverlay(false);
      setCurrentStep('score');
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
    };
  }, []);

  const scoreGlowClass =
    safeFinalScore >= 90
      ? 'drop-shadow-[0_0_18px_rgba(251,191,36,0.5)]'
      : safeFinalScore >= 80
      ? 'drop-shadow-[0_0_18px_rgba(236,72,153,0.45)]'
      : 'drop-shadow-[0_0_18px_rgba(168,85,247,0.4)]';

  const LockedSection = ({
    stepKey,
    title,
    subtitle,
    previewTitle,
    previewText,
    accent,
  }: {
    stepKey: RevealStep;
    title: string;
    subtitle: string;
    previewTitle: string;
    previewText: string;
    accent: string;
  }) => (
    <motion.section
      key={stepKey}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="mb-8"
    >
      <div className="bg-[#160a2b]/88 border border-white/10 rounded-[32px] p-6 shadow-2xl backdrop-blur-xl overflow-hidden relative">
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">
            premium locked
          </p>
          <h3 className="text-2xl font-black leading-tight mb-2">{title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{subtitle}</p>
        </div>

        <div className="relative rounded-[28px] border border-white/10 bg-white/[0.04] p-6 min-h-[280px] overflow-hidden">
          <div className="pointer-events-none select-none">
            <div className="space-y-5 blur-[6px] opacity-40">
              <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                <h4 className={`text-lg font-black mb-3 ${accent}`}>{previewTitle}</h4>
                <p className="text-sm text-gray-100 leading-relaxed">{previewText}</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                <div className="h-4 w-40 rounded-full bg-white/10 mb-4" />
                <div className="space-y-3">
                  <div className="h-3 rounded-full bg-white/10 w-full" />
                  <div className="h-3 rounded-full bg-white/10 w-[92%]" />
                  <div className="h-3 rounded-full bg-white/10 w-[84%]" />
                  <div className="h-3 rounded-full bg-white/10 w-[76%]" />
                </div>
              </div>

              <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                <div className="h-4 w-28 rounded-full bg-white/10 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-2xl bg-white/10" />
                  <div className="h-24 rounded-2xl bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13091f]/72 to-[#13091f]/98" />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(168,85,247,0.22)]">
                🔒
              </div>

              <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">
                この先を解放
              </p>

              <h4 className="text-2xl font-black mb-3 leading-tight">
                相手の本音・未来・結論は
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-[#f9a620] to-cyan-300 bg-clip-text text-transparent">
                  この先にあります
                </span>
              </h4>

              <p className="text-sm text-gray-200 leading-relaxed mb-5">
                ここから先では、
                <br />
                ・相手が今あなたに抱いている本音
                <br />
                ・関係が動く決定的な流れ
                <br />
                ・このご縁の結論
                <br />
                をすべて見ることができます。
              </p>

              <div className="rounded-3xl border border-pink-400/20 bg-gradient-to-r from-pink-500/12 via-purple-500/10 to-indigo-500/12 p-4 mb-5">
                <p className="text-xs text-white leading-relaxed font-semibold">
                  続きを解放して、
                  <br />
                  本当の答えを確認してください。
                </p>
              </div>

              <button
                onClick={openPaidPage}
                className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-black text-white shadow-[0_18px_50px_rgba(236,72,153,0.3)] active:scale-95 transition-all"
              >
                本音・未来・結論をすべて見る
              </button>

              <p className="mt-3 text-[11px] text-gray-400">
                続きは有料版で解放されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );

  if (!data) {
    return (
      <div className="min-h-screen bg-[#05020a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#13091f]/80 p-8 text-center shadow-2xl">
          <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">
            free result
          </p>
          <h1 className="text-2xl font-black mb-3">鑑定データがありません</h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            先に入力画面から鑑定を行ってください。
          </p>
          <button
            onClick={() => navigate('/compatibility-free')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white"
          >
            入力画面へ戻る
          </button>
        </div>
      </div>
    );
  }

  if (!fortune) {
    return (
      <div className="min-h-screen bg-[#05020a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#13091f]/80 p-8 text-center shadow-2xl">
          <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-3 uppercase">
            free result
          </p>
          <h1 className="text-2xl font-black mb-3">鑑定結果を生成できませんでした</h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            入力内容を確認して、もう一度お試しください。
          </p>
          <button
            onClick={() => navigate('/compatibility-free')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white"
          >
            入力画面へ戻る
          </button>
        </div>
      </div>
    );
  }

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
              <h2 className="text-3xl font-black mb-3 leading-tight">
                あなたと<span className="text-[#f9a620]">{safePartnerName}</span>の
                <br />
                無料鑑定を開始します
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed mb-8">
                まずは相性スコアだけを無料で確認できます。
                この先の本音・未来・結論は有料版で解放されます。
              </p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={skipIntro}
                className="px-5 py-3 rounded-full border border-white/15 bg-white/5 text-xs tracking-widest text-gray-200 active:scale-95"
              >
                無料で見る
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
                {safeDisplayDate} 無料鑑定
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
              const isLocked = step !== 'score';

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
                  {STEP_LABELS[step]} {isLocked ? '🔒' : ''}
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
            <span className="text-[#f9a620]">{safePartnerName}</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-[10px] tracking-widest font-bold">鑑定番号: MS-2026-V3</p>
            <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-purple-200">
              関係性：{safeRelationship}
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
                    <div className="relative w-44 h-44 flex items-center justify-center">
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
                          transition={{ duration: 2.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </svg>

                      <div className="absolute text-center">
                        <span className="text-6xl font-black italic tracking-tighter">{score}</span>
                        <span className="text-base font-bold block -mt-2">点</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left">
                      <p className="text-[10px] text-pink-300 font-bold mb-1 tracking-wider uppercase">告白成功率</p>
                      <div className="text-2xl font-black text-white mb-2">
                        {animatedConfessionRate}
                        <span className="text-xs ml-0.5">%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 origin-left"
                          style={{ width: `${animatedConfessionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#1a0e2d]/70 border border-white/10 rounded-[22px] p-4 text-center shadow-xl backdrop-blur-sm origin-left">
                      <p className="text-[10px] text-blue-300 font-bold mb-1 tracking-wider uppercase">二人の親密度</p>
                      <div className="text-2xl font-black text-white mb-2">
                        {animatedIntimacyLevel}
                        <span className="text-xs ml-0.5">%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 origin-left"
                          style={{ width: `${animatedIntimacyLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] tracking-[0.35em] text-purple-300 mb-2 uppercase">
                    special reading
                  </p>
                  <h2 className="text-xl font-black mb-3 leading-tight">
                    二人の波動は、
                    <span className="bg-gradient-to-r from-pink-400 via-[#f9a620] to-cyan-300 bg-clip-text text-transparent">
                      {safeFinalScore >= 90
                        ? '強く結びついています'
                        : safeFinalScore >= 80
                        ? '美しく共鳴しています'
                        : safeFinalScore >= 70
                        ? '静かに引き合っています'
                        : '変化の途中にあります'}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    あなたの入力情報から導かれたこの数値は、
                    {safePartnerName}さんとの今の関係性・感情の温度を総合したものです。
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[28px] border border-pink-400/15 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-5 text-center">
                  <p className="text-[10px] tracking-[0.28em] text-pink-300 mb-2 uppercase">
                    free preview
                  </p>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    無料版ではここまで確認できます。
                    この先で、相手の本音・二人の未来・結論が解放されます。
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
                  >
                    相手の本音を少しだけ見る
                  </button>

                  <button
                    onClick={openPaidPage}
                    className="w-full py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md"
                  >
                    すべての鑑定結果を見る
                  </button>

                  <button
                    onClick={handleBackToTop}
                    className="w-full py-4 rounded-full border border-white/15 bg-white/5 font-black text-gray-200 active:scale-95 transition-all"
                  >
                    入力画面に戻る
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {currentStep === 'emotion' && (
            <LockedSection
              stepKey="emotion"
              title="相手の本音"
              subtitle="ここから先では、相手が今あなたに抱いている本当の気持ちが明らかになります。"
              previewTitle="本音の入口"
              previewText="相手が今あなたに抱いている本当の気持ちは、この先で明らかになります。"
              accent="text-pink-300"
            />
          )}

          {currentStep === 'destiny' && (
            <LockedSection
              stepKey="destiny"
              title="運命分析"
              subtitle="このご縁が偶然なのか、それとも深い意味を持つのか。その核心は有料版で確認できます。"
              previewTitle="運命の入口"
              previewText="二人の関係には特別な流れがあります。その核心はこの先で解放されます。"
              accent="text-[#f9a620]"
            />
          )}

          {currentStep === 'detail' && (
            <LockedSection
              stepKey="detail"
              title="詳細分析"
              subtitle="姓名・星座・血液・五行から多角的に読み解く、深い相性分析はここから先です。"
              previewTitle="詳細分析の入口"
              previewText="深い相性分析の全貌は、この先で確認できます。"
              accent="text-cyan-300"
            />
          )}

          {currentStep === 'biorhythm' && (
            <LockedSection
              stepKey="biorhythm"
              title="週間バイオリズム"
              subtitle="関係が動く日、近づくべき日、慎重になるべき日。その流れはこの先で確認できます。"
              previewTitle="流れの入口"
              previewText="関係が動く決定的なタイミングはこの先にあります。"
              accent="text-emerald-300"
            />
          )}

          {currentStep === 'final' && (
            <LockedSection
              stepKey="final"
              title="結論"
              subtitle="このご縁を進めるべきか、待つべきか。その答えは最後の結論にあります。"
              previewTitle="結論の入口"
              previewText="この関係の結論は、この先で明らかになります。"
              accent="text-purple-300"
            />
          )}
        </AnimatePresence>

        {currentStep !== 'score' && (
          <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
            <div className="max-w-md mx-auto">
              <button
                onClick={openPaidPage}
                className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-black text-white shadow-[0_18px_50px_rgba(236,72,153,0.28)] active:scale-95 transition-all"
              >
                続きの鑑定をすべて見る
              </button>
            </div>
          </div>
        )}
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
                  <h3 className="text-purple-400 font-black mb-1">1. 無料版について</h3>
                  <p>
                    無料版では、相性スコア・告白成功率・親密度まで確認できます。
                    この先の本音・未来・結論は有料版で解放されます。
                  </p>
                </section>

                <section>
                  <h3 className="text-[#f9a620] font-black mb-1">2. 鑑定の流れ</h3>
                  <p>
                    この鑑定は「点数 → 本音 → 運命 → 分析 → 流れ → 結論」の順で構成されています。
                    無料版では、最初に二人の相性の核だけを体験できます。
                  </p>
                </section>

                <section>
                  <h3 className="text-pink-400 font-black mb-1">3. 無料で見られる範囲</h3>
                  <p>
                    無料版では、最初のスコア表示のみ公開されます。
                    それ以降の鑑定内容はロックされており、有料版でのみ確認できます。
                  </p>
                </section>

                <section>
                  <h3 className="text-blue-400 font-black mb-1">4. 有料版で分かること</h3>
                  <p>
                    有料版では、相手の本音、関係が動く流れ、詳細分析、最後の結論まで解放されます。
                  </p>
                </section>

                <section>
                  <h3 className="text-rose-300 font-black mb-1">5. プライバシー</h3>
                  <p>
                    ご入力いただいた情報はクラウド上には保存されず、
                    お使いのスマートフォンやブラウザ内部にのみ保持されます。
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
