import { SpawnAction } from "../action/spawn_action";
import { EntryID } from "../utils";
import { MonsterId } from "./monster_pool";
import { MonsterStats } from "./monster_stats";
/**
 * A base template for a monster
 */
export type MonsterTemplate = {
    templateId: MonsterId;
    name: string;
    description: string;
    imageUrl: string;
    baseStats: MonsterStats;
    attackActionId: EntryID;
    defendActionId: EntryID;
    baseDefendActionCharges: number;
    abilityActionId?: EntryID;
    onSpawnActions: SpawnAction[];
};
