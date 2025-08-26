"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roll = roll;
function roll(rng, sides) {
    return Math.floor(rng.next() * sides) + 1;
}
