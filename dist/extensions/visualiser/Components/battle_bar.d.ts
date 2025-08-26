import React from "react";
interface BattleBarProps {
    turnInput: number;
    setTurnInput: (val: number) => void;
    maxTurns: number;
}
declare const BattleBar: React.FC<BattleBarProps>;
export default BattleBar;
