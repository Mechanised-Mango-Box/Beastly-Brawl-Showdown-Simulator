import { ActionInterruptKind, Monster } from "./Combat";
import { ActionPool, MonsterPool } from "./data/PLACEHOLDER_DATA";

enum BattlePhase {
  ERROR = 0,
  PLANNING = 1,
  RESOLVING = 2,
  REACTION = 3,
}

const monA: Monster = {
  template: MonsterPool[0],
  currentModifiers: {
    health: 0,
    armorClass: 0,
    attack: 0,
  },
  currentHealth: 0,
};
const monB: Monster = {
  template: MonsterPool[0],
  currentModifiers: {
    health: 0,
    armorClass: 0,
    attack: 0,
  },
  currentHealth: 0,
};

let phase: BattlePhase = BattlePhase.ERROR;

//! Start game
monA.currentHealth = monA.template.baseStats.health;
monB.currentHealth = monB.template.baseStats.health;

//# gather moves
phase = BattlePhase.PLANNING;

let actionId_A = 1;
let actionId_B = 1;

//# resolve
const actionA = ActionPool[actionId_A].ActionGenerator(monA, monB);
const actionB = ActionPool[actionId_B].ActionGenerator(monB, monA);

let result = actionA.next();
while (!result.done) {
  console.log("Action Interrupt:", result.value);

  switch (result.value.kind) {
    case ActionInterruptKind.ROLL: {
      console.log("Request dice roll");
      break;
    }

    default: {
      throw new Error("Invalid Action Interrupt.");
    }
  }

  result = actionA.next();
}
