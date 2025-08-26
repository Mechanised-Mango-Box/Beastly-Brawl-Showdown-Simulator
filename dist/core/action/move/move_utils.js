"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_attack = default_attack;
const monster_1 = require("../../monster/monster");
const roll_1 = require("../../roll");
async function default_attack(parentMove, battle, source, target) {
    const sourceMonster = battle.sides[source].monster;
    const targetMonster = battle.sides[target].monster;
    const startMoveEvent = {
        name: "startMove",
        source: source,
        target: target,
        moveId: parentMove.moveId,
    };
    battle.eventHistory.addEvent(startMoveEvent);
    //# Evade check
    const dodgeState = (0, monster_1.getComponent)(targetMonster, "dodging");
    if (dodgeState) {
        const moveEvadedEvent = {
            name: "evaded",
            source: source,
            target: target,
            moveId: parentMove.moveId,
        };
        battle.eventHistory.addEvent(moveEvadedEvent);
        return;
    }
    //# Roll
    await new Promise((resolve) => {
        battle.noticeBoard.postNotice(source, {
            kind: "roll",
            data: { diceFaces: 20 },
            callback: function () {
                battle.noticeBoard.removeNotice(source, "roll");
                resolve();
            },
        });
    });
    let rollResult = (0, roll_1.roll)(battle.rng, 20);
    const rollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: rollResult,
    };
    battle.eventHistory.addEvent(rollEvent);
    // # Reroll
    const rerollComponent = (0, monster_1.getComponent)(sourceMonster, "reroll");
    if (rerollComponent && rerollComponent.charges > 0) {
        await new Promise((resolve) => {
            battle.noticeBoard.postNotice(source, {
                kind: "rerollOption",
                data: { diceFaces: 20 },
                callback: function (shouldReroll) {
                    if (shouldReroll) {
                        rerollComponent.charges--;
                        rollResult = (0, roll_1.roll)(battle.rng, 20);
                        const rerollEvent = {
                            name: "reroll",
                            source: source,
                            faces: 20,
                            result: rollResult,
                        };
                        battle.eventHistory.addEvent(rerollEvent);
                    }
                    battle.noticeBoard.removeNotice(source, "rerollOption");
                    resolve();
                },
            });
        });
    }
    //# Armour Check
    if (rollResult <= (0, monster_1.getStat)("armour", targetMonster, battle.monsterPool.monsters[targetMonster.baseID])) {
        const blockedEvent = {
            name: "blocked",
            source: source,
            target: target,
        };
        battle.eventHistory.addEvent(blockedEvent);
        return;
    }
    const moveSuccessEvent = {
        name: "moveSuccess",
        source: source,
        target: target,
        moveId: parentMove.moveId,
    };
    battle.eventHistory.addEvent(moveSuccessEvent);
    //# Base damage roll
    const baseDamage = (0, roll_1.roll)(battle.rng, 4) + (0, monster_1.getStat)("attack", sourceMonster, battle.monsterPool.monsters[sourceMonster.baseID]);
    //# Crit Check
    const critChanceBonus = (0, monster_1.getStat)("crit_chance", sourceMonster, battle.monsterPool.monsters[sourceMonster.baseID]);
    const critRollResult = (0, roll_1.roll)(battle.rng, 20);
    const critRollEvent = {
        name: "roll",
        source: source,
        faces: 20,
        result: critRollResult,
    };
    battle.eventHistory.addEvent(critRollEvent);
    //TODO -> change threshold (15) to something based on action / monster
    const critDamage = critChanceBonus + rollResult > 15 ? baseDamage : 0;
    const damageToTake = baseDamage + critDamage;
    targetMonster.health -= damageToTake;
    const damageEvent = {
        name: "damage",
        source: source,
        target: target,
        amount: damageToTake,
    };
    battle.eventHistory.addEvent(damageEvent);
}
