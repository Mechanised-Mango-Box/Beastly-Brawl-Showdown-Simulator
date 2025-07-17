import { Battle } from "./battle";
import { SideId } from "./side";

export type ActionId = number & { __brand: "ActionId" };

export type ActionOptions = {
  source: SideId;
  target: SideId;
  actionId: ActionId;
};

export type Action = {
  readonly name: string;
  readonly description: string;

  /**
   * Ordered as follows:
   * - Highest  =   First
   * - Default  =   0
   * - Lowest   =   Last
   */
  readonly priortyClass: number;

  perform(world: Battle, source: SideId, target: SideId): Promise<void>; // NOTE: potentially make return success or error

  readonly icon?: string;
};
