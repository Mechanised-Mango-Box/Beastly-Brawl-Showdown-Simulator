import { asActionId } from "../system/action";
import { MonsterTemplate } from "../system/monster";

export const MonsterPool: MonsterTemplate[] = [
  {
    name: "BlankMon",
    description: "Desc for Blank",
    imageUrl: "",
    baseStats: {
      health: 25,
      armorClass: 15,
      attack: 2,
    },
    attackActionId: asActionId(1),
    defendActionId: asActionId(2),
    baseDefendActionCharges: 3,
    abilityActionId: asActionId(0),
    baseAbilityActionCharges: 0,
  },

  {
    name: "Mystic Wyvern",
    description: "A mystical creature of the skies. A Balanced Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_1.png",
    baseStats: {
      health: 25,
      armorClass: 14,
      attack: 2,
    },
    attackActionId: asActionId(1),
    defendActionId: asActionId(2),
    baseDefendActionCharges: 3,
    abilityActionId: asActionId(0),
    baseAbilityActionCharges: 0,
  },

  {
    name: "Shadow Fang Predator",
    description: "A stealthy and cunning beast. An Attack Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_2.png",
    baseStats: {
      health: 20,
      armorClass: 12,
      attack: 4,
    },
    attackActionId: asActionId(1),
    defendActionId: asActionId(2),
    baseDefendActionCharges: 3,
    abilityActionId: asActionId(3),
    baseAbilityActionCharges: 0,
  },

  {
    name: "Stone Hide Guardian",
    description: "A sturdy and resilient protector. A Defense Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_3.png", 
    baseStats: {
      health: 30,
      armorClass: 16,
      attack: 1,
    },
    attackActionId: asActionId(1),
    defendActionId: asActionId(2),
    baseDefendActionCharges: 4,
    abilityActionId: asActionId(4),
    baseAbilityActionCharges: 0,
  },
] as const;
