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

const STEP_LABELS = {
  score: '点数',
  emotion: '本音',
  destiny: '運命',
  detail: '分析',
  biorhythm: '流れ',
  final: '結論',
};

// ★ noteリンク
const PAID_URL = 'https://note.com/like_swan6953/n/nf547dbe67453';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const [data] = useState<any>(() => {
    try {
      if (location.state) {
        localStorage.setItem('last_fortune_data', JSON.stringify(location.state));
        return location.state;
      }
      const saved = localStorage.getItem('last_fortune_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentStep, setCurrentStep] = useState<RevealStep>('intro');
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);

  const fortune = useMemo(() => {
    if (!data) return null;
    return buildFortuneBundle(data);
  }, [data]);

  // ---------------------------
  // 🔥 重要：noteへ飛ばす
  // ---------------------------
  const openPaidPage = () => {
    window.open(PAID_URL, '_blank');
  };

  // ---------------------------
  // 🔥 トップへ戻る
  // ---------------------------
  const handleBackToTop = () => {
    navigate('/compatibility-free');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    topAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStep === 'score') {
      setCurrentStep('emotion');
      setTimeout(scrollToTop, 50);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setShowIntroOverlay(false);
      setCurrentStep('score');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!fortune) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        データなし
      </div>
    );
  }

  const LockedSection = ({ title }: { title: string }) => (
    <div className="bg-[#160a2b] p-6 rounded-2xl mb-6 text-center">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="blur-sm opacity-40 mb-6">
        ここに本来の鑑定内容が表示されます
      </div>

      {/* ▼ noteボタン */}
      <button
        onClick={openPaidPage}
        className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-bold mb-3"
      >
        本音・未来・結論をすべて見る
      </button>

      {/* ▼ トップ戻る */}
      <button
        onClick={handleBackToTop}
        className="w-full py-4 rounded-full border border-white/20 bg-white/5"
      >
        無料鑑定トップに戻る
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05020a] text-white p-4">
      <div ref={topAnchorRef} />

      {/* ----------- Intro ----------- */}
      <AnimatePresence>
        {showIntroOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                無料鑑定を開始します
              </h2>
              <button
                onClick={() => {
                  setShowIntroOverlay(false);
                  setCurrentStep('score');
                }}
                className="px-6 py-3 border"
              >
                見る
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------- Header ----------- */}
      <h1 className="text-2xl font-bold mb-4">
        あなた × {fortune.partnerName}
      </h1>

      {/* ----------- Step ----------- */}
      {currentStep === 'score' && (
        <div className="mb-6">
          <div className="text-4xl font-bold text-center mb-4">
            {fortune.finalScore}点
          </div>

          <button
            onClick={handleNextStep}
            className="w-full py-4 bg-purple-600 rounded-full"
          >
            本音を見る
          </button>

          {/* ▼ ここにも戻るボタン */}
          <button
            onClick={handleBackToTop}
            className="w-full mt-3 py-4 border rounded-full"
          >
            入力画面に戻る
          </button>
        </div>
      )}

      {currentStep === 'emotion' && <LockedSection title="相手の本音" />}
      {currentStep === 'destiny' && <LockedSection title="運命" />}
      {currentStep === 'detail' && <LockedSection title="分析" />}
      {currentStep === 'biorhythm' && <LockedSection title="流れ" />}
      {currentStep === 'final' && <LockedSection title="結論" />}
    </div>
  );
};

export default ResultPage;
