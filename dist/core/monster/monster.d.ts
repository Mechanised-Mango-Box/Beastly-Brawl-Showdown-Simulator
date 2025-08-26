import { EntryID } from "../utils";
import { BaseComponent } from "./component/component";
import { ComponentKindMap } from "./component/core_components";
import { MonsterStatType } from "./monster_stats";
import { MonsterTemplate } from "./monster_template";
export interface Monster {
    /**
     * The key to the template that this monster is based on
     */
    baseID: EntryID;
    /**
     * The current health
     */
    health: number;
    /**
     * How many times can the monster defend in a round
     */
    defendActionCharges: number;
    /**
     * The components attached to this monster
     */
    components: Array<BaseComponent>;
}
export declare function getComponent<K extends keyof ComponentKindMap>(monster: Monster, kind: K): ComponentKindMap[K] | null;
export declare function getComponents<K extends keyof ComponentKindMap>(monster: Monster, kind: K): ComponentKindMap[K][];
export declare function removeComponent(monster: Monster, component: BaseComponent): void;
export declare function getStat(statType: MonsterStatType, monster: Monster, monsterTemplate: MonsterTemplate): number;
export declare function getBaseStat(statType: MonsterStatType, monsterTemplate: MonsterTemplate): number;
export declare function getStatBonus(statType: MonsterStatType, monster: Monster): number;
export declare function getIsBlockedFromMove(monster: Monster): boolean;
export { MonsterTemplate };
