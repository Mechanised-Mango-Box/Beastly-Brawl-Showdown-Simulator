/**
 * Linear Congruential Generator (LCG) for pseudo-random number generation.
 * Produces deterministic sequences of numbers based on an initial seed.
 */
export declare class PRNG {
    private seed;
    private readonly a;
    private readonly c;
    private readonly m;
    /**
     * @constructor
     * @param seed - Initial seed value, will be converted to a number between 0 and m-1
     */
    constructor(seed: number);
    /**
     * Gets the next random number in the sequence.
     * Updates the internal number using LCG formula:
     * X_{n+1} = (a * X_n + c) mod m
     *
     * @returns A decimal number between 0 (inclusive) and 1 (not inclusive)
     */
    next(): number;
}
