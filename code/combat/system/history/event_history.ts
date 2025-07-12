import { BattleEvent } from "./events";


export class EventHistory {
  readonly events: BattleEvent[];

  constructor() {
    this.events = [];
  }
}
