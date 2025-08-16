import { MonsterTemplate } from "./monster_template";

export type MonsterId = Lowercase<string>;

export interface MonsterPool {
  name: string;
  monsters: ReadonlyMap<MonsterId, MonsterTemplate>;
}
