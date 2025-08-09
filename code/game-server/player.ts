import { MonsterTemplate } from "../simulator/core/monster/monster";
import { MonsterPool } from "../simulator/data/monster_pool"

export class Player {
  socketId: string;
  displayName: string;
  linkedAccountId?: string;
  spectators: string[];
  monster?: MonsterTemplate;

  constructor(socketId: string, displayName: string, linkedAccountId: string | undefined) {
    this.socketId = socketId;
    this.displayName = displayName;
    this.linkedAccountId = linkedAccountId;
    this.spectators = [];
  }

  getSpectators(): string[] {
    return this.spectators;
  }

  addSpectator(id: string) {
    this.spectators.push(id);
  }

  hasMonster(): boolean {
    return this.monster !== undefined;
  }

  getMonster(): MonsterTemplate | undefined {
    return this.monster;
  }

  setMonster(monster: MonsterTemplate) {
    this.monster = monster;
  }
}
