import { SpawnAction } from "../action/spawn_action";
import { EntryID } from "../types";
import { MonsterStats } from "./monster_stats";


/**
 * A base template for a monster
 */
export type MonsterTemplate = {
  //# Flavour
  name: string;
  description: string;
  imageUrl: string;

  //# Stats
  baseStats: MonsterStats;

  //# Action
  attackActionId: EntryID;
  defendActionId: EntryID;
  baseDefendActionCharges: number;
  abilityActionId?: EntryID;
  onSpawnActions: SpawnAction[];
};
