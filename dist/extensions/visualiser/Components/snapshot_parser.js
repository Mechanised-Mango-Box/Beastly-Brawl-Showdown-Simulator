"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSnapshot = parseSnapshot;
console.log("snapshot parser loaded");
function parseSnapshot(snapshot) {
    return snapshot.sides.map((side) => ({
        id: side.id,
        name: side.monster.base.name,
        image: side.monster.base.imageUrl,
        health: side.monster.health,
        armour: side.monster.base.baseStats.armour,
        defendActionCharge: side.monster.defendActionCharges,
    }));
}
