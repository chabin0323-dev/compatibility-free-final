import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreePage: React.FC = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [loading, setLoading] = useState(false);

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.name1 || !names.name2) return;

    setLoading(true);

    // AIを呼ばずに、3秒待ってから「無料版の結果」へ進む
    setTimeout(() => {
      setLoading(false);
      // 結果ページへ移動（お試し用の固定データを渡す）
      navigate('/result', { 
        state: { 
          result: "お二人の基本的な相性は『良好』です！✨\n\nお試し版ではここまでとなります。\n有料版では、最新AIがさらに深い「二人の運命」や「具体的なアドバイス」を1,000文字以上の大ボリュームで診断します！",
          isFree: true 
        } 
      });
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          無料お試し相性診断
        </h2>
        
        <form onSubmit={handleDiagnose} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">あなたのお名前</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
              placeholder="例：太郎"
              value={names.name1}
              onChange={(e) => setNames({ ...names, name1: e.target.value })}
              required
            />
          </div>
          
          <div className="flex justify-center text-pink-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">お相手のお名前</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
              placeholder="例：花子"
              value={names.name2}
              onChange={(e) => setNames({ ...names, name2: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-gray-400' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
            }`}
          >
            {loading ? 'AIが診断中...' : '無料で診断する'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
          ※これは無料お試し版です。<br />
          より詳細な診断結果は有料版（公式サイト）をご利用ください。
        </p>
      </div>
    </div>
  );
};

export default FreePage;
