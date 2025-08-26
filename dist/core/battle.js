"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = void 0;
const notice_board_1 = require("./notice/notice_board");
const event_history_1 = require("./event/event_history");
const prng_1 = require("./prng");
const monster_1 = require("./monster/monster");
class Battle {
    constructor(options) {
        this.rng = new prng_1.PRNG(options.seed);
        this.monsterPool = options.monsterPool;
        this.movePool = options.movePool;
        this.sides = options.playerOptionSet.map((playerOptions, idx) => {
            if (!this.monsterPool.monsters[playerOptions.monsterId]) {
                throw new RangeError(`Key out of range: [key=${playerOptions.monsterId}] does not exist in the monster pool ${this.monsterPool.name}`);
            }
            const side = {
                id: idx,
                monster: {
                    baseID: playerOptions.monsterId,
                    health: 0,
                    defendActionCharges: 0,
                    components: [],
                },
                pendingActions: null,
            };
            return side;
        });
        this.eventHistory = new event_history_1.EventHistory();
        this.noticeBoard = new notice_board_1.NoticeBoard(options.playerOptionSet.length);
    }
    // TODO ? make the battle director a swappable component
    async run() {
        console.log("Battle: Start");
        const initialState = {
            name: "snapshot",
            sides: JSON.parse(JSON.stringify(this.sides)),
        };
        this.eventHistory.addEvent(initialState);
        // TODO exit
        while (this.sides.every((side) => side.monster.health > 0)) {
            //#########################
            //# Start of turn trigger #
            //#########################
            this.sides.forEach((side) => {
                side.monster.components.forEach((component) => {
                    if (component.onStartTurn === undefined) {
                        return;
                    }
                    component.onStartTurn(this, side.id);
                });
            });
            //##################
            //# Gather Actions #
            //##################
            console.log(`Gather moves: Start`);
            await new Promise((resolve) => {
                this.sides.forEach((side) => {
                    const callback = (moveId, targetingData) => {
                        // TODO validate move
                        const chosenMove = this.movePool[moveId];
                        if (chosenMove.targetingMethod != targetingData.targetingMethod) {
                            console.error(`Error: Targeting method mismatch. [moveId=${moveId} ${chosenMove.name}] expects ${chosenMove.targetingMethod} but ${targetingData.targetingMethod} was recieved.`);
                            return;
                        }
                        side.pendingActions = [
                            /// For now there will only ever be one action per turn.
                            {
                                moveId: moveId,
                                source: side.id,
                                targetingData: targetingData,
                            },
                        ]; /// Save to data
                        this.noticeBoard.removeNotice(side.id, "chooseMove");
                        // TODO allow for something else to decide on when to resolve a turn
                        /// All if all sides ready -> ready move to next stage
                        if (this.sides.every((side) => side.pendingActions)) {
                            resolve();
                        }
                    };
                    const moveIdOptions = [];
                    const base = this.monsterPool.monsters[side.monster.baseID];
                    if (!base) {
                        throw new RangeError(`Key out of range: [key=${side.monster.baseID}] does not exist in the monster pool ${this.monsterPool.name}`);
                    }
                    if (base.attackActionId) {
                        moveIdOptions.push(base.attackActionId);
                    }
                    if (base.defendActionId && side.monster.defendActionCharges > 0) {
                        moveIdOptions.push(base.defendActionId);
                    }
                    if (base.abilityActionId) {
                        moveIdOptions.push(base.abilityActionId);
                    }
                    const notice = {
                        kind: "chooseMove",
                        data: { moveIdOptions },
                        callback: callback,
                    };
                    this.noticeBoard.postNotice(side.id, notice);
                });
            });
            console.log(`Gather moves: Complete`);
            //#################
            //# Order Actions #
            //#################
            const allMovesUnsorted = this.sides
                .map((side) => side.pendingActions)
                .filter((actions) => actions !== null)
                .flat();
            this.sides.forEach((side) => (side.pendingActions = null)); /// Remove from pending
            const moveRequestQueue = allMovesUnsorted.sort((a, b) => {
                /// Sort by move priority class
                const moveA = this.movePool[a.moveId];
                const moveB = this.movePool[b.moveId];
                if (moveA.priorityClass !== moveB.priorityClass) {
                    return moveB.priorityClass - moveA.priorityClass;
                }
                /// Sort by source monster speed
                return ((0, monster_1.getStat)("speed", this.sides[b.source].monster, this.monsterPool.monsters[this.sides[b.source].monster.baseID]) -
                    (0, monster_1.getStat)("speed", this.sides[a.source].monster, this.monsterPool.monsters[this.sides[a.source].monster.baseID]));
            });
            console.log(`Acton Queue:\n${JSON.stringify(moveRequestQueue)}`);
            //###################
            //# Resolve Actions #
            //###################
            console.log("Resolve Actions");
            for (const moveRequest of moveRequestQueue) {
                const move = this.movePool[moveRequest.moveId];
                if ((0, monster_1.getIsBlockedFromMove)(this.sides[moveRequest.source].monster)) {
                    console.log(`Monster could not perform move right now (probs status).`);
                    continue;
                }
                await move.perform(this, moveRequest.source, moveRequest.targetingData);
                console.log(`Resolved move id=${moveRequest.moveId}`);
            }
            //#######################
            //# End of turn trigger #
            //#######################
            this.sides.forEach((side) => {
                side.monster.components.forEach((component) => {
                    if (component.onEndTurn === undefined) {
                        return;
                    }
                    component.onEndTurn(this, side.id);
                });
            });
            const endOfTurnSnapshotEvent = {
                name: "snapshot",
                sides: JSON.parse(JSON.stringify(this.sides)),
            };
            this.eventHistory.addEvent(endOfTurnSnapshotEvent);
        }
        const battleOverEvent = {
            name: "battleOver",
        };
        this.eventHistory.addEvent(battleOverEvent);
    }
}
exports.Battle = Battle;
