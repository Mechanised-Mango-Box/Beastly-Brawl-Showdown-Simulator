import React, { useState,useMemo } from "react";
import { Turn } from "../../../core/event/Turn"
import type { BaseEvent } from "../../../core/event/base_event";
import type { SnapshotEvent } from "../../../core/event/core_events";
import { parseSnapshot } from "./snapshot_parser";
import { parseTurns } from "./turns_array_maker";
import { clamp } from "./utils/clamp";

//this class is basically the entire simulator/information part of the battles, we might need to get playernames tho
interface BattleSceneProps {
  events: BaseEvent[]
  turnIndex: number;
  autoplay?: boolean; // play subsequent turns automatically
  onAdvanceTurn?: (nextIndex: number) => void; // ask parent to move to next turn
}

console.log("BattleScene loaded");

//so the way this works is we have an array of turns which in itself has an array of events which have occured in it
//we've parsed the initial raw JSON data into an array (parsed) so if you want leftside you do parsed[0]
//the list of values you can retrieve from the parsed information is in snapshot_parser part
//you can add to the values just need ask if you need anything more
const BattleScene: React.FC<BattleSceneProps> = ({ events, turnIndex, autoplay, onAdvanceTurn }) => {

  // Build an array of Turn objects based on events
  //this just gets a turn array filled with turn objects that cut off whenever a snapshot (new turn) occurs
  const turns = useMemo(() => parseTurns(events), [events]);

  // Clamp is used to restrict the number to make sure it stays within range
  const selectedTurnIndex =
    Number.isInteger(turnIndex)
      ? clamp(turnIndex, 0, Math.max(0, turns.length - 1))
      : Math.max(0, turns.length - 1);

  // Use selectedTurnIndex (not raw turnIndex) everywhere you access turns
  const currentTurn = turns[selectedTurnIndex];
  const currentSnapshot = currentTurn ? currentTurn.getSnapshotEvent() : null;
  const parsed = currentSnapshot ? parseSnapshot(currentSnapshot) : [];

  const isSnapshot = (ev: BaseEvent): ev is SnapshotEvent =>
    (ev as any).name === "snapshot";

  // Building the lookup table for turn: snapshot event index
  const turnStartIndex = useMemo(() => {
    const map: Record<number, number> = {};
    let t = -1;
    for (let i = 0; i < events.length; i++) {
      if (isSnapshot(events[i])) {
        t += 1;
        map[t] = i; // snapshot event index starting this turn
      }
    }
    return map;
  }, [events]);

  // List for the previous events
  const preLog = useMemo(() => {
    const out: { key: string; text: string }[] = [];
    if (!turns.length || selectedTurnIndex <= 0) return out;

    const last = Math.min(selectedTurnIndex - 1, turns.length - 1);
    for (let turnNumber = 0; turnNumber <= last; turnNumber++) {
      const turn = turns[turnNumber];
      out.push({ key: `pre-t${turnNumber}-snap`, text: `Turn ${turnNumber + 1} started` });
      for (let eventNumber = 0; eventNumber < turn.turnEvents.length; eventNumber++) {
        const ev = turn.turnEvents[eventNumber];
        out.push({
          key: `pre-t${turnNumber}-e${eventNumber}`,
          text: turn.printEventString(ev) ?? "Unknown event",
        });
      }
    }
    return out;
  }, [turns, selectedTurnIndex]);

  // State of the section of the game log that is rendered live
  const [liveLog, setLiveLog] = React.useState<{ key: string; text: string }[]>([]);

  // For animations to be put in
  const nextTick = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

  // ChatGPT did this: Something about making sure it doesn't trigger multiple advances
  const advanceCalledRef = React.useRef(false);

  React.useEffect(() => {
    advanceCalledRef.current = false;
  }, [selectedTurnIndex]);

  // Rendering the selected turn
  React.useEffect(() => {
    let cancelled = false;

    setLiveLog(preLog); // previous turns printed instantly

    const runSelectedTurn = async () => {
      if (selectedTurnIndex < 0) return;

      const startIdx = turnStartIndex[selectedTurnIndex];
      if (startIdx === undefined) return;

      let turnNo = selectedTurnIndex - 1;

      for (let i = startIdx; i < events.length; i++) {
        if (cancelled) return;

        const ev = events[i];

        if (isSnapshot(ev)) {
          turnNo += 1;
          if (turnNo > selectedTurnIndex) break;

          setLiveLog((prev) => [
            ...prev,
            { key: `sel-t${turnNo}-snap-${i}`, text: `Turn ${turnNo + 1} started` },
          ]);
          // TODO: await animateTurnStart(turnNo);
          await nextTick();
          continue;
        }

        if (turnNo !== selectedTurnIndex) continue;

        const text =
          turns[turnNo]?.printEventString(ev) ??
          String((ev as any).name ?? (ev as any).eventName ?? "event");

        setLiveLog((prev) => [...prev, { key: `sel-t${turnNo}-e${i}`, text }]);
        // TODO: await animateEvent(ev, turnNo);
        await nextTick();
      }

      // After the selected turn finishes
      if (cancelled) return;
      if (advanceCalledRef.current) return; // prevent double-trigger on re-renders
      advanceCalledRef.current = true;

      const lastTurnIndex = Math.max(0, turns.length - 1);

      if (selectedTurnIndex < lastTurnIndex) {
        // If autoplay is on, request the parent to advance to the next turn
        if (autoplay && onAdvanceTurn) {
          // Optional: tiny pause between turns (good for future "between-turn" animation)
          await nextTick(0); // TODO: await animateBetweenTurns(selectedTurnIndex, selectedTurnIndex+1);
          onAdvanceTurn(selectedTurnIndex + 1);
        }
      }
    };

    runSelectedTurn();
    return () => { cancelled = true; };
  }, [events, selectedTurnIndex, turns, preLog, turnStartIndex, autoplay, onAdvanceTurn]);


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
        {liveLog.length === 0 ? (<p>No events yet.</p>) : 
        (liveLog.map(({ key, text }) => (
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
