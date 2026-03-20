import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import FreePage from './pages/FreePage'; // お試し診断画面
import ResultPage from './pages/ResultPage'; // 結果表示画面

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-pink-50 text-gray-800 font-sans">
        {/* シンプルなヘッダー */}
        <header className="bg-white shadow-sm p-4 text-center">
          <h1 className="text-xl font-bold text-pink-600 italic">AI相性占い ✨ お試し版</h1>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* トップアクセスを /free に飛ばす */}
            <Route path="/" element={<Navigate to="/free" replace />} />
            
            {/* 無料で遊べるメイン画面 */}
            <Route path="/free" element={<FreePage />} />
            
            {/* 結果表示 */}
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>

        {/* 有料版（公式サイト）への強力な案内 */}
        <footer className="bg-gradient-to-b from-pink-50 to-pink-200 p-8 text-center mt-12 border-t border-pink-200">
          <div className="max-w-md mx-auto">
            <p className="text-lg font-bold text-pink-900 mb-2">
              本格的なAI診断を体験しませんか？
            </p>
            <p className="text-sm text-pink-700 mb-6 leading-relaxed">
              最新のAIが、お二人の深層心理まで詳しく分析します。<br />
              続きは公式・有料版サイトへ！
            </p>
            <a 
              href="https://aisou-fortune-host.vercel.app/" 
              className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 transition-all transform hover:scale-105 shadow-lg"
              target="_blank" 
              rel="noopener noreferrer"
            >
              有料版（公式サイト）へ移動
            </a>
            <div className="mt-6 text-xs text-gray-400">
              © 2026 Romance Counseling Center
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
