import { Player } from "../../game-server/user";
import { ActionOptions } from "./action";
import { Monster } from "./monster";

export type SideId = number & { __brand: "SideId" };
export type Side = {
  id: SideId;

  monster: Monster;

  pendingActions: ActionOptions[]
};
