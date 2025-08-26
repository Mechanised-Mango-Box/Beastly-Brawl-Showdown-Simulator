"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BattleBar = ({ turnInput, setTurnInput, maxTurns, }) => {
    return (<div style={{ marginTop: "20px" }}>
      <label htmlFor="turn">Turn:</label>
      <input type="range" id="turn" min={0} max={Math.max(0, maxTurns - 1)} value={turnInput} onChange={(e) => setTurnInput(parseInt(e.target.value, 10))} style={{ width: "300px", margin: "0 10px" }}/>
      <span>
        {turnInput + 1} / {maxTurns}
      </span>
    </div>);
};
exports.default = BattleBar;
