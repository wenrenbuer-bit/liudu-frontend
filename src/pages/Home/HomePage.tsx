import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 32 }}>
      <h1>六度分隔关系网</h1>
      <Button type="primary" onClick={() => navigate('/graph')}>进入关系网可视化</Button>
    </div>
  );
};

export default HomePage; 