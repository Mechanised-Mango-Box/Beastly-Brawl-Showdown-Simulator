import React, { useState } from "react";
import { parseSnapshot } from "./snapshot_parser";
import { Turn } from "../../../../../core/event/Turn"


interface BattleSceneProps {
  turns: Turn[];
}

console.log("BattleScene loaded");

const BattleScene: React.FC<BattleSceneProps> = ({ turns }) => {
  const [turnInput, setTurnInput] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);

  const currentSnapshot = turns[turnIndex].getSnapshotEvent();
  const parsed = currentSnapshot ? parseSnapshot(currentSnapshot) : [];

  const handleTurnChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (turnInput >= 0 && turnInput < turns.length) {
      setTurnIndex(turnInput-1);
    }
  };


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "300px",
        border: "1px solid black",
      }}
    >
      {/* Left Div (PLAYER 1 MONSTER) */}
      <div
        style={{
          flex: 3,
          backgroundColor: "#d0e6ff",
          padding: "20px",
        }}
      >
        <h2>{parsed[0].name}</h2>
        <p>HP: {parsed[0].health}</p>
        <p>Defend Charges: {parsed[0].defendActionCharge}</p>
      </div>

      {/* Middle Div (INFORMATION ON ROLLS, ACTIONS TAKEN) */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f77a7aff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>PlaceHolder Text for combat actions</p>
      </div>

      {/* Right Div (PLAYER 2 MONSTER) */}
      <div
        style={{
          flex: 3,
          backgroundColor: "#ffd0d0",
          padding: "20px",
        }}
      >
        <h2>{parsed[1].name}</h2>
        <p>HP: {parsed[1].health}</p>
        <p>Defend Charges: {parsed[1].defendActionCharge}</p>
      </div>

      {/* Turn Counter Form (Bottom Left) */}
      <form
        onSubmit={handleTurnChange}
        style={{
          position: "absolute",
          bottom: "-60px", // Push below battle boxes
          left: "0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label htmlFor="turn">Turn:</label>
        <input
          type="number"
          name="turn"
          id="turn"
          min={0}
          max={turns.length - 1}
          value={turnInput}
          onChange={(e) => setTurnInput(parseInt(e.target.value, 10) || 1)}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default BattleScene;
