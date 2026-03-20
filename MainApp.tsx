import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import FreePage from "./pages/FreePage";

const MainApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/compatibility-free" element={<FreePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainApp;