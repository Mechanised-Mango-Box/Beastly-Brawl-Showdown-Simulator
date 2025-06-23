export type ActionId = number;
export type ActionPriority = number;

export enum ActionInterruptKind {
  ROLL,
  REROLL,
}

export type ActionCheck = RollCheck | RerollCheck;

export type RollCheck = {
  kind: ActionInterruptKind.ROLL;
  result: number;
};
export type RerollCheck = {
  kind: ActionInterruptKind.REROLL;
};

export type aniamtionId = number;
export type ActionResult = {
  aniamtionId: aniamtionId;
};

export enum ActionTag {
  ATTACK,
  DEFEND,
}

export type Action = {
  name: string;
  description: string;
  priority: ActionPriority;

  tags: Set<ActionTag>;

  /**
   * @param Caster
   * @param Target
   */
  ActionGenerator(Caster: Monster, Target: Monster): Generator<ActionCheck, ActionResult, null>;
};

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
/**
 * Instance of a monster
 */
export type Monster = {
  template: MonsterTemplate;

  currentModifiers: MonsterStats;
  currentHealth: number;
};
