import React from "react";
import type { ChooseMove } from "@sim/core/notice/notice";
import type { EntryID } from "@sim/core/types";
interface BattleControlsProps {
    chooseMove: ChooseMove;
    onSelectedMoveId: (moveId: EntryID) => void;
}
declare const BattleControls: React.FC<BattleControlsProps>;
export default BattleControls;
