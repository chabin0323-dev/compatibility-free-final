import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UsageManual from '../components/UsageManual';

const FreePage: React.FC = () => {
  const navigate = useNavigate();

  const [bloodType, setBloodType] = useState('O型');
  const [zodiac, setZodiac] = useState('子');
  const [constellation, setConstellation] = useState('牡羊座');
  const [year, setYear] = useState('1960');
  const [month, setMonth] = useState('3');
  const [day, setDay] = useState('23');
  const [partnerName, setPartnerName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isFixed, setIsFixed] = useState(true);

  const [nameHistory, setNameHistory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fortune_name_history');
    if (saved) {
      try {
        setNameHistory(JSON.parse(saved));
      } catch {
        setNameHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    const existingScript = document.getElementById('busuanzi-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'busuanzi-script';
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleStartDivination = () => {
    setErrorMessage('');

    if (!partnerName || !relationship) {
      setErrorMessage('⚠️ お相手の名前と関係性を入力してください');
      return;
    }

    const updatedHistory = [partnerName, ...nameHistory.filter((n) => n !== partnerName)].slice(0, 5);
    setNameHistory(updatedHistory);
    localStorage.setItem('fortune_name_history', JSON.stringify(updatedHistory));

    const fortuneInput = {
      yourBloodType: bloodType,
      yourEto: zodiac,
      yourConstellation: constellation,
      yourDob: `${year}-${month}-${day}`,
      partnerName,
      relationship,
      selectedDate,
      isFixed,
    };

    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate(`/result/${sessionId}`, {
        state: fortuneInput,
      });
    }, 3000);
  };

  const years = Array.from({ length: 100 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const zodiacs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const bloodTypes = ['A型', 'B型', 'O型', 'AB型'];
  const constellations = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
  const relationships = ['恋人', '片思い', '夫婦', '友人', '仕事仲間', '商談相手', '上司'];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const formatJapaneseDate = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const todayLabel = formatJapaneseDate(today);
  const tomorrowLabel = formatJapaneseDate(tomorrow);

  return (
    <div className="min-h-screen bg-[#0a0612] text-white p-4 font-sans overflow-x-hidden relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0612]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-transparent relative"
              style={{
                background:
                  'linear-gradient(#0a0612, #0a0612) padding-box, linear-gradient(to right, #ec4899, #a855f7, #6366f1) border-box',
                boxShadow:
                  '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 15px rgba(168, 85, 247, 0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-300 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-indigo-300 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-purple-200 text-sm font-bold tracking-widest animate-pulse"
            >
              魂の結びつきを解析中...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-sm mx-auto pt-4 pb-8">
        <div className="flex justify-between items-start mb-4 py-1">
          <div>
            <h1 className="text-[38px] font-bold flex items-center tracking-tighter leading-none">
              <span className="text-[#ff7e61]">A</span>
              <span className="text-[#ff7e61]">I</span>
              <span className="text-[#f9a620] ml-1">相</span>
              <span className="text-[#f9a620]">性</span>
              <span className="text-[#4cd97b] ml-1">占</span>
              <span className="text-[#4cd97b]">い</span>
            </h1>
          </div>
          <button
            onClick={() => setShowManual(true)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300"
          >
            🔖
          </button>
        </div>

        <div className="bg-[#1a0e2d]/60 backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl mb-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-pink-300 font-bold text-lg">あなた</h2>
              <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-blue-500"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                />
                <span>情報を固定</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {bloodTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {zodiacs.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>

              <select
                value={constellation}
                onChange={(e) => setConstellation(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {constellations.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}月
                  </option>
                ))}
              </select>

              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-[#2a174a] border border-white/10 rounded-full py-3 text-[11px] text-center font-bold outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}日
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-blue-300 font-bold text-lg mb-3">お相手</h2>
            <div className="relative mb-3">
              <input
                type="text"
                value={partnerName}
                onChange={(e) => {
                  setPartnerName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="名前を入力"
                className="w-full bg-[#2a174a] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white font-bold outline-none"
              />
            </div>

            {nameHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {nameHistory.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPartnerName(name);
                      setErrorMessage('');
                    }}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-400 hover:bg-white/10 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            <select
              value={relationship}
              onChange={(e) => {
                setRelationship(e.target.value);
                setErrorMessage('');
              }}
              className="w-full bg-[#2a174a] border border-white/10 rounded-full py-3 px-4 text-xs font-bold outline-none"
            >
              <option value="">現在の関係性</option>
              {relationships.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-6 mb-2 text-center text-red-400 text-xs font-bold">
          {errorMessage && <span className="animate-pulse">{errorMessage}</span>}
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate('today')}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold border ${
                selectedDate === 'today'
                  ? 'bg-purple-600/40 border-purple-400'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              本日
              <br />
              {todayLabel}
            </button>

            <button
              onClick={() => setSelectedDate('tomorrow')}
              className={`flex-1 py-3 rounded-2xl text-xs font-bold border ${
                selectedDate === 'tomorrow'
                  ? 'bg-purple-600/40 border-purple-400'
                  : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              明日
              <br />
              {tomorrowLabel}
            </button>
          </div>

          <button
            onClick={handleStartDivination}
            className="w-full py-4 rounded-full font-bold text-lg shadow-xl bg-gradient-to-r from-purple-500 to-indigo-600 active:scale-95 transition-all shadow-purple-900/40"
          >
            鑑定を開始する
          </button>
        </div>

        <div className="mt-8 text-[11px] text-gray-500/80 text-center leading-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span id="busuanzi_container_site_pv" style={{ display: 'none' }}>
              累計アクセス <span id="busuanzi_value_site_pv"></span>
            </span>
            <span id="busuanzi_container_site_uv" style={{ display: 'none' }}>
              訪問ユーザー <span id="busuanzi_value_site_uv"></span>
            </span>
            <span id="busuanzi_container_page_pv" style={{ display: 'none' }}>
              このページ閲覧 <span id="busuanzi_value_page_pv"></span>
            </span>
          </div>
        </div>
      </div>

      <UsageManual isOpen={showManual} onClose={() => setShowManual(false)} />
    </div>
  );
};

export default FreePage;
