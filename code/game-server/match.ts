import { Player } from "./player";
import { AccountId } from "./types";

enum MatchType {
    DUEL,
    BYE
}

export class Match {
    player1: Player;
    player2?: Player;
    winnerId?: AccountId;
    spectators: AccountId[];
    battleType: MatchType;
    battleID: number;

    constructor(player1: Player, battleID: number, player2?: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.spectators = player1.spectators.concat(player2?.spectators ?? []);
        this.battleType = player2 ? MatchType.DUEL : MatchType.BYE;
        this.battleID = battleID;
    }
}