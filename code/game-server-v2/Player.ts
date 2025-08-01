import { AccountId } from "./types";

export class Player {
  socketId: string;
  displayName: string;
  linkedAcccountId?: AccountId;
  spectators: Player[];

  constructor(
    socketId: string,
    displayName: string,
    linkedAcccountId: AccountId | undefined
  ) {
    this.socketId = socketId;
    this.displayName = displayName;
    this.linkedAcccountId = linkedAcccountId;
    this.spectators = [];
  }

  addSpectator(player: Player) {
    this.spectators.push(player);
  }
}
