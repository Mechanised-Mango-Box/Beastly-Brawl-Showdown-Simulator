import { log_notice } from "../../shared/utils";
import { TIMEOUT_OPTION_MINOR, GetAction, TIMEOUT_OPTION_CHOOSE_MOVE } from "../data/action_pool";
import { ActionId } from "./action";
import { Battle } from "./battle";
import { hasEvent } from "./component";
import { SideId, Turn } from "./side";

// pass the initial state of the battle, from which this will handle it
export async function battle_runner(battle: Battle): Promise<void> {
  do {
    battle.sides.map((side) => {
      const turn: Turn = {
        plannedAction: null,
        events: [],
      };
      side.turns.push(turn);
    });
    battle.turnCount++;

    //#region Planning
    console.log("🟡 Phase: Planning started - gathering player plans...");

    //# Request move
    const planEndTimestamp = Date.now() + TIMEOUT_OPTION_CHOOSE_MOVE;
    battle.sides.map((side) => {
      console.log(`📨 Side [id=${side.id}] prompted to choose move and target.`);
      side.controllingPlayer.socket.emit("requestMoveSelection", planEndTimestamp);
    });

    await new Promise((resolve) => setTimeout(resolve, planEndTimestamp - Date.now()));
    battle.sides.forEach((side) => {
      if (!side.monster.queuedActionData) {
        //* Assign Default Action
        side.monster.queuedActionData = {
          actionId: 1 as ActionId,
          targetSideId: ((side.id + 1) % battle.sides.length) as SideId,
        };
      }
      console.log(
        `Side #${side.id}'s ${side.monster.template.name} is planning to use action #${side.monster.queuedActionData.actionId} targeting side #${side.monster.queuedActionData.targetSideId}`
      );
    });
    battle.sides.map((side) => {
      const currentTurn = side.turns[battle.turnCount - 1];
      if (!currentTurn) {
        throw new Error("Expected turn does not exist.");
      }
      if (!side.monster.queuedActionData) {
        throw new Error("Expected queued data does not exist.");
      }
      currentTurn.plannedAction = side.monster.queuedActionData;
    });
    console.log("🟡 Phase: Planning Over - All unresolved given defaults\n");
    //#endregion

    //#region Turn Resolution
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
    //#endregion

    //#region Turn Outcome
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

    //# Cleanup
    console.log("🔧 Cleaning up queued actions...");

    await Promise.all(
      battle.sides.map((side) => {
        side.monster.queuedActionData = null;
        console.log(`🧹 Cleared action queue for side [id=${side.id}].`);
      })
    );

    console.log("✅ All actions cleared. Ready for next turn.\n");
    //#endregion

    //! Exit Condition Placeholder
    // TODO: Implement exit condition logic
  } while (battle.sides.every((side) => side.monster.health > 0));

  log_notice("BATTLE OVER\n" + battle_to_json_string(battle));
}
