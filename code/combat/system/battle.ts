import { Side, SideId } from "./side";
import { Monster, MonsterTemplate } from "./monster/monster";
import { ChooseMove as chooseMove } from "./notice/notice";
import { NoticeBoard } from "./notice/notice_board";
import { Action, ActionId, ActionOptions } from "./action";
import { getAction as getAction } from "../data/action_pool";
import { EventHistory } from "./history/event_history";
import { BattleOverEvent, SnapshotEvent } from "./history/events";
export interface PlayerOptions {
  name: string;
  /**
   * A copy of a template
   */
  monsterTemplate: MonsterTemplate; //! Can change to list if needed later
}

export type BattleOptions = {
  seed: number;

  playerOptionSet: PlayerOptions[];

  player_option_timeout: number;
};

export class Battle {
  readonly seed: number;
  readonly sides: Side[];
  readonly eventHistory: EventHistory;

  readonly noticeBoard: NoticeBoard;

  readonly player_option_timeout: number;

  constructor(options: BattleOptions) {
    this.seed = options.seed;

    this.sides = options.playerOptionSet.map((playerOptions, idx) => {
      const side: Side = {
        id: idx as SideId,
        monster: new Monster(playerOptions.monsterTemplate),
        pendingActions: null,
      };
      return side;
    });

    this.eventHistory = new EventHistory();

    this.noticeBoard = new NoticeBoard(options.playerOptionSet.length);

    this.player_option_timeout = options.player_option_timeout;
  }

  // TODO ? make the battle director a swappable component
  async run(): Promise<void> {
    console.log("Battle: Start");

    const initialState: SnapshotEvent = {
      name: "snapshot",
      sides: JSON.parse(JSON.stringify(this.sides)),
    };
    this.eventHistory.addEvent(initialState);

    // TODO exit
    while (this.sides.every((side) => side.monster.health > 0)) {
      //#########################
      //# Start of turn trigger #
      //#########################
      this.sides.forEach((side) => {
        side.monster.components.forEach((component) => {
          if (component.onStartTurn === undefined) {
            return;
          }
          component.onStartTurn(this, side.id);
        });
      });

      //##################
      //# Gather Actions #
      //##################
      console.log(`Gather moves: Start`);
      await new Promise<void>((resolve) => {
        this.sides.forEach((side) => {
          const callback: (actionId: ActionId, target: SideId) => void = (actionId: ActionId, target: SideId): void => {
            // TODO validate move
            side.pendingActions = [
              {
                source: side.id,
                target: target,
                actionId: actionId,
              },
            ]; /// Save to data
            this.noticeBoard.removeNotice(side.id, "chooseMove");

            /// All if all sides ready -> move to next stage
            if (this.sides.every((side) => side.pendingActions)) {
              resolve();
            }
          };
          const notice: chooseMove = {
            kind: "chooseMove",
            data: { moveActionIds: [0, 1, 2] as ActionId[] }, // TODO choose based on monster (i.e. special attack)
            callback: callback,
          };
          this.noticeBoard.postNotice(side.id, notice);
        });
      });
      console.log(`Gather moves: Complete`);

      //#################
      //# Order Actions #
      //#################
      console.error("TODO: Order Actions");
      const allActionsUnsorted: ActionOptions[] = this.sides
        .map((side) => side.pendingActions)
        .filter((actions) => actions !== null)
        .flat();
      this.sides.forEach((side) => (side.pendingActions = null)); /// Remove from pending
      const actionOptionsQueue: ActionOptions[] = allActionsUnsorted.sort((a, b) => {
        /// Sort by move priority class
        const actionA: Action = getAction(a.actionId)!;
        const actionB: Action = getAction(b.actionId)!;
        if (actionA.priortyClass !== actionB.priortyClass) {
          return actionB.priortyClass - actionA.priortyClass;
        }

        /// Sort by source monster speed
        return this.sides[b.source].monster.template.baseStats.speed - this.sides[a.source].monster.template.baseStats.speed; // TODO get speed rather than use base
      });
      console.log(`Acton Queue:\n${JSON.stringify(actionOptionsQueue)}`);

      //###################
      //# Resolve Actions #
      //###################
      console.log("Resolve Actions");
      for (const action of actionOptionsQueue) {
        const actionHandler: Action | null = getAction(action.actionId);
        if (!actionHandler) {
          throw new Error(`Action of this id=${action.actionId} does not exist.`);
        }

        if (this.sides[action.source].monster.getIsBlockedFromAction()) {
          console.log(`Monster could not perform action right now (probs status).`);
          continue;
        }

        await actionHandler.perform(this, action.source, action.target);
        console.log(`Resolved action id=${action.actionId}`);
      }

      //#######################
      //# End of turn trigger #
      //#######################
      this.sides.forEach((side) => {
        side.monster.components.forEach((component) => {
          if (component.onEndTurn === undefined) {
            return;
          }
          component.onEndTurn(this, side.id);
        });
      });

      const endOfTurnSnapshotEvent: SnapshotEvent = {
        name: "snapshot",
        sides: JSON.parse(JSON.stringify(this.sides)),
      };
      this.eventHistory.addEvent(endOfTurnSnapshotEvent);
    }

    const battleOverEvent: BattleOverEvent = {
      name: "battleOver",
    };
    this.eventHistory.addEvent(battleOverEvent);
  }
}
