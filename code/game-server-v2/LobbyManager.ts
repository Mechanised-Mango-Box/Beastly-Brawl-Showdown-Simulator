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

  playersByAccountId: Map<AccountId, Player> = new Map();

  battles: Battle[] = [];
  gameState: any = undefined;
  settings: GameSettings = new GameSettings();

  constructor(hostSocketId: string, roomId: RoomId, joinCode: JoinCode) {
    this.hostSocketId = hostSocketId;
    this.roomId = roomId;
    this.joinCode = joinCode;
  }

  createBattles(playerList: Player[]) {
    this.battles = [];

    for (let i = 0; i < playerList.length; i += 2) {
      let matchID = i / 2 + 1;
      if (i + 1 < playerList.length) {
        this.battles.push(new Battle(playerList[i], matchID, playerList[i + 1]));
      } else {
        this.battles.push(new Battle(playerList[i], matchID));
      }
    }

    console.log(`Created ${this.battles.length} battles for this round.`);
  }

  // To be called immediately after a battle ends
  async reportBattleResults(winnerId: AccountId, battleID: number): Promise<void> {
    // Find the battle by ID
    const battle = this.battles.find(b => b.battleID === battleID);
    if (!battle) {
      throw new Error(`Battle with ID ${battleID} not found.`);
    }

    battle.winnerId =  winnerId;

    // Retrieve the loser's AccountId
    const loserId = battle.player1.linkedAccountId === winnerId
      ? battle.player2?.linkedAccountId
      : battle.player1.linkedAccountId;

    if (loserId) {
      const loserPlayer = this.playersByAccountId.get(loserId);
      if (loserPlayer) {
        loserPlayer.addSpectator(winnerId);
      }
    }

    // Remove completed battle
    this.battles = this.battles.filter(b => b.battleID !== battleID);

    await this.checkRoundCompletion();
  }

  async checkRoundCompletion(): Promise<void> {
    // Check if all battles in the current round have winners
    const allCompleted = this.battles.every(battle => battle.winnerId);
    if (!allCompleted) {
      return;
    }

    // If all battles are completed, determine winners and create new battles for the next round
    const winners: Player[] = [];
    for (const battle of this.battles) {
      const winnerId = battle.winnerId;
      if (winnerId) {
        const winner = this.playersByAccountId.get(winnerId);
        if (winner) {
          winners.push(winner);
        }
      }
    }

    this.battles = [];

    // If there's only one winner, the tournament is over
    if (winners.length === 1) {
      console.log(`Tournament Over. Winner: ${winners[0].displayName}`);
      return;
    }

    // If there are multiple winners, create new battles for the next round
    this.createBattles(winners);
  }

  async startTournament(): Promise<void> {
    const players = Array.from(this.playersByAccountId.values());
    this.createBattles(players);
  }

}
