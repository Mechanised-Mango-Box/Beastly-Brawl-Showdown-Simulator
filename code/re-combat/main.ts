import { GetAction, TIMEOUT_OPTION_MINOR } from "./data/action_pool";
import { MonsterPool } from "./data/monster_pool";
import { asActionId } from "./system/action";
import { makeMonster, Monster } from "./system/monster";
import { getComponentAll, hasEvent } from "./system/component";
import { asBattleId, Battle } from "./system/battle";
import { asSideId } from "./system/side";

async function Main() {
  //~ Start game
  const battle: Battle = {
    sides: [
      {
        id: asSideId(0),
        controllingPlayerId: undefined,
        monster: makeMonster(MonsterPool[0]),
      },
      {
        id: asSideId(1),
        controllingPlayerId: undefined,
        monster: makeMonster(MonsterPool[0]),
      },
    ],
    battleId: asBattleId(0),
  };

  battle.sides.forEach((side) => {
    side.monster.health = side.monster.template.baseStats.health;
  }); //* Heal all to full

  //! Phase: Planning
  console.log("gather all plans from players"); // TODO: propper logging
  await Promise.all(
    battle.sides.map(async (side) => {
      console.log(`${side.id} EMIT: choose move and target`); // TODO: propper logging
      const chosenMove = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR)); //TODO: placeholder - either the response or a timeout
      console.log(`${side.id} chose to do ${chosenMove}`); // TODO: propper logging
    })
  );
  battle.sides[0].monster.queuedActionData = {
    actionId: asActionId(1),
    targetSideId: asSideId(1),
  };
  battle.sides[1].monster.queuedActionData = {
    actionId: asActionId(1),
    targetSideId: asSideId(0),
  };
  console.log("gathered all plans from players"); // TODO: propper logging

  //! Phase: Turn Resolution
  //# Gather and perform all tasks
  console.log("resolving all actions"); // TODO: propper logging
  await Promise.all(
    battle.sides
      // .filter((side) => side.monster.queuedAction)
      .map((side) => {
        const queuedActionSpecifier = side.monster.queuedActionData;
        if (!queuedActionSpecifier) {
          console.log(`${side.id} no action was queued`); // TODO: propper logging
          return;
        }

        const queuedAction = GetAction(queuedActionSpecifier.actionId);
        if (!queuedAction) {
          console.log("invalid action id"); // TODO: propper logging
          return;
        }

        return queuedAction.Perform(battle, side.id);
      })
  );
  console.log("resolved all actions"); // TODO: propper logging

  //! Phase: Turn Outcome
  //# Apply all applicable components
  console.log("applying all outcomes"); // TODO: propper logging
  await Promise.all(
    battle.sides.map((side) => {
      side.monster.components.map((component) => {
        if (hasEvent(component, "OnOutcome")) {
          component.OnOutcome(battle);
        }
      });
    })
  );
  console.log("applied all outcomes"); // TODO: propper logging

  console.log("clearing all actions"); // TODO: propper logging
  await Promise.all(
    battle.sides.map((side) => {
      side.monster.queuedActionData = null;
    })
  );
  console.log("cleared all actions"); // TODO: propper logging
}

Main();
