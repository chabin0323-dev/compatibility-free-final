import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FreePage from './pages/FreePage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0612]">
      <Routes>
        <Route path="/" element={<Navigate to="/compatibility-free" replace />} />
        <Route path="/compatibility-free" element={<FreePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

export default App;
