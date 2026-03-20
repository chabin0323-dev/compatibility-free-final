import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || { result: "診断データが見つかりませんでした。" };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">診断結果</h2>
        
        <div className="bg-pink-50 rounded-2xl p-6 mb-8 text-left">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result}
          </p>
        </div>

        <button
          onClick={() => navigate('/free')}
          className="w-full py-4 rounded-xl font-bold text-pink-600 border-2 border-pink-200 hover:bg-pink-50 transition-all mb-4"
        >
          もう一度診断する
        </button>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            さらに詳しく知りたい方は、有料版（公式サイト）がおすすめです。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
