import React, { useState,useMemo } from "react";
import { parseSnapshot } from "./snapshot_parser";
import { Turn } from "../../../../../core/event/Turn"
import type { BaseEvent } from "../../../../../core/event/base_event";
import type { SnapshotEvent } from "../../../../../core/event/core_events";

//this class is basically the entire simulator/information part of the battles, we might need to get playernames tho
interface BattleSceneProps {
  events: BaseEvent[]
}

console.log("BattleScene loaded");


//so the way this works is we have an array of turns which in itself has an array of events which have occured in it
//we've parsed the initial raw JSON data into an array (parsed) so if you want leftside you do parsed[0]
//the list of values you can retrieve from the parsed information is in snapshot_parser part
//you can add to the values just need ask if you need anything more
const BattleScene: React.FC<BattleSceneProps> = ({ events }) => {
  const [turnInput, setTurnInput] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isManualSelection, setIsManualSelection] = useState(false);
  let currentSnapshot;

  //copy pasted from mr gpt
  // Build an array of Turn objects based on events
  //this just gets a turn array filled with turn objects that cut off whenever a snapshot (new turn) occurs
  const turns = useMemo(() => {
    const turnArray: Turn[] = [];
    let currentTurn: Turn | null = null;

    for (const event of events) {
      if (event.name === "snapshot") {
        // Start a new turn
        console.log("CREATING NEW TURN ---------------------------------");
        currentTurn = new Turn();
        currentTurn.setSnapshotEvent(event as SnapshotEvent);
        turnArray.push(currentTurn);
        console.log(currentTurn.turnEvents);
      }

      if (currentTurn) {
        currentTurn.addEvent(event);

        // // Optionally capture specific event types
        // switch (event.name) {
        //   case "buff":
        //     currentTurn.setBuffEvent(event);
        //     break;
        //   case "startMove":
        //     currentTurn.setStartMoveEvent(event);
        //     break;
        //   case "roll":
        //     currentTurn.setRollEvent(event);
        //     break;
        //   case "damage":
        //     currentTurn.setDamageEvent(event);
        //     break;
        //   case "blocked":
        //     currentTurn.setBlockEvent(event);
        //     break;
        // }
      }
    }
    // console.log(turnArray)
    return turnArray;
  }, [events]);
  
  //bugfix from gpt cuz I tried putting this inside the bottom if else block, probably need to change its location so this file doesn't look so ugly?
  React.useEffect(() => {
    if (isManualSelection && turnInput === turns.length) {
      setIsManualSelection(false);
    }
  }, [isManualSelection, turnInput, turns.length]);
  
  if (isManualSelection) {
    currentSnapshot = turns[turnIndex]?.getSnapshotEvent();
  } else {
    currentSnapshot = turns[turns.length - 1]?.getSnapshotEvent();
  }
  
  const parsed = currentSnapshot ? parseSnapshot(currentSnapshot) : [];

  const handleTurnChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsManualSelection(true);
    if (turnInput >= 0 && turnInput < turns.length) {
      setTurnIndex(turnInput-1);
    }
  };

// Checks the index of the turn to show
const uptoIndex = isManualSelection
  ? Math.max(0, Math.min(turnIndex, turns.length - 1))
  : Math.max(0, turns.length - 1);

// Build a flat list of events from Turn 0..uptoIndex
const eventsUpToSelection = React.useMemo(() => {
  if (!turns.length) return [];
  const slice = turns.slice(0, uptoIndex + 1);
  return slice.flatMap((turn, ti) =>
    turn.turnEvents.map((event, ei) => ({
      key: `${ti}-${ei}`,
      text: turn.printEventString(event),
    }))
  );
}, [turns, uptoIndex]);

  if (parsed.length === 0) {
    return <p>Waiting for game data...</p>;
  }

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
      {/* <div
        style={{
          flex: 1,
          backgroundColor: "#f77a7aff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>{turns[turns.length - 1].turnEvents[turns[turns.length - 1].turnEvents.length - 1].name}</p>
      </div> */}

      {/* <div
        style={{
          flex: 1,
          backgroundColor: "#f77a7aff",
          padding: "20px",
          textAlign: "left",
          overflowY: "auto",  // makes it vertically scrollable
          maxHeight: "135px", // sets a fixed height so scrolling is possible
          border: "1px solid black"
        }}
      >
        {turns.map((turn, i) =>
          turn.turnEvents.map((event, j) => (
            <p key={`${i}-${j}`} style={{ margin: "5px 0" }}>
              {event.name}
            </p>
          ))
        )}
      </div> */}

      {/* <div
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
        {turns.map((turn, i) =>
          turn.turnEvents.map((event, j) => (
            <p key={`${i}-${j}`} style={{ margin: "5px 0" }}>
              {turn.printEventString(event)}
            </p>
          ))
        )}
      </div> */}

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
      </div>

      {/* Turn Counter Form (Bottom Left) */}
      <form
        onSubmit={handleTurnChange}
        style={{
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
          min={1}
          max={turns.length}
          value={turnInput}
          placeholder="1"
          onChange={(e) => setTurnInput(parseInt(e.target.value, 10) || 1)}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default BattleScene;
