import { TIMEOUT_OPTION_MINOR, GetAction } from "../data/action_pool";
import { ActionData, asActionId } from "./action";
import { Battle } from "./battle";
import { hasEvent } from "./component";
import { asSideId } from "./side";
import { Server, Socket } from "socket.io";

// pass the initial state of the battle, from which this will handle it
export async function battle_runner(battle: Battle): Promise<void> {
  //! Phase: Planning
  console.log("🟡 Phase: Planning started - gathering player plans...");

  await Promise.all(
    battle.sides.map(async (side) => {
      console.log(`📨 Side [id=${side.id}] prompted to choose move and target.`);
      const chosenMove = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR));
      // const chosenMove = await new Promise((resolve) => setTimeout(resolve, TIMEOUT_OPTION_MINOR));

      console.log(`✅ Side [id=${side.id}] move selection complete: ${chosenMove}`);
    })
  );

  // Temporary hardcoded plan for demo/testing
  battle.sides[0].monster.queuedActionData = {
    actionId: asActionId(1),
    targetSideId: asSideId(1),
  };
  battle.sides[1].monster.queuedActionData = {
    actionId: asActionId(1),
    targetSideId: asSideId(0),
  };

  console.log("✅ All player plans gathered.\n");

  //! Phase: Turn Resolution
  console.log("🟣 Phase: Turn Resolution started - executing actions...");

  await Promise.all(
    battle.sides.map((side) => {
      const queuedActionSpecifier = side.monster.queuedActionData;

      if (!queuedActionSpecifier) {
        console.warn(`⚠️ Side [id=${side.id}] has no queued action.`);
        return;
      }

      const queuedAction = GetAction(queuedActionSpecifier.actionId);

      if (!queuedAction) {
        console.error(`❌ Invalid action ID for side [${side.id}]: ${queuedActionSpecifier.actionId}`);
        return;
      }

      console.log(`▶️ Executing action [id=${queuedActionSpecifier.actionId}] for side [id=${side.id}].`);
      return queuedAction.Perform(battle, side.id);
    })
  );

  console.log("✅ All actions resolved.\n");

  //! Phase: Turn Outcome
  console.log("🟢 Phase: Turn Outcome started - applying outcome effects...");

  await Promise.all(
    battle.sides.map((side) => {
      side.monster.components.map((component, index) => {
        if (hasEvent(component, "OnOutcome")) {
          console.log(`🔄 Applying OnOutcome for component [#${index}] on side [id=${side.id}].`);
          component.OnOutcome(battle);
        }
      });
    })
  );

  console.log("✅ All outcomes applied.\n");

  //! Cleanup Phase
  console.log("🔧 Cleaning up queued actions...");

  await Promise.all(
    battle.sides.map((side) => {
      side.monster.queuedActionData = null;
      console.log(`🧹 Cleared action queue for side [id=${side.id}].`);
    })
  );

  console.log("✅ All actions cleared. Ready for next turn.\n");

  //! Exit Condition Placeholder
  // TODO: Implement exit condition logic
}
