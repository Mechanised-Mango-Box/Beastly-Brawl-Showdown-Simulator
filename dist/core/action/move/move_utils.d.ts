import { Battle } from "../../battle";
import { SideId } from "../../side";
import { MoveData } from "./move";
export declare function default_attack(parentMove: MoveData, battle: Battle, source: SideId, target: SideId): Promise<void>;
