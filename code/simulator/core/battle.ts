import { Side, SideId } from "./side";
import { Monster, MonsterTemplate } from "./monster/monster";
import { ChooseMove as chooseMove } from "./notice/notice";
import { NoticeBoard } from "./notice/notice_board";
import { EventHistory } from "./event/event_history";
import { BattleOverEvent, SnapshotEvent } from "./event/core_events";
import { commonMovePool } from "../data/common_move_pool";
import { MoveData, MoveRequest } from "./action/move/move";
import { EntryID } from "./types";
import { TargetingData } from "./action/targeting";
import { PRNG } from "./prng";

export interface PlayerOptions {
  monsterTemplate: MonsterTemplate; //! Can change to list if needed later
}

export type BattleOptions = {
  seed: number;

  playerOptionSet: PlayerOptions[];
};

export class Battle {
  readonly rng: PRNG;
  readonly sides: Side[];

  readonly eventHistory: EventHistory;

  readonly noticeBoard: NoticeBoard;

  constructor(options: BattleOptions) {
    this.rng = new PRNG(options.seed);

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
          const callback: (moveId: EntryID, target: TargetingData) => void = (
            moveId: EntryID,
            targetingData: TargetingData
          ): void => {
            // TODO validate move

            const chosenMove: MoveData = commonMovePool[moveId];
            if (chosenMove.targetingMethod != targetingData.targetingMethod) {
              console.error(
                `Error: Targeting method mismatch. [moveId=${moveId} ${chosenMove.name}] expects ${chosenMove.targetingMethod} but ${targetingData.targetingMethod} was recieved.`
              );
              return;
            }

            side.pendingActions = [
              /// For now there will only ever be one action per turn.
              {
                moveId: moveId,
                source: side.id,
                targetingData: targetingData,
              },
            ]; /// Save to data
            this.noticeBoard.removeNotice(side.id, "chooseMove");

            // TODO allow for something else to decide on when to resolve a turn
            /// All if all sides ready -> ready move to next stage
            if (this.sides.every((side) => side.pendingActions)) {
              resolve();
            }
          };
          const notice: chooseMove = {
            kind: "chooseMove",
            data: {
              moveIdOptions: [
                side.monster.base.attackActionId,
                ...(side.monster.defendActionCharges > 0
                  ? [side.monster.base.defendActionId]
                  : []),
              ],
            }, // TODO select special attack
            callback: callback,
          };
          this.noticeBoard.postNotice(side.id, notice);
        });
      });
      console.log(`Gather moves: Complete`);

      //#################
      //# Order Actions #
      //#################
      const allMovesUnsorted: MoveRequest[] = this.sides
        .map((side) => side.pendingActions)
        .filter((actions) => actions !== null)
        .flat();
      this.sides.forEach((side) => (side.pendingActions = null)); /// Remove from pending
      const moveRequestQueue: MoveRequest[] = allMovesUnsorted.sort((a, b) => {
        /// Sort by move priority class
        const moveA: MoveData = commonMovePool[a.moveId];
        const moveB: MoveData = commonMovePool[b.moveId];
        if (moveA.priorityClass !== moveB.priorityClass) {
          return moveB.priorityClass - moveA.priorityClass;
        }

        /// Sort by source monster speed
        return this.sides[b.source].monster.getSpeed() - this.sides[a.source].monster.getSpeed();

      });
      console.log(`Acton Queue:\n${JSON.stringify(moveRequestQueue)}`);

      //###################
      //# Resolve Actions #
      //###################
      console.log("Resolve Actions");
      for (const moveRequest of moveRequestQueue) {
        const move: MoveData = commonMovePool[moveRequest.moveId];
        if (this.sides[moveRequest.source].monster.getIsBlockedFromMove()) {
          console.log(
            `Monster could not perform move right now (probs status).`
          );
          continue;
        }

        await move.perform(this, moveRequest.source, moveRequest.targetingData);
        console.log(`Resolved move id=${moveRequest.moveId}`);
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


