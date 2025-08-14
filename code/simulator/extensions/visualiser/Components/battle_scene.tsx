import React, { useState,useMemo } from "react";
import { Turn } from "../../../core/event/Turn"
import type { BaseEvent } from "../../../core/event/base_event";
import type { SnapshotEvent } from "../../../core/event/core_events";
import { parseSnapshot } from "./snapshot_parser";
import { parseTurns } from "./turns_array_maker";

//this class is basically the entire simulator/information part of the battles, we might need to get playernames tho
interface BattleSceneProps {
  events: BaseEvent[]
  turnIndex: number;
}

console.log("BattleScene loaded");

//so the way this works is we have an array of turns which in itself has an array of events which have occured in it
//we've parsed the initial raw JSON data into an array (parsed) so if you want leftside you do parsed[0]
//the list of values you can retrieve from the parsed information is in snapshot_parser part
//you can add to the values just need ask if you need anything more
const BattleScene: React.FC<BattleSceneProps> = ({ events, turnIndex }) => {

  // Build an array of Turn objects based on events
  //this just gets a turn array filled with turn objects that cut off whenever a snapshot (new turn) occurs
  const turns = useMemo(() => parseTurns(events), [events]);

  // Clamp is used to restrict the number to make sure it stays within range
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));
  const uptoIndex =
    Number.isInteger(turnIndex)
      ? clamp(turnIndex, 0, Math.max(0, turns.length - 1))
      : Math.max(0, turns.length - 1);

  // Use uptoIndex (not raw turnIndex) everywhere you access turns
  const currentTurn = turns[uptoIndex];
  const currentSnapshot = currentTurn ? currentTurn.getSnapshotEvent() : null;
  const parsed = currentSnapshot ? parseSnapshot(currentSnapshot) : [];

  // Build a flat list of events from Turn 0..uptoIndex
  const eventsUpToSelection = useMemo(() => {
  const out: { key: string; text: string }[] = [];
  if (!events.length) return out;

  let turnNo = -1; // increments when a snapshot is seen

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];

    // If it's a snapshot, count as a new turn
    if ((ev as any).name === "snapshot") {
      turnNo += 1;
      if (turnNo > uptoIndex) break; // stop once we pass selected turn
      out.push({
        key: `t${turnNo}-e${i}`,
        text: `Turn ${turnNo + 1} started`,
      });
      continue;
    }

    // If it's a normal event and we're within the selected turn count
    if (turnNo === -1) continue; // skip pre-snapshot events
    if (turnNo > uptoIndex) break;

    out.push({
      key: `t${turnNo}-e${i}`,
      text: turns[turnNo]?.printEventString(ev) ?? "Unknown event",
    });
  }

  return out;
}, [events, uptoIndex, turns]);


  
  if (parsed.length < 2) {
    return <p>Waiting for game data...</p>;
  }
  
  console.log(parsed[0].image);

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
        <img
          src = {parsed[0].image}
        />
      </div>

      {/* Middle Div (INFORMATION ON ROLLS, ACTIONS TAKEN) */}

      <div
        style={{
          flex: 1,
          backgroundColor: "#f77a7aff",
          padding: "20px",
          textAlign: "left",
          overflowY: "auto",
          maxHeight: "135px",
          border: "1px solid black",
        }}
      >
        {eventsUpToSelection.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          eventsUpToSelection.map(({ key, text }) => (
            <p key={key} style={{ margin: "5px 0" }}>{text}</p>
          ))
        )}
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
        <img
          src = {parsed[1].image}
        />
      </div>
    </div>
  );
}

export default BattleScene;
