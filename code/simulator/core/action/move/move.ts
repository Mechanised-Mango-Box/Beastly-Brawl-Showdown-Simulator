import { Battle } from "../../battle";
import { SideId } from "../../side";
import { EntryID } from "../../types";
import { Action } from "../action";
import { TargetingData, TargetingMethod } from "../targeting";

interface MoveEvents {
  perform(battle: Battle, source: SideId, targetingData: TargetingData): Promise<void>;
  
  onHit?(battle: Battle, source: SideId, reciever: SideId): Promise<void>;
  onFail(battle: Battle, source: SideId): Promise<void>;
}
/**
 * A move is a specific type of action
 */
export interface MoveData
  extends Action<"move">,
    Readonly<{
      moveId: EntryID;

      name: string;
      description: string;
      icon?: string;
      priorityClass: number;
      targetingMethod: TargetingMethod;
    }>,
    MoveEvents {}
export function defineMove(id: EntryID, move: Omit<MoveData, "moveId">): [EntryID, MoveData] {
  return [
    id,
    {
      ...move,
      moveId: id,
    },
  ];
}
export function getMoveId(move: MoveData): EntryID;
export function getMoveId(move: Omit<MoveData, "moveId">): EntryID;
export function getMoveId(move: MoveData | Omit<MoveData, "moveId">): EntryID {
  if ("moveId" in move) {
    return move.moveId;
  }

  throw new Error("Invalid move: Missing moveId.");
}

export type MoveRequest = { moveId: EntryID; source: SideId; targetingData: TargetingData };
