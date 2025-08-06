import React from "react";
import type { SnapshotEvent } from "../../../../../core/event/core_events";
import { parseSnapshot } from "./snapshot_parser";
import { Turn } from "../../../../../core/event/Turn"


interface BattleSceneProps {
    snapshot: SnapshotEvent;
}

const turns: Turn[];

console.log("BattleScene loaded");
const BattleScene: React.FC<BattleSceneProps> = ({snapshot}) => {
    const parsed = parseSnapshot(snapshot)

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
    </div>
  );
};

export default BattleScene;
