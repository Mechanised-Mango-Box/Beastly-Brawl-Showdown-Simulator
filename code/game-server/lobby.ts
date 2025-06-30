import { Battle } from "../combat/system/battle";
import { Host, Player } from "./user";
import { LobbyId, JoinCode, ServerId } from "../shared/types";
import { Socket } from "socket.io";

/**
 * Represents a lobby and the data within it.
 */
export class Lobby {
  //# Config
  lobbyId: LobbyId;
  joinCode: JoinCode;

  //# Users
  host: Host;
  players = new Map<string, Player>();

  //# Data
  battles: Battle[] = [];

  constructor(host: Host, lobbyId: LobbyId, joinCode: JoinCode) {
    this.lobbyId = lobbyId;
    this.joinCode = joinCode;

    this.host = host;
    this.setupHost()
  }

  hasPlayer(displayName: string): boolean {
    return this.players.has(displayName);
  }

  refreshPlayerList() {
    const playerNameList = [...this.players.values()!].map((player) => player.displayName);

    //* To host
    this.host.socket.emit("refreshPlayerList", playerNameList);

    //* To players
    this.players.forEach((player) => {
      player.socket.emit("refreshPlayerList", playerNameList);
    });
  }

  private setupHost() {
    this.host.socket.on("requestStartGame", () => {
      // if the given host has a room
      // host.room.beginGame()
      // foreach player in room -> enter monster selection scene
      // await start round
    });

    this.host.socket.on("requestStartRound", () => {
      // if the room has flag "ready for next round"
      // host.room.nextRound()
    });
  }

  addAndSetupPlayer(player: Player) {
    this.players.set(player.displayName, player);

    player.socket.on("submitMonsterChoice", () => {
      // checks if selection is locked in
      // if not assign this player's monster id
      throw new Error("Not implemented");
    });
    player.socket.on("submitGameReadyState", () => {
      // checks if game readyness is locked in
      // if not game the ready state
      throw new Error("Not implemented");
    });
    player.socket.on("submitMove", () => {
      // checks if move locked
      // if not override current move id and target
      throw new Error("Not implemented");
    });
    player.socket.on("submitMoveLockState", () => {
      // checks if not processing turn
      // if not then change move lock state
      throw new Error("Not implemented");
    });
  }
}
