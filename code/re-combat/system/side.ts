import { Monster } from "./monster";


export type SideId = number & { __brand: "SideId"; };
export function asSideId(value: number): SideId {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid SideId: ${value}`);
  }
  return value as SideId;
}
export type Side = {
  id: SideId;
  
  controllingPlayerId: undefined; // TODO
  monster: Monster;
};
