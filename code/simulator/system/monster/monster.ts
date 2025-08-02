import { SpawnAction } from "../action/spawn_action";
import { EntryID } from "../types";
import { BaseComponent, ComponentKindMap } from "./component";

export type MonsterId = number & { __brand: "MonsterId" };

/**
 * Holds a set of the common stats
 */
export type MonsterStats = {
  health: number;
  armour: number;
  attack: number;
  speed: number;
};

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

export class Monster {
  /**
   * The template that this monster is based on
   */
  base: MonsterTemplate;
  health: number;
  defendActionCharges: number; /// How many times can the monster defend in a round

  //* Non-default components
  components: Array<BaseComponent>;

  constructor(template: MonsterTemplate) {
    this.base = template;
    this.health = template.baseStats.health;
    this.components = [];
    this.defendActionCharges = template.baseDefendActionCharges;
  }

  getComponent<K extends keyof ComponentKindMap>(kind: K): ComponentKindMap[K] | null {
    return this.components.find((component): component is ComponentKindMap[K] => component.kind === kind) || null;
  }

  getComponents<K extends keyof ComponentKindMap>(kind: K): ComponentKindMap[K][] {
    return this.components.filter((component): component is ComponentKindMap[K] => component.kind === kind);
  }

  //# Component Checks
  getArmourBonus(): number {
    return (
      this.base.baseStats.armour +
      this.components
        .filter((component) => component.getArmourBonus !== undefined)
        .map((component) => component.getArmourBonus!())
        .reduce((totalBonus, bonus) => totalBonus + bonus, 0)
    );
  }
  getCritChanceBonus(): number {
    return this.components
      .filter((component) => component.getCritChanceBonus !== undefined)
      .map((component) => component.getCritChanceBonus!())
      .reduce((totalBonus, bonus) => totalBonus + bonus, 0);
  }

  getIsBlockedFromMove() {
    return this.components.filter((component) => component.getIsBlockedFromMove !== undefined).some((component) => component.getIsBlockedFromMove!());
  }
}
