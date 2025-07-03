import React from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleGuestHostName = () =>{
    navigate(`/host/`)
  };

  return (
    <div className="homepage-container">
      <div className="logo"></div>
      <div className="buttons-container">
        <button className="glb-btn btn-brown" onClick={handleGuestHostName}>
          HOST
        </button>
        <button className="glb-btn btn-dark-brown" onClick={() => navigate("/join")}>
          JOIN
        </button>
        <button
          className="glb-btn btn-brown"
          onClick={() => navigate("/settings")}
        >
          SETTINGS
        </button>
      </div>
    </div>
  );
}
