import { ActionId, ActionOptions } from "./action";
import { Component } from "./component";

export type MonsterId = number & { __brand: "MonsterId" };

/**
 * Holds a set of the common stats
 */
export type MonsterStats = {
  health: number;
  armorClass: number;
  attack: number;
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
  attackActionId: ActionId;
  defendActionId: ActionId;
  baseDefendActionCharges: number;
  abilityActionId: ActionId;
  baseAbilityActionCharges: number;
};

export class Monster {
  template: MonsterTemplate;
  health: number;
  defendActionCharges: number; //? How many times can the monster defend in a round
  currentArmorClass: number; //? The current armor class, which can change during the battle

  //* Non-default components
  components: Array<Component>; //{ [id: string]: Component };

  constructor(template: MonsterTemplate) {
    this.template = template;
    this.health = template.baseStats.health;
    this.components = [];
    this.defendActionCharges = template.baseDefendActionCharges;
    this.currentArmorClass = template.baseStats.armorClass;
  }
}

export function getComponent(entity: Monster, name: string): Component | null {
  for (const component of entity.components) {
    if (component.name === name) {
      return component;
    }
  }
  return null;
}
export function getComponentAll(entity: Monster, name: string): Component[] {
  return entity.components.filter((component) => component.name === name);
}
