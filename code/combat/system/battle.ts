import { Side, SideId } from "./side";
import { Monster, MonsterTemplate } from "./monster";
import { CommunicationAdapter } from "./comms/communication_adapter";
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

  communicationAdapter: CommunicationAdapter;
};

export interface BattleEvent {
  name: string;
}

interface SnapshotEvent extends BattleEvent {
  name: "Snapshot";
  sides: Side[];
}

export class Battle {
  readonly seed: number;
  readonly sides: Side[];
  readonly eventHistory: BattleEvent[];

  readonly communicationAdapter: CommunicationAdapter;

  constructor(options: BattleOptions) {
    this.seed = options.seed;

    this.sides = options.playerOptionSet.map((playerOptions, idx) => {
      const side: Side = {
        id: idx as SideId,
        monster: new Monster(playerOptions.monsterTemplate),
        pendingActions: [],
      };
      return side;
    });

    this.eventHistory = [];
    this.communicationAdapter = options.communicationAdapter;
  }

  async run(): Promise<void> {
    const initialState: SnapshotEvent = {
      name: "Snapshot",
      sides: JSON.parse(JSON.stringify(this.sides)),
    };
    this.eventHistory.push(initialState);

    // TODO exit
    // while (true) {
    //# Gather Actions
    this.sides.forEach((side) => {
      this.communicationAdapter.subscribe(side.id, "onSubmitMove", (moveId: string, moveTarget: string) => {console.log(`TEMP on submit move: move=${moveId} target=${moveTarget}`)});
      this.communicationAdapter.emit<"chooseMove">(side.id, {
        moveIds: [],
      });
      // this.communicationAdapter.unsubscribe(side.id, "onSubmitMove");
    });

    // await new Promise();
    //# Order Actions
    //# Resolve Actions
  }
  // }
}
