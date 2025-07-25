import React from "react";
import type { ChooseMove } from "../../../../combat/system/notice/notice";
import type { EntryID } from "../../../../combat/system/types";
import { movePool } from "../../../../combat/data/move_pool";

interface BattleControlsProps {
  chooseMove: ChooseMove;
  onSelectedMoveId: (moveId: EntryID) => void;
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
      {chooseMove.data.moveIdOptions.map((moveId) => {
        const action = movePool[moveId];
        if (!action) {
          console.error(`Invalid action ID (${moveId})`);
          return;
        }
        return (
          <img
            src={`src/assets/${action.icon}`}
            onClick={() => onSelectedMoveId(moveId)}
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
