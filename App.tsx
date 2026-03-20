import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FreePage from './pages/FreePage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0612]">
        <Routes>
          {/* 最初の画面（入力画面） */}
          <Route path="/" element={<FreePage />} />
          
          {/* 結果画面 */}
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
