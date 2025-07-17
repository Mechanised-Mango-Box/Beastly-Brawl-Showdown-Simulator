import React from "react";
import type { ChooseMove } from "../../../../combat/system/notice/notice";
import type { ActionId } from "../../../../combat/system/action";
import { getAction } from "../../../../combat/data/action_pool";

interface BattleControlsProps {
  chooseMove: ChooseMove;
  onSelectedMoveId: (actionId: ActionId) => void;
}

const BattleControls: React.FC<BattleControlsProps> = ({ chooseMove, onSelectedMoveId }) => {
  return (
    <div
      style={{
        backgroundColor: "cornflowerblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {chooseMove.data.moveActionIds.map((actionId) => {
        const action = getAction(actionId);
        if (!action) {
          console.error(`Invalid action ID (${actionId})`);
          return;
        }
        return (
          <img
            src={`src/assets/${action.icon}`}
            onClick={() => onSelectedMoveId(actionId)}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        );
      })}
    </div>
  );
};

export default BattleControls;
