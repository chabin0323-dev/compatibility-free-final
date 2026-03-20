import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const MainApp: React.FC = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default MainApp;
