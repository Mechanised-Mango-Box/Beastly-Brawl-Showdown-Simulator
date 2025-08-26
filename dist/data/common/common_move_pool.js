"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_MOVE_POOL = void 0;
const move_utils_1 = require("@sim/core/action/move/move_utils");
const core_components_1 = require("@sim/core/monster/component/core_components");
const monster_1 = require("@sim/core/monster/monster");
exports.COMMON_MOVE_POOL = {
    nothing: {
        moveId: "nothing",
        type: "move",
        name: "Do nothing",
        description: "Do nothing...",
        priorityClass: 0,
        targetingMethod: "self",
        perform: async function (battle, source, targetingData) {
            throw new Error("This action should not be used EVER.");
        },
        onFail: async function (battle, source) { },
    },
    "attack-normal": {
        moveId: "attack-normal",
        type: "move",
        name: "Attack",
        description: "A regular attack.",
        icon: "wolverine-claws.svg",
        priorityClass: 0,
        targetingMethod: "single-enemy",
        perform: async function (battle, source, targetingData) {
            const target = targetingData.target;
            (0, move_utils_1.default_attack)(this, battle, source, target);
        },
        onHit: async function (battle, source, target) {
            // TODO
        },
        onFail: async function (battle, source) { },
    },
    defend: {
        moveId: "defend",
        type: "move",
        name: "Defend",
        description: "Increase your armor class temporarily.",
        icon: "vibrating-shield.svg",
        priorityClass: 5,
        targetingMethod: "self",
        async perform(battle, source) {
            const sourceMonster = battle.sides[source].monster;
            if (sourceMonster.defendActionCharges <= 0) {
                const failedEvent = {
                    name: "moveFailed",
                    source: source,
                    target: source,
                    moveId: this.moveId,
                    reason: null,
                };
                battle.eventHistory.addEvent(failedEvent);
                return;
            }
            sourceMonster.defendActionCharges -= 1;
            const defenseComponent = new core_components_1.DefendComponent(1, 2);
            sourceMonster.components.push(defenseComponent);
            const buffEvent = {
                name: "buff",
                source: source,
                target: source,
                buffs: { armour: defenseComponent.bonusArmour },
            };
            battle.eventHistory.addEvent(buffEvent);
        },
        onFail: function (battle, source) {
            throw new Error("Function not implemented.");
        },
    },
    dodge: {
        moveId: "dodge",
        type: "move",
        name: "Dodge",
        description: "Dodge an attack, avoid it completely.",
        priorityClass: 5,
        targetingMethod: "self",
        async perform(battle, source, targetingData) {
            const sourceMonster = battle.sides[source].monster;
            const dodgeChargeComponent = (0, monster_1.getComponent)(sourceMonster, "dodgeCharges");
            if (!dodgeChargeComponent) {
                const failedEvent = {
                    name: "moveFailed",
                    source: source,
                    target: source,
                    moveId: this.moveId,
                    reason: undefined,
                };
                battle.eventHistory.addEvent(failedEvent);
                return;
            }
            const dodgeComponent = (0, monster_1.getComponent)(sourceMonster, "dodging");
            if (!dodgeComponent) {
                sourceMonster.components.push(new core_components_1.DodgeStateComponent(1));
            }
            else {
                dodgeComponent.remainingDuration++;
            }
        },
        onFail: function (battle, source) {
            throw new Error("Function not implemented.");
        },
    },
    stun: {
        moveId: "stun",
        type: "move",
        name: "Stun",
        description: "Stun the monster, preventing it from taking actions for one turn.",
        priorityClass: 3,
        targetingMethod: "single-enemy",
        async perform(battle, source, targetingData) {
            const sourceMonster = battle.sides[source].monster;
            const target = targetingData.target;
            const targetMonster = battle.sides[target].monster;
            const abilityChargeStunComponent = (0, monster_1.getComponent)(sourceMonster, "abilityChargeStun");
            if (!abilityChargeStunComponent) {
                const failedEvent = {
                    name: "moveFailed",
                    source: source,
                    target: source,
                    moveId: this.moveId,
                    reason: undefined,
                };
                battle.eventHistory.addEvent(failedEvent);
                return;
            }
            const stunnedComponent = (0, monster_1.getComponent)(targetMonster, "stunned");
            if (!stunnedComponent) {
                sourceMonster.components.push(new core_components_1.StunnedStateComponent(1));
            }
            else {
                stunnedComponent.remainingDuration++;
            }
        },
        onFail: async function (battle, source) {
            throw new Error("Function not implemented.");
        },
    },
};
