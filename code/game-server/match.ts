import { Player } from "./player";
import { AccountId } from "../shared/types";
import { Battle, BattleOptions, PlayerOptions } from "../simulator/core/battle"

enum MatchType {
    DUEL,
    BYE
}

export class Match {
    player1: Player;
    player2?: Player;
    winnerId?: AccountId;
    spectators: AccountId[];
    matchType: MatchType;
    matchID: number;

    constructor(player1: Player, matchID: number, player2?: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.spectators = player1.spectators.concat(player2?.spectators ?? []);
        this.matchType = player2 ? MatchType.DUEL : MatchType.BYE;
        this.matchID = matchID;
    }

    async startBattle(): Promise<void> {
        if (this.matchType == MatchType.BYE) {
            this.winnerId = this.player1.linkedAccountId;
            return;
        }

        if (!this.player1.monster || !this.player2?.monster) {
            throw new Error(`Match ${this.matchID}: One or both players are missing a monster.`);
        }

        const options: BattleOptions = {
        seed: Math.floor(Math.random() * 10000),
        playerOptionSet: [
            {
            name: this.player1.displayName,
            monsterTemplate: this.player1.monster,
            },
            {
            name: this.player2.displayName,
            monsterTemplate: this.player2.monster,
            },
        ],
        player_option_timeout: 30,
        };

    const battle = new Battle(options);
    await battle.run();

    const survivingSide = battle.sides.find((side) => side.monster.health > 0);
    const winnerIndex = battle.sides.indexOf(survivingSide!);
    this.winnerId = winnerIndex === 0 ? this.player1.linkedAccountId : this.player2!.linkedAccountId;

    console.log(`Match ${this.matchID}: Winner is ${this.winnerId}`);
    }
}