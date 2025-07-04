import { ActionId, ActionData } from "./action";
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

export type Monster = {
  template: MonsterTemplate;
  health: number;
  queuedActionData: ActionData | null; //? Turn into an actual queue if needed
  defendActionCharges: number; //? How many times can the monster defend in a round

  //* Non-default components
  components: Array<Component>;
};

export function makeMonster(template: MonsterTemplate): Monster {
  return {
    template: template,
    health: 0,
    queuedActionData: null,
    components: [],
    defendActionCharges: template.baseDefendActionCharges,
  };
}