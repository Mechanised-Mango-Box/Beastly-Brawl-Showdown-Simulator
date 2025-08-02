import { RoomId, JoinCode, AccountId } from "./types";
import { Player } from "./Player";
import { GameSettings } from "./GameSettings";
import { Battle } from "./Battle";

export class LobbyManager {
  readonly hostSocketId: string;

  readonly roomId: RoomId;
  /**
   * The code which players can join the room with.
   *
   * Generated from {@link roomId} using {@link Sqids}
   */
  readonly joinCode: JoinCode;

  players: Map<string, Player> = new Map<string, Player>();
  battles: Battle[] = [];
  gameState: any = undefined;
  settings: GameSettings = new GameSettings();

  constructor(hostSocketId: string, roomId: RoomId, joinCode: JoinCode) {
    this.hostSocketId = hostSocketId;
    this.roomId = roomId;
    this.joinCode = joinCode;
  }

  createBattles() {
    this.battles = [];
    const playerArray = Array.from(this.players.values());

    for (let i = 0; i < playerArray.length; i += 2) {
      if (i + 1 < playerArray.length) {
        this.battles.push(new Battle(playerArray[i], playerArray[i + 1]));
      } else {
        this.battles.push(new Battle(playerArray[i]))
      }
    }
  }

  hasPlayer(displayName: string) {
    return this.players.has(displayName);
  }
}
