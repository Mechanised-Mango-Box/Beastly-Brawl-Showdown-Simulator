"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const event_textbox_1 = require("./Components/event_textbox");
const battle_scene_1 = require("./Components/battle_scene");
const battle_bar_1 = require("./Components/battle_bar");
const turns_array_maker_1 = require("./Components/turns_array_maker");
const BattleVisualizerDemo = () => {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [turnInput, setTurnInput] = (0, react_1.useState)(0);
    return (<div style={{ padding: "20px" }}>
      <event_textbox_1.default onEventsSubmit={setEvents}/>
      <battle_scene_1.default events={events} turnIndex={turnInput} autoplay={false} onAdvanceTurn={(next) => setTurnIndex(next)}/>
      <battle_bar_1.default turnInput={turnInput} setTurnInput={setTurnInput} maxTurns={(0, turns_array_maker_1.parseTurns)(events).length}/>
    </div>);
};
exports.default = BattleVisualizerDemo;
