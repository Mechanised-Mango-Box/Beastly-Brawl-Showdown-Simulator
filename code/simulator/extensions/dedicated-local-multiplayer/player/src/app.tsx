import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerConnectionPage from "./pages/player_connection_page";
import GamePage from "./pages/game_page"; // an example other page
import { SocketProvider } from "./socket/socket_provider";

const App: React.FC = () => (
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/join" element={<PlayerConnectionPage />} />
        <Route path="/" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);

export default App;
