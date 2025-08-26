"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedModifierComponent = exports.StunnedStateComponent = exports.AbilityChargeStunComponent = exports.DefendComponent = exports.DodgeStateComponent = exports.DodgeChargeComponent = exports.RerollChargeComponent = void 0;
const monster_1 = require("../monster");
class RerollChargeComponent {
    constructor(charges) {
        this.kind = "reroll";
        this.charges = charges;
    }
}
exports.RerollChargeComponent = RerollChargeComponent;
class DodgeChargeComponent {
    constructor(charges) {
        this.kind = "dodgeCharges";
        this.charges = charges;
    }
}
exports.DodgeChargeComponent = DodgeChargeComponent;
class DodgeStateComponent {
    constructor(duration) {
        this.kind = "dodging";
        this.remainingDuration = duration;
    }
    onEndTurn(battle, selfSide) {
        this.remainingDuration--;
        if (this.remainingDuration <= 0) {
            (0, monster_1.removeComponent)(battle.sides[selfSide].monster, this);
        }
    }
}
exports.DodgeStateComponent = DodgeStateComponent;
class DefendComponent {
    constructor(duration, bonusArmour) {
        this.kind = "defend";
        this.remainingDuration = duration;
        this.bonusArmour = bonusArmour;
    }
    getStatBonus(statType) {
        if (statType === "armour") {
            return this.bonusArmour;
        }
        return null;
    }
    onEndTurn(battle, selfSide) {
        this.remainingDuration--;
        if (this.remainingDuration <= 0) {
            (0, monster_1.removeComponent)(battle.sides[selfSide].monster, this);
        }
    }
}
exports.DefendComponent = DefendComponent;
class AbilityChargeStunComponent {
    constructor(charges) {
        this.kind = "abilityChargeStun";
        this.charges = charges;
    }
}
exports.AbilityChargeStunComponent = AbilityChargeStunComponent;
class StunnedStateComponent {
    constructor(duration) {
        this.kind = "stunned";
        this.getIsBlockedFromMove = () => true;
        this.remainingDuration = duration;
    }
    onEndTurn(battle, selfSide) {
        this.remainingDuration--;
        if (this.remainingDuration <= 0) {
            (0, monster_1.removeComponent)(battle.sides[selfSide].monster, this);
        }
    }
}
exports.StunnedStateComponent = StunnedStateComponent;
class SpeedModifierComponent {
    constructor(speedBonus) {
        this.kind = "speedModifier";
        this.speedBonus = speedBonus;
    }
    getStatBonus(statType) {
        if (statType === "speed") {
            return this.speedBonus;
        }
        return null;
    }
}
exports.SpeedModifierComponent = SpeedModifierComponent;
