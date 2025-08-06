import { SnapshotEvent } from "./core_events"
import { StartMoveEvent } from "./core_events"
import { BuffEvent } from "./core_events"
import { RollEvent } from "./core_events"
import { DamageEvent } from "./core_events"
import { BlockedEvent } from "./core_events"

export class Turn {
    private snapshotEvent: SnapshotEvent | undefined
    private startMoveEvent: StartMoveEvent | undefined
    private buffEvent: BuffEvent | undefined
    private rollEvent: RollEvent | undefined
    private damageEvent: DamageEvent | undefined
    private blockEvent: BlockedEvent | undefined
    
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
        return this.getSnapshotEvent().name
    }
    
    // Methods for BuffEvent
    public getBuffEvent(): BuffEvent | undefined{
        return this.buffEvent
    }

    public setBuffEvent(value: BuffEvent) {
        this.buffEvent = value
    }

    public buffEventText(): String {
        return this.getBuffEvent().name
    }

    // Methods for RollEvent
    public getRollEvent(): RollEvent | undefined {
        return this.rollEvent
    }

    public setRollEvent(value: RollEvent | undefined) {
        this.rollEvent = value
    }

    public rollEventText(): String | undefined {
        return this.getRollEvent().name
    }
        
    // Methods for DamageEvent
    public getDamageEvent(): DamageEvent | undefined {
        return this.damageEvent
    }

    public setDamageEvent(value: DamageEvent | undefined) {
        this.damageEvent = value
    }

    // Methods for BlockEvent
    public getBlockEvent(): BlockedEvent | undefined {
        return this.blockEvent
    }

    public setBlockEvent(value: BlockedEvent | undefined) {
        this.blockEvent = value
    }
}