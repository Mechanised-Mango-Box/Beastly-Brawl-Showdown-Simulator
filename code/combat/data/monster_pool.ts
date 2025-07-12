// TODO: make swappable instead of a global
import { ActionId } from "../system/action";
import { Battle } from "../system/battle";
import { DodgeChargeComponent, RerollChargeComponent } from "../system/monster/component";
import { MonsterTemplate } from "../system/monster/monster";
import { SideId } from "../system/side";

export const MonsterPool: MonsterTemplate[] = [
  {
    name: "BlankMon",
    description: "Desc for Blank",
    imageUrl: "",
    baseStats: {
      health: 25,
      armour: 15,
      attack: 2,
      speed: 4,
    },
    attackActionId: 1 as ActionId,
    defendActionId: 2 as ActionId,
    baseDefendActionCharges: 3,
    abilityActionId: 0 as ActionId,
    onSpawnActions: [],
  },

  {
    name: "Mystic Wyvern",
    description: "A mystical creature of the skies. A Balanced Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_1.png",
    baseStats: {
      health: 25,
      armour: 14,
      attack: 2,
      speed: 5,
    },
    attackActionId: 1 as ActionId,
    defendActionId: 2 as ActionId,
    baseDefendActionCharges: 3,
    abilityActionId: null,
    onSpawnActions: [
      {
        // Move if reused
        name: "grantWryvenPassive",
        description: "-",
        perform: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push(new RerollChargeComponent(1));
        },
        priortyClass: 99,
      },
    ],
  },

  {
    name: "Shadow Fang Predator",
    description: "A stealthy and cunning beast. An Attack Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_2.png",
    baseStats: {
      health: 20,
      armour: 12,
      attack: 4,
      speed: 7,
    },
    attackActionId: 1 as ActionId,
    defendActionId: 2 as ActionId,
    baseDefendActionCharges: 3,
    abilityActionId: 3 as ActionId,
    onSpawnActions: [
      {
        name: "grantFangPassiveDodge",
        description: "-",
        perform: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push(new DodgeChargeComponent(1));
        },
        priortyClass: 99,
      },
      {
        name: "grantPassiveCritUp",
        description: "-",
        perform: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push({
            kind: "crit",
            getCritChanceBonus: () => 5,
          });
        },
        priortyClass: 99,
      },
    ],
  },

  {
    name: "Stone Hide Guardian",
    description: "A sturdy and resilient protector. A Defense Monster.",
    imageUrl: "/img/monster-selection-images/placeholder_monster_3.png",
    baseStats: {
      health: 30,
      armour: 16,
      attack: 1,
      speed: 3,
    },
    attackActionId: 1 as ActionId,
    defendActionId: 2 as ActionId,
    baseDefendActionCharges: 4,
    abilityActionId: 4 as ActionId,
    onSpawnActions: [],
  },
] as const;
