import { BaseEvent } from "./base_event";
export type OrderedEvent = BaseEvent & {
    /** The index in history this number exists as */
    index: number;
};
type EventHistoryListener = {
    onNewEvent(event: OrderedEvent): void;
};
export declare class EventHistory {
    /**
     * Do not modify this directly
     */
    readonly events: OrderedEvent[];
    listeners: EventHistoryListener[];
    constructor();
    addEvent(event: BaseEvent): void;
    subscribeListener(listener: EventHistoryListener): void;
    unsubscribeListener(listener: EventHistoryListener): void;
    private emitOnNewEvent;
}
export {};
