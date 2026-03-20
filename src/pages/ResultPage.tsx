import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name1, name2, result } = location.state || {};

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
      <div className="p-8 border-b border-pink-50 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">診断結果</h2>
        <div className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold">
          {name1} ❤️ {name2}
        </div>
      </div>
      <div className="p-8">
        <div className="bg-pink-50 rounded-2xl p-8 border border-white">
          <p className="text-gray-700 whitespace-pre-wrap leading-loose text-lg">
            {result}
          </p>
        </div>
        <button
          onClick={() => navigate('/free')}
          className="w-full mt-8 py-4 rounded-xl font-bold text-pink-600 border-2 border-pink-200 hover:bg-pink-50"
        >
          もう一度占う
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
