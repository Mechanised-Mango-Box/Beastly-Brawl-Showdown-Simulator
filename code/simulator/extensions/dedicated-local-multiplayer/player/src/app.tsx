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

//THIS IS TEST FOR THE REPLAY SYSTEM
// import type { SnapshotEvent } from "../../../../core/event/core_events";
// import BattleScene from "./components/battle_scene";


// const testSnapshot: SnapshotEvent = {
//   name: "snapshot",
//   sides: [
//     {
//       id: 0,
//       monster: {
//         base: {
//           name: "Mystics Wyvern",
//           description: "A mystical creature of the skies. A Balanced Monster.",
//           imageUrl: "/img/monster-selection-images/placeholder_monster_1.png",
//           baseStats: { health: 25, armour: 14, attack: 2, speed: 5 },
//           attackActionId: "attack-normal",
//           defendActionId: "defend",
//           baseDefendActionCharges: 3,
//           onSpawnActions: [{ type: "spawnAction" }],
//         },
//         health: 25,
//         components: [],
//         defendActionCharges: 3,
//       },
//       pendingActions: null,
//     },
//     {
//       id: 1,
//       monster: {
//         base: {
//           name: "Mystic Wyvern",
//           description: "A mystical creature of the skies. A Balanced Monster.",
//           imageUrl: "/img/monster-selection-images/placeholder_monster_1.png",
//           baseStats: { health: 25, armour: 14, attack: 2, speed: 5 },
//           attackActionId: "attack-normal",
//           defendActionId: "defend",
//           baseDefendActionCharges: 3,
//           onSpawnActions: [{ type: "spawnAction" }],
//         },
//         health: 25,
//         components: [],
//         defendActionCharges: 3,
//       },
//       pendingActions: null,
//     },
//   ],
// };

// export default function App() {
//   return <BattleScene snapshot={testSnapshot} />;
// }