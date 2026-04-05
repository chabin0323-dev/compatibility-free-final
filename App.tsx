import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FreePage from './pages/FreePage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0612]">
        <Routes>
          {/* 初期アクセス → 無料版へ */}
          <Route path="/" element={<Navigate to="/compatibility-free" replace />} />

          {/* 無料版 */}
          <Route path="/compatibility-free" element={<FreePage />} />

          {/* 結果ページ */}
          <Route path="/result/:sessionId" element={<ResultPage />} />

          {/* 404対策 */}
          <Route path="*" element={<Navigate to="/compatibility-free" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
