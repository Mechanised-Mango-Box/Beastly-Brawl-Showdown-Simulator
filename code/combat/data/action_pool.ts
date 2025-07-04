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
      const monster = battle.sides[sourceSideId].monster;
      const actionData = battle.sides[sourceSideId].monster.queuedActionData;

      if (!actionData) {
        throw new Error("This action was triggered without an existing action data.");
      }

      //First Roll
      console.log(`${sourceSideId} EMIT: Tell the player to roll a d20`); //TODO: placeholder
      const playerRolled = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); //TODO: placeholder - either the response or a timeout

      let rollResult = roll(20);
      console.log(`${sourceSideId} EMIT: the roll is ${rollResult}`); //TODO: placeholder
      /*
      Give the player an option of rerolling if they can once they ACK the roll
      */
      const rerollComponent = getComponent(monster, "rerollAttack");
      let usedReroll = false;
      if (rerollComponent && typeof rerollComponent.use === "function" && rerollComponent.use()) {
        // Offer or trigger reroll
        console.log(`${sourceSideId} can reroll the attack. EMIT: Ask player if they want to reroll.`);
        await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); // Placeholder for player input
        rollResult = roll(20);
        usedReroll = true;
        console.log(`${sourceSideId} EMIT: the reroll is ${rollResult}`);
      }

      // Check if the attack hits
      if (rollResult <= battle.sides[actionData.targetSideId].monster.template.baseStats.armorClass) {
        console.log(`${sourceSideId} EMIT: missed the attack on ${actionData.targetSideId}.`);
        return; // Attack missed
      }

      // Check for greaterCrit component
      const greaterCritComponent = getComponent(monster, "greaterCrit");
      const isCrit = greaterCritComponent
        ? rollResult >= 18 // Crit on 18, 19, or 20
        : rollResult === 20;

      let damageToTake = 0;

      if (isCrit) {
        console.log(`${sourceSideId} scored a critical hit on ${actionData.targetSideId}.`);
        damageToTake = (roll(4) + monster.template.baseStats.attack) * 2; // Double damage for crit
        console.log(`${sourceSideId} EMIT: Critical hit damage is ${damageToTake}`);
      } else {
        damageToTake = roll(4) + monster.template.baseStats.attack; // Normal damage
        console.log(`${sourceSideId} EMIT: Normal hit damage is ${damageToTake}`);
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
    async Perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;

      // Check for available defend charges
      if (monster.defendActionCharges <= 0) {
        console.log(`${sourceSideId} has no defend charges left.`);
        return;
      }

      // Consume one defend charge
      monster.defendActionCharges -= 1;

      // Create a component to increase AC
      const defenseComponent: Component = {
        name: "defense",
        OnOutcome: (battle: Battle) => {
          monster.template.baseStats.armorClass += 2;
          console.log(`${sourceSideId}'s AC increased by 2 for this turn.`);
        },
      };

      // Add the defense component to the monster
      monster.components.push(defenseComponent);
    },
  },

  {
    name: "Dodge",
    description: "Dodge an attack, avoid it completely.",
    async Perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;

      // Check for available dodge charges
      const dodgeComponent = getComponent(monster, "dodge");
      if (!dodgeComponent || typeof dodgeComponent.use !== "function" || !dodgeComponent.use()) {
        console.log(`${sourceSideId} has no dodge charges left.`);
        return;
      }

      // Create a component to increase AC temporarily
      const dodgeDefenseComponent: Component = {
        name: "dodgeDefense",
        OnOutcome: (battle: Battle) => {
          monster.template.baseStats.armorClass += 3; // Increase AC by 3 for this turn
          console.log(`${sourceSideId}'s AC increased by 3 for this turn.`);
        },
      };

      // Add the dodge defense component to the monster
      monster.components.push(dodgeDefenseComponent);
    }
  },

  {
    name: "Stun",
    description: "Stun the monster, preventing it from taking actions for one turn.",
    async Perform(battle: Battle, sourceSideId: SideId): Promise<void> {
      const monster = battle.sides[sourceSideId].monster;
      const stunComponent = getComponent(monster, "stun");
      if (!stunComponent || typeof stunComponent.use !== "function" || !stunComponent.use()) {
        console.log(`${sourceSideId} has no stun charges left.`);
        return;
      }
    } 
  },
];
