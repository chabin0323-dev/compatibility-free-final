import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type UsageManualProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UsageManual: React.FC<UsageManualProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-5 text-left"
        >
          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            className="bg-[#1a0e2d] border border-purple-500/40 w-full max-w-sm rounded-[30px] p-6 relative shadow-[0_0_50px_rgba(168,85,247,0.35)]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-purple-300 mb-5">🔖 取扱説明書</h2>

            <div className="space-y-5 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-[58vh] pr-2">
              <section>
                <h3 className="text-purple-400 font-black mb-1">1. ご利用方法</h3>
                <p>
                  必要な情報を入力すると、あなたとお相手の相性・本音・運命の流れを総合的に鑑定できます。
                  入力後は結果画面で「点数 → 本音 → 運命 → 分析 → 流れ → 結論」の順に読み進められます。
                </p>
              </section>

              <section>
                <h3 className="text-[#f9a620] font-black mb-1">2. 鑑定結果の見方</h3>
                <p>
                  結果画面では、相性スコアが特別演出とともに表示されます。
                  告白成功率・二人の親密度・詳細分析・週間バイオリズムまで、同じ入力情報から一貫して算出されています。
                </p>
              </section>

              <section>
                <h3 className="text-pink-400 font-black mb-1">3. 詳細分析について</h3>
                <p>
                  「姓名・星座・血液・五行」の4つの視点から相性を読み解けます。
                  選択中の項目は発光表示され、現在見ている分析内容が分かりやすくなっています。
                </p>
              </section>

              <section>
                <h3 className="text-blue-400 font-black mb-1">4. 週間バイオリズム</h3>
                <p>
                  週間バイオリズムでは、各日付ごとの流れを日付単位で確認できます。
                  星の数・スコア・注意点は、その日そのものの運気に基づいて表示されます。
                </p>
              </section>

              <section>
                <h3 className="text-emerald-400 font-black mb-1">5. 導入演出について</h3>
                <p>
                  鑑定開始時には、あなたとお相手の運命解析を始める導入演出が表示されます。
                  「すぐに見る」を押すと、その場で結果画面へ進めます。
                </p>
              </section>

              <section>
                <h3 className="text-yellow-300 font-black mb-1">6. 鑑定結果の特徴</h3>
                <p>
                  この鑑定結果は、入力された情報をもとに一貫したロジックで生成されています。
                  同じ条件なら同じ結果になり、日付が変わればその日の流れに応じて内容も変化します。
                </p>
              </section>

              <section>
                <h3 className="text-rose-300 font-black mb-1">7. プライバシー</h3>
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
              onClick={onClose}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-black text-white shadow-lg"
            >
              理解しました
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsageManual;
