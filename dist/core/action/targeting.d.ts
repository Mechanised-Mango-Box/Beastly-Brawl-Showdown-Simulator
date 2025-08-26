import { SideId } from "../side";
/**
 * The following targeting methods are availible
 */
export type TargetingMethod = "self" | "single-enemy";
interface BaseTargetingData<TM extends TargetingMethod> {
    targetingMethod: TM;
}
export interface SelfTargeting extends BaseTargetingData<"self"> {
}
export interface SingleEnemyTargeting extends BaseTargetingData<"single-enemy"> {
    target: SideId;
}
export type TargetingData = SelfTargeting | SingleEnemyTargeting;
export {};
