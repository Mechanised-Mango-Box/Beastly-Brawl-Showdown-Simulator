import { Player } from "./Player";
import { AccountId } from "./types";

enum BattleType {
    DUEL,
    BYE
}

export class Battle {
    player1: Player;
    player2?: Player;
    winnerId?: AccountId;
    spectators: AccountId[];
    battleType: BattleType;
    battleID: number;

    constructor(player1: Player, battleID: number, player2?: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.spectators = player1.spectators.concat(player2?.spectators ?? []);
        this.battleType = player2 ? BattleType.DUEL : BattleType.BYE;
        this.battleID = battleID;
    }
}