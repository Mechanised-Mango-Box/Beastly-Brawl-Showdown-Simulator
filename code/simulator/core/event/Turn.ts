import { SnapshotEvent } from "./core_events"
import { StartMoveEvent } from "./core_events"
import { BuffEvent } from "./core_events"
import { RollEvent } from "./core_events"
import { DamageEvent } from "./core_events"
import { BlockedEvent } from "./core_events"
import type { BaseEvent } from "./base_event"

export class Turn {
    turnEvents: BaseEvent[] = [];
    private snapshotEvent: SnapshotEvent | undefined
    private startMoveEvent: StartMoveEvent | undefined
    private buffEvent: BuffEvent | undefined
    private rollEvent: RollEvent | undefined
    private damageEvent: DamageEvent | undefined
    private blockEvent: BlockedEvent | undefined
    
    //add event to the turnEvents
    public addEvent(value: BaseEvent): void {
        this.turnEvents.push(value);
    }

    // Methods for SnapshotEvent
    public getSnapshotEvent(): SnapshotEvent | undefined{
        return this.snapshotEvent
    }

    public setSnapshotEvent(value: SnapshotEvent) {
        this.snapshotEvent = value
    }
    
    // Methods for StartMoveEvent
    public getStartMoveEvent(): StartMoveEvent | undefined{
        return this.startMoveEvent
    }

    public setStartMoveEvent(value: StartMoveEvent) {
        this.startMoveEvent = value
    }

    public startMoveEventText(): String {
        return this.startMoveEvent?.source + "uses " + this.startMoveEvent?.moveId + "."
    }
    
    // Methods for BuffEvent
    public getBuffEvent(): BuffEvent | undefined{
        return this.buffEvent
    }

    public setBuffEvent(value: BuffEvent) {
        this.buffEvent = value
    }

    public buffEventText(): String {
        return this.buffEvent?.source + " has activated " + this.buffEvent?.name + "."
    }

    // Methods for RollEvent
    public getRollEvent(): RollEvent | undefined {
        return this.rollEvent
    }

    public setRollEvent(value: RollEvent | undefined) {
        this.rollEvent = value
    }

    public rollEventText(): String | undefined {
        return this.rollEvent?.source + " has rolled a " + this.rollEvent?.result + "."
    }
        
    // Methods for DamageEvent
    public getDamageEvent(): DamageEvent | undefined {
        return this.damageEvent
    }

    public setDamageEvent(value: DamageEvent | undefined) {
        this.damageEvent = value
    }

    public damageEventText(): String | undefined {
        return this.damageEvent?.target + " has taken " + this.damageEvent?.amount + " amount of damage."
    }

    // Methods for BlockEvent
    public getBlockEvent(): BlockedEvent | undefined {
        return this.blockEvent
    }

    public setBlockEvent(value: BlockedEvent | undefined) {
        this.blockEvent = value
    }

    public blockEventText(): String | undefined {
        return this.blockEvent?.source + " has blocked " + this.blockEvent?.target + "'s move."
    }
}