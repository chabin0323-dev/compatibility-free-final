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
      {/* 鑑定項目リスト */}
      <div className="space-y-6">
        {[
          { icon: "🚀", title: "二人の未来", text: result.future },
          { icon: "✨", title: "星の導き", text: result.guidance },
          { icon: "⏳", title: "前世の絆", text: result.pastLife },
          { icon: "📅", title: "今日の恋愛運", text: result.todayLuck },
          { icon: "💡", title: "改善への助言", text: result.advice },
        ].map((item, index) => (
          <div key={index} className="bg-white/5 border-l-4 border-purple-500 p-4 rounded-r-lg shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h3 className="font-bold text-purple-200">{item.title}</h3>
            </div>
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{item.text}</p>
          </div>
        ))}
      </div>

      {/* 週間バイオリズム（ここを縦並びに修正しました） */}
      <div className="bg-black/30 rounded-xl p-6 border border-white/10">
        <h3 className="text-center text-xs font-bold tracking-[0.2em] text-purple-300 mb-6 uppercase">
          WEEKLY BIORHYTHM
        </h3>
        <div className="flex flex-col space-y-3">
          {result.biorhythm.map((data, index) => (
            <div key={index} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
              <span className="text-gray-400 text-sm w-10">{data.day}</span>
              <div className="flex-1 px-4 flex justify-end">
                <span className="text-yellow-400 tracking-widest text-lg">
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
