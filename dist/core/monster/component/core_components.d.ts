import { Battle } from "../../battle";
import { SideId } from "../../side";
import { MonsterStatType } from "../monster_stats";
import { BaseComponent } from "./component";
export declare class RerollChargeComponent implements BaseComponent<"reroll"> {
    kind: "reroll";
    charges: number;
    constructor(charges: number);
}
export declare class DodgeChargeComponent implements BaseComponent<"dodgeCharges"> {
    kind: "dodgeCharges";
    charges: number;
    constructor(charges: number);
}
export declare class DodgeStateComponent implements BaseComponent<"dodging"> {
    kind: "dodging";
    remainingDuration: number;
    constructor(duration: number);
    onEndTurn(battle: Battle, selfSide: SideId): void;
}
export declare class DefendComponent implements BaseComponent<"defend"> {
    kind: "defend";
    remainingDuration: number;
    bonusArmour: number;
    constructor(duration: number, bonusArmour: number);
    getStatBonus(statType: MonsterStatType): number | null;
    onEndTurn(battle: Battle, selfSide: SideId): void;
}
export declare class AbilityChargeStunComponent implements BaseComponent<"abilityChargeStun"> {
    kind: "abilityChargeStun";
    charges: number;
    constructor(charges: number);
}
export declare class StunnedStateComponent implements BaseComponent<"stunned"> {
    kind: "stunned";
    remainingDuration: number;
    constructor(duration: number);
    getIsBlockedFromMove: () => boolean;
    onEndTurn(battle: Battle, selfSide: SideId): void;
}
export declare class SpeedModifierComponent implements BaseComponent<"speedModifier"> {
    kind: "speedModifier";
    speedBonus: number;
    constructor(speedBonus: number);
    getStatBonus(statType: MonsterStatType): number | null;
}
type CommonComponentTypes = typeof RerollChargeComponent | typeof DodgeChargeComponent | typeof DodgeStateComponent | typeof DefendComponent | typeof AbilityChargeStunComponent | typeof StunnedStateComponent | typeof SpeedModifierComponent;
type ComponentInstanceType = InstanceType<CommonComponentTypes>;
export type ComponentKindMap = {
    [K in ComponentInstanceType["kind"]]: Extract<ComponentInstanceType, {
        kind: K;
    }>;
};
export {};
