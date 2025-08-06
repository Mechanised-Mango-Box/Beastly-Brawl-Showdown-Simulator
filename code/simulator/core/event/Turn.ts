import { SnapshotEvent } from "./core_events"
import { StartMoveEvent } from "./core_events"
import { BuffEvent } from "./core_events"
import { RollEvent } from "./core_events"
import { DamageEvent } from "./core_events"
import { BlockedEvent } from "./core_events"

export class Turn {
    private _snapshotEvent: SnapshotEvent | undefined
    private _startMoveEvent: StartMoveEvent | undefined
    private _buffEvent: BuffEvent | undefined
    private _rollEvent: RollEvent | undefined
    private _damageEvent: DamageEvent | undefined
    private _blockEvent: BlockedEvent | undefined
    

    public get snapshotEvent(): SnapshotEvent | undefined{
        return this._snapshotEvent
    }

    public set snapshotEvent(value: SnapshotEvent) {
        this._snapshotEvent = value
    }
    
    public get startMoveEvent(): StartMoveEvent | undefined{
        return this._startMoveEvent
    }

    public set startMoveEvent(value: StartMoveEvent) {
        this._startMoveEvent = value
    }
    
    public get buffEvent(): BuffEvent | undefined{
        return this._buffEvent
    }

    public set buffEvent(value: BuffEvent) {
        this._buffEvent = value
    }

    public get rollEvent(): RollEvent | undefined {
        return this._rollEvent
    }

    public set rollEvent(value: RollEvent | undefined) {
        this._rollEvent = value
    }
        
    public get damageEvent(): DamageEvent | undefined {
        return this._damageEvent
    }

    public set damageEvent(value: DamageEvent | undefined) {
        this._damageEvent = value
    }

    public get blockEvent(): BlockedEvent | undefined {
        return this._blockEvent
    }

    public set blockEvent(value: BlockedEvent | undefined) {
        this._blockEvent = value
    }
}