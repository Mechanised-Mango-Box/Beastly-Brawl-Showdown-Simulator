import { Battle } from "./battle";
import { SideId } from "./side";

export type ActionId = number & { __brand: "ActionId" };

export type ActionOptions = {
  source: SideId;
  target: SideId;
  actionId: ActionId;
};

export type Action = {
  name: string;
  description: string;

  perform(world: Battle, source: SideId, target: SideId): Promise<void>; // NOTE: potentially make return success or error
  // OnEndTurn(world: Battle, sourceSideId: SideId): void; // NOTE: potentially make return success or error
};
