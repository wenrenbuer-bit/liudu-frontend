import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GraphPage from './pages/Graph/GraphPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/graph" element={<GraphPage />} />
      <Route path="*" element={<Navigate to="/graph" />} />
    </Routes>
  );
};

export default App;
