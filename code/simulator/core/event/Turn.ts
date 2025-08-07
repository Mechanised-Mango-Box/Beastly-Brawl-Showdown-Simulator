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

    public startMoveEventText(startMoveEvent: StartMoveEvent): String {
        return startMoveEvent.source + "uses " + startMoveEvent.moveId + "."
    }
    
    // Methods for BuffEvent
    public getBuffEvent(): BuffEvent | undefined{
        return this.buffEvent
    }

    public setBuffEvent(value: BuffEvent) {
        this.buffEvent = value
    }

    public buffEventText(buffEvent: BuffEvent): String {
        return buffEvent.source + " has activated " + buffEvent.name + "."
    }

    // Methods for RollEvent
    public getRollEvent(): RollEvent | undefined {
        return this.rollEvent
    }

    public setRollEvent(value: RollEvent | undefined) {
        this.rollEvent = value
    }

    public rollEventText(rollEvent: RollEvent): String {
        return rollEvent.source + " has rolled a " + rollEvent.result + "."
    }
        
    // Methods for DamageEvent
    public getDamageEvent(): DamageEvent | undefined {
        return this.damageEvent
    }

    public setDamageEvent(value: DamageEvent | undefined) {
        this.damageEvent = value
    }

    public damageEventText(damageEvent: DamageEvent): String {
        return damageEvent.target + " has taken " + damageEvent.amount + " damage."
    }

    // Methods for BlockEvent
    public getBlockEvent(): BlockedEvent | undefined {
        return this.blockEvent
    }

    public setBlockEvent(value: BlockedEvent | undefined) {
        this.blockEvent = value
    }

    public blockEventText(blockedEvent: BlockedEvent): String {
        return blockedEvent?.source + " has blocked " + blockedEvent.target + "'s move."
    }

    public printEventString(event: BaseEvent): String {
        if (event.name == "snapshot") {
            return "Start of turn"
        } else if (event.name == "buff") {
            const buffEvent = event as BuffEvent
            return this.buffEventText(buffEvent)
        } else if (event.name == "startMove") {
            const startMoveEvent = event as StartMoveEvent
            return this.startMoveEventText(startMoveEvent)
        } else if (event.name == "roll") {
            const rollEvent = event as RollEvent
            return this.rollEventText(rollEvent)
        } else if (event.name == "blocked") {
            const blockedEvent = event as BlockedEvent
            return this.blockEventText(blockedEvent)
        } else if (event.name == "damage") {
            const damageEvent = event as DamageEvent
            return this.damageEventText(damageEvent)
        }

        return event.name
    }
}