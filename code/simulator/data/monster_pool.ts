// TODO: make swappable instead of a global
import { Battle } from "../core/battle";
import { DodgeChargeComponent, RerollChargeComponent } from "../core/monster/core_components";
import { MonsterTemplate } from "../core/monster/monster";
import { SideId } from "../core/side";

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
    attackActionId: "attack-normal",
    defendActionId: "defend",
    baseDefendActionCharges: 3,
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
    attackActionId: "attack-normal",
    defendActionId: "defend",
    baseDefendActionCharges: 3,
    onSpawnActions: [
      {
        type: "spawnAction",
        do: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push(new RerollChargeComponent(1));
        },
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
    attackActionId: "attack-normal",
    defendActionId: "defend",
    baseDefendActionCharges: 3,
    abilityActionId: "dodge",
    onSpawnActions: [
      {
        type: "spawnAction",
        do: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push(new DodgeChargeComponent(1));
        },
      },
      {
        type: "spawnAction",
        do: async function (world: Battle, source: SideId): Promise<void> {
          world.sides[source].monster.components.push({
            kind: "crit",
            getCritChanceBonus: () => 5,
          });
        },
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
    attackActionId: "attack-normal",
    defendActionId: "defend",
    baseDefendActionCharges: 4,
    abilityActionId: "stun",
    onSpawnActions: [],
  },
] as const;
