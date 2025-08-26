"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turn = void 0;
class Turn {
    constructor() {
        this.turnEvents = [];
    }
    //add event to the turnEvents
    addEvent(value) {
        this.turnEvents.push(value);
    }
    // Methods for SnapshotEvent
    getSnapshotEvent() {
        return this.snapshotEvent;
    }
    setSnapshotEvent(value) {
        this.snapshotEvent = value;
    }
    startMoveEventText(startMoveEvent) {
        return startMoveEvent.source + " uses " + startMoveEvent.moveId + ".";
    }
    buffEventText(buffEvent) {
        return buffEvent.source + " has activated " + buffEvent.name + ".";
    }
    rollEventText(rollEvent) {
        return rollEvent.source + " has rolled a " + rollEvent.result + ".";
    }
    damageEventText(damageEvent) {
        return damageEvent.target + " has taken " + damageEvent.amount + " damage.";
    }
    blockEventText(blockedEvent) {
        return blockedEvent?.source + " has blocked " + blockedEvent.target + "'s move.";
    }
    printEventString(event) {
        switch (event.name) {
            case "snapshot":
                return "Start of turn";
            case "buff": {
                const buffEvent = event;
                return this.buffEventText(buffEvent);
            }
            case "startMove": {
                const startMoveEvent = event;
                return this.startMoveEventText(startMoveEvent);
            }
            case "roll": {
                const rollEvent = event;
                return this.rollEventText(rollEvent);
            }
            case "blocked": {
                const blockedEvent = event;
                return this.blockEventText(blockedEvent);
            }
            case "damage": {
                const damageEvent = event;
                return this.damageEventText(damageEvent);
            }
            default:
                return event.name;
        }
    }
}
exports.Turn = Turn;
