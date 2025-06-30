import { Action, ActionId } from "../system/action";
import { getComponent } from "../system/component";
import { Component } from "../system/component";
import { Battle } from "../system/battle";
import { SideId } from "../system/side";
import { roll } from "../system/roll";

export function GetAction(actionId: ActionId): Action | null {
  /// If action exists
  if (0 <= actionId && actionId < ActionPool.length) return ActionPool[actionId];
  return null;
}

export const TIMEOUT_OPTION_MINOR = 1000; //10000; // TODO move to proper config area
export const TIMEOUT_OPTION_MAJOR = 30000; // TODO move to proper config area

const ActionPool: Action[] = [
  {
    name: "Nothing",
    description: "Do nothing...",
    Perform: function (battle: Battle, sourceSideId: SideId): Promise<void> {
      throw new Error("Function not implemented.");
    },
  },

  {
    name: "Normal Attack",
    description: "Perform a regular attack.",
    async Perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const actionData = battle.sides[sourceSideId].monster.queuedActionData;
      if (!actionData) {
        throw new Error("This action was triggered without an existing action data.");
      }
      let rollResult = -1;

      console.log(`${sourceSideId} EMIT: Tell the player to roll a d20`); //TODO: placeholder
      const playerRolled = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); //TODO: placeholder - either the response or a timeout

      rollResult = roll(20);
      console.log(`${sourceSideId} EMIT: the roll is ${rollResult}`); //TODO: placeholder
      /*
      Give the player an option of rerolling if they can once they ACK the roll
      */
      if (true) {
        const playerUseRerollAbility = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); //TODO: placeholder - either the response or a timeout

        // if playerWantReroll is true
        //TODO Remove reroll charge
        console.log(`${sourceSideId} EMIT: Tell player to roll a d20.`); //TODO: placeholder
        rollResult = roll(20);
        console.log(`${sourceSideId} EMIT: the roll is ${rollResult}`); //TODO: placeholder

        const damageToTake = rollResult / 2; //TODO: placeholder

        const damageComponent: Component = {
          name: "damage",
          damage: damageToTake,
          OnOutcome: (battle: Battle) => {
            battle.sides[actionData.targetSideId].monster.health -= damageToTake;
            console.log(`${actionData.targetSideId} took ${damageToTake} damage from ${sourceSideId}`);
          },
        };
        battle.sides[sourceSideId].monster.components.push(damageComponent);
      }
    },
  },
];
