import { Battle } from "./battle";
import { SideId } from "./side";

export type ActionId = number & { __brand: "ActionId" };
export function asActionId(value: number): ActionId {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ActionId: ${value}`);
  }
  return value as ActionId;
}
export function isActionId(value: number): value is ActionId {
  return Number.isInteger(value) && value >= 0;
}
export type ActionData = {
  actionId: ActionId;
  targetSideId: number;
};

export type Action = {
  name: string;
  description: string;

  Perform(world: Battle, sourceSideId: SideId): Promise<void>; // NOTE: potentially make return success or error
  // OnEndTurn(world: Battle, sourceSideId: SideId): void; // NOTE: potentially make return success or error
};
