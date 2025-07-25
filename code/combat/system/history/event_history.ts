import { BattleEvent } from "./events";

// TODO rename to action history???
type EventHistoryListener = {
  onNewEvent(event: BattleEvent): void;
};

export class EventHistory {
  /**
   * Do not modify this directly
   */
  readonly events: BattleEvent[];
  listeners: EventHistoryListener[];

  constructor() {
    this.events = [];
    this.listeners = [];
  }

  addEvent(event: BattleEvent) {
    this.events.push(event);
    this.emitOnNewEvent(event);
  }

  subscribeListener(listener: EventHistoryListener) {
    this.listeners.push(listener);
  }
  unsubscribeListener(listener: EventHistoryListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitOnNewEvent(event: BattleEvent) {
    this.listeners.forEach((listener) => {
      listener.onNewEvent(event);
    });
  }
}
