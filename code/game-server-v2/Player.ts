import Monsters from "../../data/monsters/Monsters"
import { AccountId } from "./types";

export class Player {
  socketId: string;
  displayName: string;
  linkedAccountId?: AccountId;
  spectators: AccountId[];
  monster?: Monsters;

  constructor(
    socketId: string,
    displayName: string,
    linkedAccountId: AccountId | undefined
  ) {
    this.socketId = socketId;
    this.displayName = displayName;
    this.linkedAccountId = linkedAccountId;
    this.spectators = [];
  }

  addSpectator(id: AccountId) {
    this.spectators.push(id);
  }

  setMonster(monster: Monsters) {
    this.monster  = monster;
  }
}
