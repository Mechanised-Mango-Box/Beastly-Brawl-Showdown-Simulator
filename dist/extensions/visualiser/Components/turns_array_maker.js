"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTurns = parseTurns;
const Turn_1 = require("../../../core/event/Turn");
function parseTurns(events) {
    const turnArray = [];
    let currentTurn = null;
    for (const event of events) {
        if (event.name === "snapshot") {
            currentTurn = new Turn_1.Turn();
            currentTurn.setSnapshotEvent(event);
            turnArray.push(currentTurn);
        }
        if (currentTurn) {
            currentTurn.addEvent(event);
        }
    }
    return turnArray;
}
