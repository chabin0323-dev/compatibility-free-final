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

    // APIキーを使わずに、AIが考えているような「待ち時間」だけを作ります
    setTimeout(() => {
      setLoading(false);
      // 有料版と同じ結果画面へ、あらかじめ用意した「精密な診断文」を送ります
      navigate('/result', { 
        state: { 
          name1: names.name1, 
          name2: names.name2, 
          result: `${names.name1}さんと${names.name2}さんの相性を精密に診断しました。\n\nお二人のエネルギーバランスは非常に安定しており、互いの欠点を補い合える素晴らしい関係性です。特にコミュニケーションの面では、言葉にせずとも伝わる「阿吽の呼吸」が備わっています。\n\n※この先、さらに具体的な「運命の転換点」や「二人の障害」についての詳細な診断は、有料版にて公開しております。` 
        } 
      });
    }, 3000); // 3秒間「診断中...」と表示させます
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-center text-white">
        <h2 className="text-3xl font-bold italic text-white">AI精密相性診断</h2>
      </div>
      <form onSubmit={handleDiagnose} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            className="w-full px-6 py-4 rounded-xl border-2 border-pink-50 focus:border-pink-400 outline-none transition-all text-lg"
            placeholder="あなたのお名前"
            value={names.name1}
            onChange={(e) => setNames({ ...names, name1: e.target.value })}
            required
          />
          <input
            type="text"
            className="w-full px-6 py-4 rounded-xl border-2 border-pink-50 focus:border-pink-400 outline-none transition-all text-lg"
            placeholder="お相手のお名前"
            value={names.name2}
            onChange={(e) => setNames({ ...names, name2: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-xl font-bold text-white text-xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:opacity-90 transition-all"
        >
          {loading ? 'AIが深層心理を解析中...' : '診断を開始する'}
        </button>
      </form>
    </div>
  );
};

export default FreePage;
