type ActionId = number;

/**
 * Holds a set of the common stats
 */
class MonsterStats {
  health: number;
  armor: number;
  attack: number;
}

/**
 * A base template for a monster
 */
class MonsterTemplate {
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
}

/**
 * Instance of a monster
 */
class Monster {
  template: MonsterTemplate;

  currentModifiers: MonsterStats;
  currentHealth: number;
}
