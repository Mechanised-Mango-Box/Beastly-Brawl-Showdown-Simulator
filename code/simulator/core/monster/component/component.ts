import { Battle } from "../../battle";
import { SideId } from "../../side";

export interface BaseComponent<TKind extends string = string> {
  readonly kind: TKind;

  getArmourBonus?: () => number;
  getCritChanceBonus?: () => number;
  getAttackBonus?: () => number;
  getHealthBonus?: () => number;
  getIsBlockedFromMove?: () => boolean;
  getSpeedBonus?: () => number;

  onStartTurn?(battle: Battle, selfSide: SideId): void;
  onEndTurn?(battle: Battle, selfSide: SideId): void;
}

