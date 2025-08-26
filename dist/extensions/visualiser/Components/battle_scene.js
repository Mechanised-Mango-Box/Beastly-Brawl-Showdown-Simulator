"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const snapshot_parser_1 = require("./snapshot_parser");
const turns_array_maker_1 = require("./turns_array_maker");
const clamp_1 = require("./utils/clamp");
console.log("BattleScene loaded");
//so the way this works is we have an array of turns which in itself has an array of events which have occured in it
//we've parsed the initial raw JSON data into an array (parsed) so if you want leftside you do parsed[0]
//the list of values you can retrieve from the parsed information is in snapshot_parser part
//you can add to the values just need ask if you need anything more
const BattleScene = ({ events, turnIndex, autoplay, onAdvanceTurn }) => {
    // Build an array of Turn objects based on events
    //this just gets a turn array filled with turn objects that cut off whenever a snapshot (new turn) occurs
    const turns = (0, react_1.useMemo)(() => (0, turns_array_maker_1.parseTurns)(events), [events]);
    // Clamp is used to restrict the number to make sure it stays within range
    const selectedTurnIndex = Number.isInteger(turnIndex)
        ? (0, clamp_1.clamp)(turnIndex, 0, Math.max(0, turns.length - 1))
        : Math.max(0, turns.length - 1);
    // Use selectedTurnIndex (not raw turnIndex) everywhere you access turns
    const currentTurn = turns[selectedTurnIndex];
    const currentSnapshot = currentTurn ? currentTurn.getSnapshotEvent() : null;
    const parsed = currentSnapshot ? (0, snapshot_parser_1.parseSnapshot)(currentSnapshot) : [];
    // Build full log for ALL turns, regardless of selectedTurnIndex
    const gameLog = (0, react_1.useMemo)(() => {
        const logEntries = [];
        if (!turns.length)
            return logEntries;
        const lastTurnIndex = Math.max(0, turns.length - 1);
        for (let turnNumber = 0; turnNumber <= lastTurnIndex; turnNumber++) {
            const currentTurn = turns[turnNumber];
            // Start-of-turn marker
            logEntries.push({
                key: `turn-${turnNumber}-start`,
                text: `Turn ${turnNumber + 1} started`,
            });
            // All events within this turn
            for (let eventIndex = 0; eventIndex < currentTurn.turnEvents.length; eventIndex++) {
                const event = currentTurn.turnEvents[eventIndex];
                logEntries.push({
                    key: `turn-${turnNumber}-event-${eventIndex}`,
                    text: currentTurn.printEventString(event) ?? "Unknown event",
                });
            }
        }
        return logEntries;
    }, [turns]);
    if (parsed.length < 2) {
        return <p>Waiting for game data...</p>;
    }
    console.log(parsed[0].image);
    return (<div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "300px",
            border: "1px solid black",
        }}>
      {/* Left Div (PLAYER 1 MONSTER) */}
      <div style={{
            flex: 3,
            backgroundColor: "#d0e6ff",
            padding: "20px",
        }}>
        <h2>{parsed[0].name}</h2>
        <p>HP: {parsed[0].health}</p>
        <p>Defend Charges: {parsed[0].defendActionCharge}</p>
        <img src={parsed[0].image}/>
      </div>

      {/* Middle Div (INFORMATION ON ROLLS, ACTIONS TAKEN) */}

      <div style={{
            flex: 1,
            backgroundColor: "#f77a7aff",
            padding: "20px",
            textAlign: "left",
            overflowY: "auto",
            maxHeight: "135px",
            border: "1px solid black",
        }}>
        {gameLog.length === 0 ? (<p>No events yet.</p>) : (gameLog.map(({ key, text }) => (<p key={key} style={{ margin: "5px 0" }}>{text}</p>)))}
      </div>

      {/* Right Div (PLAYER 2 MONSTER) */}
      <div style={{
            flex: 3,
            backgroundColor: "#ffd0d0",
            padding: "20px",
        }}>
        <h2>{parsed[1].name}</h2>
        <p>HP: {parsed[1].health}</p>
        <p>Defend Charges: {parsed[1].defendActionCharge}</p>
        <img src={parsed[1].image}/>
      </div>
    </div>);
};
exports.default = BattleScene;
