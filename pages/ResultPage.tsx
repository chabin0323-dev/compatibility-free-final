import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildFortuneBundle } from '../services/fortuneEngine';

const NOTE_URL = 'https://note.com/your-note';

type TabKey = 'score' | 'feeling' | 'destiny' | 'analysis' | 'flow' | 'final';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'score', label: '点数' },
  { key: 'feeling', label: '本音' },
  { key: 'destiny', label: '運命' },
  { key: 'analysis', label: '分析' },
  { key: 'flow', label: '流れ' },
  { key: 'final', label: '結論' },
];

function percentBar(value: number, colorClass: string) {
  return (
    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function buildHeadline(score: number) {
  if (score >= 86) return '二人の波動は、美しく共鳴しています';
  if (score >= 76) return '二人の縁は、静かに強く結びついています';
  if (score >= 66) return '二人の関係は、動き方次第で深まる流れです';
  return '二人の関係は、慎重に育てるほど光ります';
}

function buildLead(score: number, partnerName: string) {
  if (score >= 86) {
    return `あなたの入力情報から導かれた数値は、${partnerName}さんとの今の関係性・感情の温度・未来の流れを総合したものです。`;
  }
  if (score >= 76) {
    return `この結果は、${partnerName}さんとの相性だけでなく、今の距離感や動くべき順番まで含めて読み解いたものです。`;
  }
  return `この数値は、${partnerName}さんとの関係性をもとに、今の空気感・親密度・未来の流れを分析した結果です。`;
}

function getScoreRingStyle(score: number) {
  const deg = Math.round((Math.max(0, Math.min(100, score)) / 100) * 360);
  return {
    background: `conic-gradient(#ec4899 0deg ${deg}deg, rgba(255,255,255,0.08) ${deg}deg 360deg)`,
  };
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ sessionId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('score');

  const inputState = (location.state ?? null) as any;

  useEffect(() => {
    if (!inputState) {
      navigate('/compatibility-free', { replace: true });
    }
  }, [inputState, navigate]);

  const bundle = useMemo(() => {
    if (!inputState) return null;
    return buildFortuneBundle(inputState);
  }, [inputState]);

  if (!bundle) return null;

  const handlePaid = () => {
    window.location.href = NOTE_URL;
  };

  const scoreHeadline = buildHeadline(bundle.finalScore);
  const scoreLead = buildLead(bundle.finalScore, bundle.partnerName);
  const sessionLabel = params.sessionId ? `MS-${new Date().getFullYear()}-V3` : 'MS-2026-V3';

  return (
    <div className="min-h-screen bg-[#0a0612] text-white px-4 py-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="rounded-full border border-[#ff8b5e]/30 bg-gradient-to-r from-[#2b120d] to-[#0d2731] px-5 py-3 shadow-lg">
              <div className="text-[11px] tracking-[0.22em] text-[#ff996f]">
                {bundle.displayDate} 鑑定書
              </div>
            </div>

            <button
              onClick={() => navigate('/compatibility-free')}
              className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.05] flex items-center justify-center text-xl shadow-lg"
            >
              🎟️
            </button>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-5">
            <div className="h-full w-[28%] bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold border transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-purple-500 border-purple-300/40 text-white shadow-lg'
                      : 'bg-white/[0.06] border-white/10 text-white/90'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mb-3 text-[11px] tracking-[0.35em] text-white/70">
            ONLY FOR YOU
          </div>

          <div className="mb-3">
            <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight">
              あなた <span className="text-white/35">&amp;</span>{' '}
              <span className="text-[#ffb21c]">{bundle.partnerName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm mb-8">
            <div className="text-white/45">鑑定番号: {sessionLabel}</div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white/90">
              関係性：{bundle.relationship}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-gradient-to-b from-[#160424] to-[#0b0617] px-5 py-8 shadow-[0_0_50px_rgba(168,85,247,0.09)]">
            <div className="text-center text-[12px] tracking-[0.38em] text-white/65 mb-7">
              DESTINY SCORE
            </div>

            <div className="grid grid-cols-[1.2fr_1fr] gap-4 items-center mb-10">
              <div className="flex items-center justify-center">
                <div
                  className="w-[220px] h-[220px] rounded-full p-[16px] shadow-[0_0_40px_rgba(236,72,153,0.18)]"
                  style={getScoreRingStyle(bundle.finalScore)}
                >
                  <div className="w-full h-full rounded-full bg-[#17071f] border border-white/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[72px] leading-none font-bold">{bundle.finalScore}</div>
                      <div className="text-[24px] font-bold mt-1">点</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5">
                  <div className="text-sm font-bold text-center text-white mb-3">告白成功率</div>
                  <div className="text-[24px] font-bold text-center mb-4">
                    {bundle.confessionRate}%
                  </div>
                  {percentBar(bundle.confessionRate, 'bg-gradient-to-r from-pink-500 to-rose-400')}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5">
                  <div className="text-sm font-bold text-center text-white mb-3">二人の親密度</div>
                  <div className="text-[24px] font-bold text-center mb-4">
                    {bundle.intimacyLevel}%
                  </div>
                  {percentBar(
                    bundle.intimacyLevel,
                    'bg-gradient-to-r from-blue-500 to-cyan-400'
                  )}
                </div>
              </div>
            </div>

            <div className="text-center text-[12px] tracking-[0.35em] text-white/65 mb-4">
              SPECIAL READING
            </div>

            <h2 className="text-center text-[26px] leading-tight font-bold mb-5">
              二人の波動は、<span className="text-pink-400">美しく</span>
              <span className="text-orange-300">共鳴</span>
              <span className="text-emerald-300">しています</span>
            </h2>

            <p className="text-center text-[16px] leading-8 text-white/85 max-w-[520px] mx-auto">
              {scoreLead}
            </p>
          </div>

          <button
            onClick={handlePaid}
            className="w-full mt-8 rounded-full py-5 text-[20px] font-bold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 shadow-[0_12px_35px_rgba(217,70,239,0.3)] active:scale-[0.98] transition-transform"
          >
            相手の本音へ進む
          </button>

          <div className="mt-4 text-center text-sm text-white/55 leading-7">
            この先では、相手の本音・二人の未来・動くべき時期・最終結論まで確認できます。
          </div>

          <div className="h-8" />
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
