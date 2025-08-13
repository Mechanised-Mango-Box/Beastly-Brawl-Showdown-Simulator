import { PRNG } from "./prng";

let rng: PRNG;
export function initRolls(prng: PRNG) {
  rng = prng;
}

export function roll(sides: number): number {
  return Math.floor(rng.next() * sides) + 1;
}
