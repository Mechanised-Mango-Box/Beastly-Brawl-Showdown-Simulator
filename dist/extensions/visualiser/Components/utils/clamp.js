"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = clamp;
function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
}
