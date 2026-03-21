import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

// noteリンク
const PAID_URL = 'https://note.com/like_swan6953/n/nf547dbe67453';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const topAnchorRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<RevealStep>('intro');
  const [showIntroOverlay, setShowIntroOverlay] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      let nextData = null;

      if (location.state) {
        nextData = location.state;
        sessionStorage.setItem('free_result_data', JSON.stringify(location.state));
      } else {
        const saved = sessionStorage.getItem('free_result_data');
        nextData = saved ? JSON.parse(saved) : null;
      }

      setData(nextData);
    } catch {
      setData(null);
    }
  }, [sessionId, location.state]);

  const fortune = useMemo(() => {
    if (!data) return null;
    return buildFortuneBundle(data);
  }, [data]);

  const handleBackToTop = () => {
    navigate('/compatibility-free');
  };

  const openPaidPage = () => {
    window.open(PAID_URL, '_blank');
  };

  const skipIntro = () => {
    setShowIntroOverlay(false);
    setCurrentStep('score');
  };

  const handleNextStep = () => {
    setCurrentStep('emotion');
  };

  // =========================
  // 🔒 ロックUI（ここが重要）
  // =========================
  const LockedSection = ({ title }: { title: string }) => (
    <div className="mb-8">
      <div className="bg-[#160a2b]/88 border border-white/10 rounded-[32px] p-6 text-center">
        <h3 className="text-2xl font-black mb-4">{title}</h3>

        <div className="mb-4 text-gray-300">
          この先は有料版で解放されます
        </div>

        {/* NOTEへ */}
        <button
          onClick={openPaidPage}
          className="w-full py-4 mb-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-black text-white"
        >
          本音・未来・結論をすべて見る
        </button>

        {/* 👇 追加（トップへ戻る） */}
        <button
          onClick={handleBackToTop}
          className="w-full py-4 rounded-full border border-white/15 bg-white/5 font-black text-gray-200"
        >
          無料鑑定トップに戻る
        </button>
      </div>
    </div>
  );

  if (!data || !fortune) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        データなし
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05020a] text-white p-4">
      <div ref={topAnchorRef} />

      {/* intro */}
      <AnimatePresence>
        {showIntroOverlay && (
          <div className="fixed inset-0 bg-black flex items-center justify-center">
            <button onClick={skipIntro}>無料で見る</button>
          </div>
        )}
      </AnimatePresence>

      {/* score */}
      {currentStep === 'score' && (
        <div>
          <h2 className="text-3xl mb-6">
            {fortune.partnerName}との相性
          </h2>

          <div className="text-6xl mb-6">{fortune.finalScore}点</div>

          <button
            onClick={handleNextStep}
            className="w-full py-4 bg-purple-600 rounded-full"
          >
            本音を見る
          </button>

          {/* 👇 ここにも戻る追加 */}
          <button
            onClick={handleBackToTop}
            className="w-full py-4 mt-3 border border-white/20 rounded-full"
          >
            トップに戻る
          </button>
        </div>
      )}

      {/* ロック部分 */}
      {currentStep === 'emotion' && (
        <LockedSection title="相手の本音" />
      )}
      {currentStep === 'destiny' && (
        <LockedSection title="運命" />
      )}
      {currentStep === 'detail' && (
        <LockedSection title="分析" />
      )}
      {currentStep === 'biorhythm' && (
        <LockedSection title="流れ" />
      )}
      {currentStep === 'final' && (
        <LockedSection title="結論" />
      )}
    </div>
  );
};

export default ResultPage;
