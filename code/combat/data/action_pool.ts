// TODO: make swappable instead of a global
import { Action, ActionId } from "../system/action";
import { getComponent } from "../system/monster";
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
export const TIMEOUT_OPTION_CHOOSE_MOVE = 1000;// 30000; // TODO move to proper config area

const ActionPool: Action[] = [
  {
    name: "Nothing",
    description: "Do nothing...",
    perform: function (battle: Battle, sourceSideId: SideId): Promise<void> {
      throw new Error("Function not implemented.");
    },
  },

  {
    name: "Normal Attack",
    description: "Perform a regular attack.",
    async perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;
      const actionData = monster.queuedActionData;

      if (!actionData) {
        throw new Error("This action was triggered without an existing action data.");
      }

      //First Roll
      console.log(`${sourceSideId} EMIT: Tell the player to roll a d20`); //TODO: placeholder
      const playerRolled = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); //TODO: placeholder - either the response or a timeout

      let rollResult = roll(20);
      console.log(`${sourceSideId} EMIT: the roll is ${rollResult}`); //TODO: placeholder

      // Check if the monster has dodge component
      const dodgeComponent = getComponent(monster, "dodge");
      if (dodgeComponent && dodgeComponent.used === false) {
        console.log(`${actionData.targetSideId} has dodged the attack.`);
        dodgeComponent.used = true; // Mark the dodge as used
        return; // Exit early, the attack is dodged
      }
        // Monster has a dodge component, increase armor 

      // Check if the attack hits
      if (rollResult <= monster.currentArmorClass) {
        console.log(`${sourceSideId} EMIT: missed the attack on ${actionData.targetSideId}.`);
        return; // Attack missed
      }

      // Determine if this is a critical hit
      const greaterCritComponent = getComponent(monster, "greaterCrit");
      const isCrit = greaterCritComponent ? rollResult >= 18 : rollResult === 20;

      // Base damage roll
      const baseDamage = roll(4) + monster.template.baseStats.attack;

      // Apply critical multiplier
      const damageToTake = isCrit ? baseDamage * 2 : baseDamage;

      // Logging
      console.log(`${sourceSideId} ${isCrit ? "scored a CRITICAL HIT" : "hit"} ${actionData.targetSideId}.`);


      // Give the player an option of rerolling if they can once they ACK the roll
      const rerollComponent = getComponent(monster, "rerollAttack");
      let usedReroll = false;

      if (rerollComponent && rerollComponent.charges > 0) {
        // Ask player if they want to reroll
        console.log(`${sourceSideId} EMIT: Ask player if they want to reroll.`);

        const playerWantsReroll = await new Promise((resolve) => {
          // Simulate player input or timeout
          setTimeout(() => resolve(true), TIMEOUT_OPTION_MINOR); // Replace true with actual input handling
        });

        if (playerWantsReroll) {
          const success = rerollComponent.use(); // Consume charge only after player accepts
          if (success) {
            rollResult = roll(20);
            usedReroll = true;
            console.log(`${sourceSideId} the reroll is ${rollResult}`);
          } else {
            console.log(`${sourceSideId} tried to reroll, but had no charges left.`);
          }
        }
      }


      const damageComponent: Component = {
        name: "damage",
        damage: damageToTake,
        OnOutcome: (battle: Battle) => {
          battle.sides[actionData.targetSideId].monster.health -= damageToTake;
          console.log(`${actionData.targetSideId} took ${damageToTake} damage from ${sourceSideId}`);
        },
      };
      monster.components.push(damageComponent);

      if (usedReroll) {
        console.log(`${sourceSideId} used a reroll for the attack.`);
      }
    },
  },

  {
    name: "Defend",
    description: "Increase your armor class temporarily.",
    async perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;

      // Check for available defend charges
      if (monster.defendActionCharges <= 0) {
        console.log(`${sourceSideId} has no defend charges left.`);
        return;
      }

      // Consume one defend charge
      monster.defendActionCharges -= 1;

      // Increase the monster's armor class by 2 for this turn
      monster.currentArmorClass += 2;
      console.log(`${sourceSideId}'s AC increased by 2 for this turn.`);

      // Create a component to increase AC
      const defenseComponent: Component = {
        name: "defense",
        OnOutcome: (battle: Battle) => {
          // Reset the monster's armor class to its base value at the end of the turn
          resetMonsterArmorClass(monster);
        },
      };

      // Add the defense component to the monster
      monster.components.push(defenseComponent);
    },
  },

  {
    name: "Dodge",
    description: "Dodge an attack, avoid it completely.",
    async perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;

      // Check for available dodge charges
      const dodgeComponent = getComponent(monster, "dodge");
      if (!dodgeComponent || !dodgeComponent.use()) {
        console.log(`${sourceSideId} has no dodge charges left.`);
        return;
      };

      // Create a component to increase AC temporarily
      const dodgeDefenseComponent: Component = {
        name: "dodgeDefense",
        used: false,
      };

      // Add the dodge defense component to the monster
      monster.components.push(dodgeDefenseComponent);
    }
  },

  {
    name: "Stun",
    description: "Stun the monster, preventing it from taking actions for one turn.",
    async perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;
      const stunComponent = getComponent(monster, "stun");
      if (!stunComponent || !stunComponent.use()) {
        console.log(`${sourceSideId} has no stun charges left.`);
        return;
      }
    }
  },
];
