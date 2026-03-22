import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildFortuneBundle, type ActiveTabKey } from '../services/fortuneEngine';

// noteリンク
const PAID_URL = 'https://note.com/like_swan6953/n/n3ff33326e2a3';

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
      return truncateText(
        `今、${fortune.partnerName}さんの心には、あなたを無視できない感情の揺れが出ています。${fortune.tabs.blood.content}`,
        96
      );

    case 'destiny':
      return truncateText(
        `このご縁は偶然より深い意味を持っています。${fortune.destinyAnalysis.content}`,
        96
      );

    case 'detail':
      return truncateText(
        `${fortune.tabs.name.title}。${fortune.tabs.name.content}`,
        96
      );

    case 'biorhythm':
      return truncateText(
        `今週は動いて良い日と慎重にしたい日の差が出やすい流れです。${fortune.biorhythmData[0]?.note ?? ''}`,
        96
      );

    case 'final':
      return truncateText(
        `${fortune.actionGuide} この恋をどう動かすべきかの最終判断がここにあります。`,
        96
      );

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
}> = ({ title, subtitle, preview, buttonLabel, onOpenPaid }) => {
  return (
    <div className="bg-[#1a0e2d]/80 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] tracking-[0.35em] text-pink-300 mb-3 uppercase">
        locked reading
      </p>

      <h3 className="text-2xl font-black mb-4 leading-tight">{title}</h3>

      <p className="text-sm text-gray-300 leading-relaxed mb-5">{subtitle}</p>

      <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 overflow-hidden mb-6">
        <div className="blur-[4px] select-none pointer-events-none">
          <p className="text-sm text-gray-200 leading-relaxed">{preview}</p>
          <p className="text-sm text-gray-200 leading-relaxed mt-3">
            この先では、相手の本音・二人の未来・動くべき時期・最終結論まで深く読み解かれます。
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12091f]/35 to-[#12091f]/82" />

        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <div className="px-4 py-2 rounded-full bg-black/45 border border-white/15 text-xs font-black text-purple-100 backdrop-blur-md">
            🔒 ここから先は有料版で公開
          </div>
        </div>
      </div>

      <button
        onClick={onOpenPaid}
        className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 font-black text-white shadow-[0_14px_40px_rgba(168,85,247,0.35)] active:scale-95 transition-all"
      >
        {buttonLabel}
      </button>
    </div>
  );
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

  const openPaid = () => {
    window.location.href = PAID_URL;
  };

  const handleBackToTop = () => {
    navigate('/compatibility-free', {
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
    const hideTimer = setTimeout(() => {
      setShowIntroOverlay(false);
      setCurrentStep('score');
    }, 5000);

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

  return (
    <div className="min-h-screen bg-[#05020a] text-white p-4 font-sans relative overflow-x-hidden">
      <div ref={topAnchorRef} />

      <div className="max-w-md mx-auto relative z-10 pb-28">
        {/* 途中省略 */}

        <AnimatePresence mode="wait">
          {currentStep === 'score' && (
            <motion.section
              key="score"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mb-8"
            >
              {/* スコア表示部分はそのまま */}

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
              <LockedPanel
                title={`${fortune.partnerName}さんの本音は、この先で明らかになります`}
                subtitle="今、相手があなたをどう見ているか。好意・迷い・距離感の核心は有料版で公開されます。"
                preview={getPreviewText('emotion', fortune)}
                buttonLabel="相手の本音を開く"
                onOpenPaid={openPaid}
              />

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 rounded-full bg-white/8 border border-white/15 font-black text-gray-200 active:scale-95 transition-all backdrop-blur-md"
                >
                  運命分析の予告を見る
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultPage;
