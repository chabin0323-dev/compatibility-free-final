
import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildFortuneBundle } from '../services/fortuneEngine';

const NOTE_URL = 'https://note.com/your-note';

type ScoreCardProps = {
  label: string;
  value: string;
  sub?: string;
};

type LockedCardProps = {
  title: string;
  description: string;
};

const ScoreCard: React.FC<ScoreCardProps> = ({ label, value, sub }) => {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 shadow-xl">
      <div className="text-[11px] tracking-wide text-gray-400 mb-2">{label}</div>
      <div className="text-3xl font-bold text-white leading-none">{value}</div>
      {sub ? <div className="mt-2 text-[11px] text-gray-500">{sub}</div> : null}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({
  children,
  sub,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-white">{children}</h2>
      {sub ? <p className="mt-1 text-sm text-gray-400 leading-6">{sub}</p> : null}
    </div>
  );
};

const LockedCard: React.FC<LockedCardProps> = ({ title, description }) => {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-purple-200">
          🔒 非公開
        </div>
      </div>

      <p className="text-sm leading-6 text-gray-300 mb-4">{description}</p>

      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-4">
        <div className="space-y-2 blur-[4px] select-none pointer-events-none">
          <div className="h-3 rounded-full bg-white/15 w-[92%]" />
          <div className="h-3 rounded-full bg-white/15 w-[86%]" />
          <div className="h-3 rounded-full bg-white/15 w-[78%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0612]/20 to-[#0a0612]/55" />
      </div>
    </div>
  );
};

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ sessionId: string }>();

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

  const sessionId = params.sessionId ?? '';

  if (!bundle) return null;

  const handleOpenPaid = () => {
    window.location.href = NOTE_URL;
  };

  const todaySummary =
    bundle.confessionRate >= 55
      ? '惹かれ合う要素はありますが、今は勢いよりも動く順番が結果を左右しやすい流れです。'
      : '相性そのものは悪くありませんが、今は気持ちの強さより距離の詰め方が重要な状態です。';

  const biorhythmPreview = bundle.biorhythmData.map((item) => {
    const shortNote = item.note.split('。')[0] + '。';
    return {
      ...item,
      shortNote,
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0612] text-white px-4 py-6">
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-5">
            <div className="text-[11px] tracking-[0.18em] text-purple-300/90 mb-2">
              無料鑑定結果
            </div>
            <h1 className="text-[28px] font-bold leading-tight">
              二人の相性を
              <br />
              分析しました
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {bundle.displayDate} / {bundle.partnerName}さんとの{bundle.relationship}鑑定
            </p>
            {sessionId ? (
              <p className="mt-1 text-[10px] text-gray-600">session: {sessionId}</p>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#24113d]/90 to-[#120a20]/90 p-5 shadow-2xl mb-5">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <ScoreCard label="総合相性" value={`${bundle.finalScore}点`} />
              <ScoreCard label="告白成功率" value={`${bundle.confessionRate}%`} />
              <ScoreCard label="現在の親密度" value={`${bundle.intimacyLevel}点`} />
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] tracking-wide text-pink-300 mb-2">一言総評</div>
              <p className="text-sm leading-7 text-gray-200">{todaySummary}</p>

              <button
                onClick={handleOpenPaid}
                className="mt-4 text-sm font-bold text-purple-300"
              >
                本音と未来の続きも見る →
              </button>
            </div>
          </div>

          <div className="mb-6">
            <SectionTitle sub="無料版では、今の状態と今週の流れまで確認できます。">
              今の二人の状態
            </SectionTitle>

            <div className="space-y-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm font-bold text-pink-300 mb-2">今の空気感</div>
                <p className="text-sm leading-7 text-gray-200">
                  今の二人は、強く押すよりも安心感を積み重ねることで流れが整いやすい状態です。
                  {bundle.advice}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm font-bold text-blue-300 mb-2">すれ違いやすいポイント</div>
                <p className="text-sm leading-7 text-gray-200">
                  焦って答えを求めると、相手側に慎重さが出やすい流れがあります。
                  今は結果を急ぐより、自然な会話の余韻を残す方が印象が良くなりやすいです。
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm font-bold text-emerald-300 mb-2">今の関係で大事なこと</div>
                <p className="text-sm leading-7 text-gray-200">
                  この関係は、勢いよりも相手が安心できる流れ作りが鍵です。
                  今は結論を急ぐより、信頼を崩さない接し方が関係を前に進めます。
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <SectionTitle sub="動いてよい日と慎重にしたい日の差が出やすい1週間です。">
              今週の恋愛バイオリズム
            </SectionTitle>

            <div className="space-y-3">
              {biorhythmPreview.map((item) => (
                <div
                  key={item.date}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="text-sm font-bold text-white">{item.date}</div>
                    <div className="text-base tracking-[0.18em]">
                      {'★'.repeat(item.activeStars)}
                      <span className="text-white/20">{'★'.repeat(item.inactiveStars)}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-gray-300">{item.shortNote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <SectionTitle sub="無料版では見えない、本音・未来・時期・結論まで確認できます。">
              ここから先は核心鑑定です
            </SectionTitle>

            <div className="space-y-3">
              <LockedCard
                title="相手の本音"
                description="今、相手があなたをどう見ているか。好意・迷い・距離感を深く読み解きます。"
              />
              <LockedCard
                title="二人の未来"
                description="この関係がこの先どう進みやすいか。進展・停滞・変化の流れを見ます。"
              />
              <LockedCard
                title="関係が動くタイミング"
                description="連絡・再接近・距離が縮まりやすい時期を具体的に確認できます。"
              />
              <LockedCard
                title="告白していい時期"
                description="今動くべきか、待つべきか。告白の向き不向きまで読み解きます。"
              />
              <LockedCard
                title="成功率を上げる方法"
                description="今のあなたに必要な接し方、避けたい動き方、距離の縮め方を見ます。"
              />
              <LockedCard
                title="この恋の最終結論"
                description="この恋を進めるべきか、慎重に見るべきか。最終的な判断をまとめます。"
              />
            </div>
          </div>

          <div className="rounded-[30px] border border-purple-400/20 bg-gradient-to-br from-purple-500/12 to-indigo-500/12 p-5 shadow-2xl mb-5">
            <div className="text-sm text-purple-200 mb-2">
              無料版では公開していない核心部分まで確認できます。
            </div>
            <button
              onClick={handleOpenPaid}
              className="w-full rounded-full py-4 text-base font-bold bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xl shadow-purple-900/40 active:scale-[0.98] transition-transform"
            >
              相手の本音と、この恋の結論を見る
            </button>
            <p className="mt-3 text-xs leading-6 text-gray-400 text-center">
              甘いだけではない、現実寄りの深掘り鑑定です。
            </p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 mb-5">
            <div className="text-base font-bold text-white mb-2">有料版で分かること</div>
            <p className="text-sm leading-7 text-gray-300">
              相手の本音、二人の未来、関係が動く時期、告白タイミング、成功率を上げる行動、
              そしてこの恋の結論までまとめて確認できます。
            </p>

            <button
              onClick={handleOpenPaid}
              className="w-full mt-4 rounded-full py-4 text-base font-bold bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xl shadow-purple-900/40 active:scale-[0.98] transition-transform"
            >
              相手の本音と、この恋の結論を見る
            </button>
          </div>

          <button
            onClick={() => navigate('/compatibility-free')}
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 text-sm font-bold text-gray-300"
          >
            入力画面に戻る
          </button>

          <div className="h-8" />
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
