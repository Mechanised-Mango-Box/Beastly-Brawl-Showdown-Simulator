import { Battle } from "./battle";
import { SideId } from "./side";

export type ActionId = number & { __brand: "ActionId" };

export type ActionOptions = {
  actionId: ActionId;
  targetSideId: SideId;
};

export type Action = {
  name: string;
  description: string;

  Perform(world: Battle, sourceSideId: SideId): Promise<void>; // NOTE: potentially make return success or error
  // OnEndTurn(world: Battle, sourceSideId: SideId): void; // NOTE: potentially make return success or error
};
