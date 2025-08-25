import { MoveData } from "./move";
import { EntryID } from "../../types";

/**
 * A move pool is a collection of moves accessable by ID
 */
export type MovePool = Readonly<Record<EntryID, MoveData>>;
export function createMovePool<T extends readonly [EntryID, MoveData][]>(entries: T): MovePool {
  return Object.fromEntries(entries) as MovePool;
}
