import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreePage: React.FC = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.name1 || !names.name2) return;

    setLoading(true);
    try {
      // Gemini APIを呼び出す有料版と同じロジック
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import-your-api-key-here}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${names.name1}さんと${names.name2}さんの相性を詳しく占ってください。` }] }]
        })
      });
      const data = await response.json();
      const aiResult = data.candidates[0].content.parts[0].text;

      setLoading(false);
      navigate('/result', { state: { name1: names.name1, name2: names.name2, result: aiResult } });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-center text-white">
        <h2 className="text-3xl font-bold">AI精密相性診断</h2>
      </div>
      <form onSubmit={handleDiagnose} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            className="w-full px-6 py-4 rounded-xl border-2 border-pink-50 focus:border-pink-400 outline-none transition-all"
            placeholder="あなたのお名前"
            value={names.name1}
            onChange={(e) => setNames({ ...names, name1: e.target.value })}
            required
          />
          <input
            type="text"
            className="w-full px-6 py-4 rounded-xl border-2 border-pink-50 focus:border-pink-400 outline-none transition-all"
            placeholder="お相手のお名前"
            value={names.name2}
            onChange={(e) => setNames({ ...names, name2: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-xl font-bold text-white text-xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg"
        >
          {loading ? '診断中...' : '診断を開始する'}
        </button>
      </form>
    </div>
  );
};

export default FreePage;
