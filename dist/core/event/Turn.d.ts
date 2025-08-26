import { SnapshotEvent, StartMoveEvent, BuffEvent, RollEvent, DamageEvent, BlockedEvent } from "./core_events";
import type { BaseEvent } from "./base_event";
export declare class Turn {
    turnEvents: BaseEvent[];
    private snapshotEvent;
    addEvent(value: BaseEvent): void;
    getSnapshotEvent(): SnapshotEvent | undefined;
    setSnapshotEvent(value: SnapshotEvent): void;
    startMoveEventText(startMoveEvent: StartMoveEvent): String;
    buffEventText(buffEvent: BuffEvent): String;
    rollEventText(rollEvent: RollEvent): String;
    damageEventText(damageEvent: DamageEvent): String;
    blockEventText(blockedEvent: BlockedEvent): String;
    printEventString(event: BaseEvent): String;
}
