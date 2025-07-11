import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/graph');
  }, [navigate]);
  return null;
};

export default HomePage; 