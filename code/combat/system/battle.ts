import { Side, SideId } from "./side";
import { Monster, MonsterTemplate } from "./monster";
// import { GetAction } from "../data/action_pool";
import { ChooseAction } from "./notice/notice";
import { NoticeBoard } from "./notice/notice_board";
import { ActionId, ActionOptions } from "./action";
import { GetAction as getAction } from "../data/action_pool";
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
};

export interface BattleEvent {
  name: string;
}

interface SnapshotEvent extends BattleEvent {
  name: "snapshot";
  sides: Side[];
}

export class Battle {
  readonly seed: number;
  readonly sides: Side[];
  readonly eventHistory: BattleEvent[];

  readonly noticeBoard: NoticeBoard;

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

    this.eventHistory = [];

    this.noticeBoard = new NoticeBoard(options.playerOptionSet.length);
  }

  async run(): Promise<void> {
    console.log("Battle: Start");

    const initialState: SnapshotEvent = {
      name: "snapshot",
      sides: JSON.parse(JSON.stringify(this.sides)),
    };
    this.eventHistory.push(initialState);

    // TODO exit
    while (true) {
      //# Gather Actions
      console.log(`Gathered moves: Start`);
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
            ]; //# Save to data
            this.noticeBoard.removeNotice(side.id, "chooseAction");

            //# All if all sides ready -> move to next stage
            if (this.sides.every((side) => side.pendingActions)) {
              resolve();
            }
          };
          const notice: ChooseAction = {
            kind: "chooseAction",
            data: { possibleActionIds: [0, 1, 2] as ActionId[] }, // TODO choose based on monster (state)
            callback: callback,
          };
          this.noticeBoard.postNotice(side.id, notice);
        });
      });
      console.log(`Gathered moves: Complete`);

      //# Order Actions
      console.error("TODO: Order Actions");
      const actionQueue: ActionOptions[] = this.sides
        .map((side) => side.pendingActions)
        .filter((actions) => actions !== null)
        .flat();
      this.sides.forEach((side) => (side.pendingActions = [])); // # Remove from pending
      // actionQueue.sort()
      console.log(`Acton Queue:\n${JSON.stringify(actionQueue)}`);
      //# Resolve Actions
      console.error("TODO: Resolve Actions");
      actionQueue.forEach(action => {
        getAction(action.actionId)?.perform(this, action.source, action.target)
      });
    }
    console.log("Battle: Complete");
  }
}
