import React from 'react';
import { useNavigate } from 'react-router-dom';

//literally just a div, like nothing to see here
export const BattleTop: React.FC = () => {
  const navigate = useNavigate();

  return (
  <button onClick={() => navigate('/main')} className="battleScreenTop-btn">
    {/* <img className="topBackIcon" src="/img/back_line.png" alt="back" /> */}
    Surrender
  </button>
);

};
