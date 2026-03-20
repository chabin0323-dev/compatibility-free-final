import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name1, name2, result } = location.state || { name1: "ゲスト", name2: "お相手", result: "データがありません。" };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 mt-10">
      <div className="p-8 border-b border-pink-50 flex justify-between items-center bg-pink-50/30">
        <h2 className="text-2xl font-bold text-gray-800 italic">診断結果</h2>
        <div className="bg-white text-pink-600 px-6 py-2 rounded-full text-lg font-bold shadow-sm border border-pink-100">
          {name1} ❤️ {name2}
        </div>
      </div>
      <div className="p-8">
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-8 border border-white shadow-inner">
          <p className="text-gray-700 whitespace-pre-wrap leading-loose text-lg font-medium">
            {result}
          </p>
        </div>
        
        {/* ここに有料版へのボタンを追加できます */}
        <div className="mt-10 p-6 bg-pink-100/50 rounded-2xl text-center border border-pink-200">
          <p className="text-pink-800 font-bold mb-4 text-lg">✨ さらに深い診断結果（1000文字以上）を読む ✨</p>
          <a 
            href="https://aisou-fortune-host.vercel.app/" 
            className="inline-block bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-pink-700 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            有料版（公式サイト）で続きを見る
          </a>
        </div>

        <button
          onClick={() => navigate('/free')}
          className="w-full mt-6 py-4 rounded-xl font-bold text-gray-400 hover:text-pink-400 transition-all"
        >
          ← 入力画面に戻る
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
