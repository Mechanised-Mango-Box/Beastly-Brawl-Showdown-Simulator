"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const common_move_pool_1 = require("@sim/data/common/common_move_pool");
const BattleControls = ({ chooseMove, onSelectedMoveId }) => {
    return (<div style={{
            backgroundColor: "cornflowerblue",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
      {chooseMove.data.moveIdOptions.map((moveId) => {
            const action = common_move_pool_1.commonMovePool[moveId];
            if (!action) {
                console.error(`Invalid action ID (${moveId})`);
                return;
            }
            return (<img src={`src/assets/${action.icon}`} onClick={() => onSelectedMoveId(moveId)} style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    cursor: "pointer",
                }}/>);
        })}
    </div>);
};
exports.default = BattleControls;
