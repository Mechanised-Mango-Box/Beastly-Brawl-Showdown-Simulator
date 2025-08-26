import React from "react";
import type { BaseEvent } from "../../../core/event/base_event";
interface BattleSceneProps {
    events: BaseEvent[];
    turnIndex: number;
    autoplay?: boolean;
    onAdvanceTurn?: (nextIndex: number) => void;
}
declare const BattleScene: React.FC<BattleSceneProps>;
export default BattleScene;
