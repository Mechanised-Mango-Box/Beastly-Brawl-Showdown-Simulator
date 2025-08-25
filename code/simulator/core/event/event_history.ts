import { BaseEvent } from "./base_event";

type EventHistoryListener = {
  onNewEvent(event: BaseEvent): void;
};

export class EventHistory {
  /**
   * Do not modify this directly
   */
  readonly events: BaseEvent[];
  listeners: EventHistoryListener[];

  constructor() {
    this.events = [];
    this.listeners = [];
  }

  addEvent(event: BaseEvent) {
    this.events.push(event);
    this.emitOnNewEvent(event);
  }

  subscribeListener(listener: EventHistoryListener) {
    this.listeners.push(listener);
  }
  unsubscribeListener(listener: EventHistoryListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitOnNewEvent(event: BaseEvent) {
    this.listeners.forEach((listener) => {
      listener.onNewEvent(event);
    });
  }
}
