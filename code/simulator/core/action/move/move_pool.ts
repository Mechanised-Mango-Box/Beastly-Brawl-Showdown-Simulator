import { LookupTable } from "@sim/core/utils";
import { MoveData } from "./move";

export type MoveId = Lowercase<string>;

/**
 * A move pool is a collection of moves accessible by ID
 */
export type MovePool<MOVE_NAMES extends MoveId> = LookupTable<MOVE_NAMES, "moveId", MoveData>;
