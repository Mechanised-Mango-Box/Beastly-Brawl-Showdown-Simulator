import { ActionId } from "../action";
import { Side, SideId } from "../side";

export interface BattleEvent {
  name: string;
}

// TODO extract as plugin
export interface SnapshotEvent extends BattleEvent {
  name: "snapshot";
  sides: Side[];
}

export interface RollEvent extends BattleEvent {
  name: "roll";
  source: SideId;
  faces: number;
  result: number;
}
export interface RerollEvent extends BattleEvent {
  name: "reroll";
  source: SideId;
  faces: number;
  result: number;
}

export interface BlockedEvent extends BattleEvent {
  name: "blocked";
  source: SideId;
  target: SideId;
}

export interface DamageEvent extends BattleEvent {
  name: "damage";
  source: SideId;
  target: SideId;
  amount: number;
}

export interface StartMoveEvent extends BattleEvent {
  name: "startMove";
  source: SideId;
  target: SideId;
  moveActionId: ActionId;
}

export interface MoveSuccessEvent extends BattleEvent {
  name: "moveSuccess";
  source: SideId;
  target: SideId;
  moveActionId: ActionId;
}

export interface MoveEvadedEvent extends BattleEvent {
  name: "evaded";
  source: SideId;
  target: SideId;
  moveActionId: ActionId;
}
export interface MoveFailedEvent extends BattleEvent {
  name: "moveFailed";
  source: SideId;
  target: SideId;
  moveActionId: ActionId;
  reason: unknown; // TODO
}
export interface BuffEvent extends BattleEvent {
  name: "buff";
  source: SideId;
  target: SideId;
  buffs: { armour: number };
}
