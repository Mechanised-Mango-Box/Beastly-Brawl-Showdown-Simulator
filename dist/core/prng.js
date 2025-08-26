"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRNG = void 0;
/**
 * Linear Congruential Generator (LCG) for pseudo-random number generation.
 * Produces deterministic sequences of numbers based on an initial seed.
 */
class PRNG {
    /**
     * @constructor
     * @param seed - Initial seed value, will be converted to a number between 0 and m-1
     */
    constructor(seed) {
        this.a = 1664525;
        this.c = 1013904223;
        this.m = 2 ** 32;
        this.seed = seed % this.m;
    }
    /**
     * Gets the next random number in the sequence.
     * Updates the internal number using LCG formula:
     * X_{n+1} = (a * X_n + c) mod m
     *
     * @returns A decimal number between 0 (inclusive) and 1 (not inclusive)
     */
    next() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}
exports.PRNG = PRNG;
