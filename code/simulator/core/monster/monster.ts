import { EntryID } from "../types";
import { BaseComponent } from "./component/component";
import { ComponentKindMap } from "./component/core_components";
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

//# Component Utils
export function getComponent<K extends keyof ComponentKindMap>(monster: Monster, kind: K): ComponentKindMap[K] | null {
  return monster.components.find((component): component is ComponentKindMap[K] => component.kind === kind) || null;
}

export function getComponents<K extends keyof ComponentKindMap>(monster: Monster, kind: K): ComponentKindMap[K][] {
  return monster.components.filter((component): component is ComponentKindMap[K] => component.kind === kind);
}

export function removeComponent(monster: Monster, component: BaseComponent) {
  monster.components.splice(monster.components.indexOf(component));
}

//# Component Checks
export function getArmour(monster: Monster, monsterTemplate: MonsterTemplate): number {
  return getBaseArmour(monsterTemplate) + getArmourBonus(monster);
}
export function getBaseArmour(monsterTemplate: MonsterTemplate): number {
  return monsterTemplate.baseStats.armour!;
}
export function getArmourBonus(monster: Monster): number {
  return monster.components
    .filter((component) => component.getArmourBonus !== undefined)
    .map((component) => component.getArmourBonus!())
    .reduce((totalBonus, bonus) => totalBonus + bonus, 0);
}

export function getSpeed(monster: Monster, monsterTemplate: MonsterTemplate): number {
  return getBaseSpeed(monsterTemplate) + getSpeedBonus(monster);
}
export function getBaseSpeed(monsterTemplate: MonsterTemplate): number {
  return monsterTemplate.baseStats.speed!;
}
export function getSpeedBonus(monster: Monster): number {
  return monster.components
    .filter((component) => component.getSpeedBonus !== undefined)
    .map((component) => component.getSpeedBonus!())
    .reduce((totalBonus, bonus) => totalBonus + bonus, 0);
}

export function getCritChanceBonus(monster: Monster): number {
  return monster.components
    .filter((component) => component.getCritChanceBonus !== undefined)
    .map((component) => component.getCritChanceBonus!())
    .reduce((totalBonus, bonus) => totalBonus + bonus, 0);
}

export function getIsBlockedFromMove(monster: Monster) {
  return monster.components.filter((component) => component.getIsBlockedFromMove !== undefined).some((component) => component.getIsBlockedFromMove!());
}
