import { Player } from "./player";
import { Match } from "./match";

export class TournamentManager {
  playersByAccountId: Map<string, Player> = new Map();

  matches: Match[];

  constructor() {
    this.matches = [];
  }

  creatematchs(playerList: Player[]) {
    this.matches = [];

    for (let i = 0; i < playerList.length; i += 2) {
      let matchID = i / 2 + 1;
      if (i + 1 < playerList.length) {
        this.matches.push(new Match(playerList[i], matchID, playerList[i + 1]));
      } else {
        this.matches.push(new Match(playerList[i], matchID));
      }
    }

    console.log(`Created ${this.matches.length} matchs for this round.`);
  }

  async checkRoundCompletion(): Promise<void> {
    // Check if all matchs in the current round have winners
    const allCompleted = this.matches.every(match => match.winnerId);
    if (!allCompleted) {
      return;
    }

    // If all matchs are completed, determine winners and create new matchs for the next round
    const winners: Player[] = [];
    for (const match of this.matches) {
      if (match.winner) {
        winners.push(match.winner)
      }
    }

    this.matches = [];

    // If there's only one winner, the tournament is over
    if (winners.length === 1) {
      console.log(`Tournament Over. Winner: ${winners[0].displayName}`);
      return;
    }

    // If there are multiple winners, create new matchs for the next round
    this.creatematchs(winners);
  }

  async startTournament(): Promise<void> {
    const players = Array.from(this.playersByAccountId.values());
    this.creatematchs(players);

    await Promise.all(this.matches.map(match => match.startBattle(this.playersByAccountId)))
    await this.checkRoundCompletion()
  }
}
