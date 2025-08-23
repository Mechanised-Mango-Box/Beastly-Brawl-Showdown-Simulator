import { Battle } from "../battle";
import { SideId } from "../side";
import { BaseComponent } from "./component";

export class RerollChargeComponent implements BaseComponent<"reroll"> {
  kind = "reroll" as const;
  charges: number;

  constructor(charges: number) {
    this.charges = charges;
  }
}

export class DodgeChargeComponent implements BaseComponent<"dodgeCharges"> {
  kind = "dodgeCharges" as const;
  charges: number;
  constructor(charges: number) {
    this.charges = charges;
  }
}
export class DodgeStateComponent implements BaseComponent<"dodging"> {
  kind = "dodging" as const;
  remainingDuration: number;
  constructor(duration: number) {
    this.remainingDuration = duration;
  }

  onEndTurn(battle: Battle, selfSide: SideId): void {
    this.remainingDuration--;
    if (this.remainingDuration <= 0) {
      battle.sides[selfSide].monster.components.splice(
        battle.sides[selfSide].monster.components.indexOf(this)
      );
    }
  }
}

export class DefendComponent implements BaseComponent<"defend"> {
  kind = "defend" as const;
  remainingDuration: number;
  bonusArmour: number;

  constructor(duration: number, bonusArmour: number) {
    this.remainingDuration = duration;
    this.bonusArmour = bonusArmour;
  }

  getArmourBonus(): number {
    return this.bonusArmour;
  }
  onEndTurn(battle: Battle, selfSide: SideId): void {
    this.remainingDuration--;
    if (this.remainingDuration <= 0) {
      battle.sides[selfSide].monster.components.splice(
        battle.sides[selfSide].monster.components.indexOf(this)
      );
    }
  }
}

export class AbilityChargeStunComponent
  implements BaseComponent<"abilityChargeStun">
{
  kind = "abilityChargeStun" as const;
  charges: number;
  constructor(charges: number) {
    this.charges = charges;
  }
}
export class StunnedStateComponent implements BaseComponent<"stunned"> {
  kind = "stunned" as const;
  remainingDuration: number;
  constructor(duration: number) {
    this.remainingDuration = duration;
  }

  getIsBlockedFromMove = () => true;

  onEndTurn(battle: Battle, selfSide: SideId): void {
    this.remainingDuration--;
    if (this.remainingDuration <= 0) {
      battle.sides[selfSide].monster.components.splice(
        battle.sides[selfSide].monster.components.indexOf(this)
      );
    }
  }
}
type CommonComponentTypes =
  | typeof RerollChargeComponent
  | typeof DodgeChargeComponent
  | typeof DodgeStateComponent
  | typeof DefendComponent
  | typeof AbilityChargeStunComponent
  | typeof StunnedStateComponent;
//# Map it then export
type ComponentInstanceType = InstanceType<CommonComponentTypes>;
export type ComponentKindMap = {
  [K in ComponentInstanceType["kind"]]: Extract<
    ComponentInstanceType,
    { kind: K }
  >;
};
