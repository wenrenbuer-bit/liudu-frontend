import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import HomePage from './pages/Home/HomePage';
import GraphPage from './pages/Graph/GraphPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/graph" element={<GraphPage />} />
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};

export default App;
