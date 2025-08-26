"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHistory = void 0;
class EventHistory {
    constructor() {
        this.events = [];
        this.listeners = [];
    }
    addEvent(event) {
        const orderedEvent = { ...event, index: this.events.length };
        this.events.push(orderedEvent);
        this.emitOnNewEvent(orderedEvent);
    }
    subscribeListener(listener) {
        this.listeners.push(listener);
    }
    unsubscribeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }
    emitOnNewEvent(event) {
        this.listeners.forEach((listener) => {
            listener.onNewEvent(event);
        });
    }
}
exports.EventHistory = EventHistory;
