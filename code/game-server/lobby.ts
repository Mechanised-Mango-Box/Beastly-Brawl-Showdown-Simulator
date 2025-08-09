import { Battle } from "../simulator/core/battle";
import { MonsterPool } from "../simulator/data/monster_pool";
import { Host, Player } from "./user";
import { LobbyId, JoinCode, ServerId } from "../shared/types";

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
  private playersReadyForBattle: Set<string> = new Set();

  //# Data
  battles: Battle[] = [];

  constructor(host: Host, lobbyId: LobbyId, joinCode: JoinCode) {
    this.lobbyId = lobbyId;
    this.joinCode = joinCode;

    this.host = host;
    this.setupHost();
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
    this.host.socket.on("requestStartGame", async () => {
      const results = await Promise.allSettled(Array.from(this.players.values()).map((player) => player.socket.emitWithAck("requestMonsterSelection")));

      // Assign results back to players
      Array.from(this.players.values()).forEach((player, index) => {
        const result = results[index];
        if (result.status === "fulfilled") {
          const monsterName = result.value;

          const monster = MonsterPool.find(m => m.name === monsterName);
          if (monster) {
            player.monsterTemplate = monster;
          } else {
            console.warn("Monster not found for name:", monsterName);
          }
        }
      });
    });

    this.host.socket.on("requestStartRound", () => {
      // if the room has flag "ready for next round"
      // host.room.nextRound()
    });
  }

  checkAllPlayersReady() {
    // Make sure every player has selected a monster and is ready
    const allReady = [...this.players.values()].every(
      p => p.monsterTemplate && this.playersReadyForBattle.has(p.displayName)
    );

    if (allReady) {
      // Notify host and players that game can start
      this.host.socket.emit("gameReadyToStart");
      this.players.forEach(player => {
        player.socket.emit("gameReadyToStart");
      });
    }
  }

  addAndSetupPlayer(player: Player) {
    this.players.set(player.displayName, player);

    //#Region <<< Monster Selection >>>
    player.socket.on("submitMonsterChoice", () => {
      // validates the monster choice
      if (!player.monsterTemplate) {
        player.socket.emit("error", "No monster template selected.");
        return;
      }

      // Mark player as ready for battle
      this.playersReadyForBattle.add(player.displayName);

      // Inform the player their monster was accepted
      player.socket.emit("submitGameReadyState");

    });
    //#EndRegion <<< Monster Selection >>>

    //#Region <<< Game Readiness >>>
    player.socket.on("submitGameReadyState", () => {
      // Check if all players are ready for battle
      this.checkAllPlayersReady();
    });
    //#EndRegion <<< Game Readiness >>>

    //#Region <<< Move Selection >>>
    player.socket.on("submitMove", () => {
      // checks if move locked
      // if not override current move id and target
      throw new Error("Not implemented");
    });
    //#EndRegion <<< Move Selection >>>

    //#Region <<< Move Lock State >>>
    player.socket.on("submitMoveLockState", () => {
      // checks if not processing turn
      // if not then change move lock state
      throw new Error("Not implemented");
    });
    //#EndRegion <<< Move Lock State >>>
  }
}

