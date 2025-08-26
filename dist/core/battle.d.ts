import { Side } from "./side";
import { NoticeBoard } from "./notice/notice_board";
import { EventHistory } from "./event/event_history";
import { PRNG } from "./prng";
import { MonsterPool, MonsterId } from "./monster/monster_pool";
import { MovePool } from "./action/move/move_pool";
export interface PlayerOptions {
    monsterId: MonsterId;
}
export type BattleOptions = {
    seed: number;
    monsterPool: MonsterPool;
    movePool: MovePool;
    playerOptionSet: PlayerOptions[];
};
export declare class Battle {
    readonly rng: PRNG;
    readonly monsterPool: MonsterPool;
    readonly movePool: MovePool;
    readonly sides: Side[];
    readonly eventHistory: EventHistory;
    readonly noticeBoard: NoticeBoard;
    constructor(options: BattleOptions);
    run(): Promise<void>;
}
