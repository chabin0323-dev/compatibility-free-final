import React from 'react';

interface ResultCardProps {
  result: {
    compatibilityScore: number;
    future: string;
    guidance: string;
    pastLife: string;
    todayLuck: string;
    advice: string;
    biorhythm: { day: string; score: number }[];
  };
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-10">
      {/* 鑑定結果セクション */}
      <div className="space-y-6">
        {[
          { icon: "🚀", title: "二人の未来", text: result.future },
          { icon: "✨", title: "星の導き", text: result.guidance },
          { icon: "⏳", title: "前世の絆", text: result.pastLife },
          { icon: "📅", title: "今日の恋愛運", text: result.todayLuck },
          { icon: "💡", title: "改善への助言", text: result.advice },
        ].map((item, index) => (
          <div key={index} className="bg-white/5 border-l-4 border-purple-500 p-4 rounded-r-lg shadow-xl animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h3 className="font-bold text-purple-200">{item.title}</h3>
            </div>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{item.text}</p>
          </div>
        ))}
      </div>

      {/* 週間バイオリズム（縦並び表示） */}
      <div className="bg-black/30 rounded-2xl p-6 border border-white/10 shadow-inner">
        <h3 className="text-center text-xs font-bold text-purple-300 mb-6 uppercase tracking-[0.3em]">
          WEEKLY BIORHYTHM
        </h3>
        <div className="flex flex-col space-y-4">
          {result.biorhythm.map((data, index) => (
            <div key={index} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
              <span className="text-gray-400 text-sm font-medium w-12">{data.day}</span>
              <div className="flex-1 flex justify-end items-center">
                <span className="text-yellow-400 tracking-[0.2em] text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
                  {'★'.repeat(data.score)}{'☆'.repeat(5 - data.score)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
