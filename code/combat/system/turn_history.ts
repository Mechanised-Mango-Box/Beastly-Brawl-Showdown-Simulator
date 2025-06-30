import { Side } from "./side";

export type Turn = {
  phaseResolve: TurnEvent[];
  phaseOutcome: TurnEvent[];
  endOfTurnState: Side[];
};

export type TurnEvent = {
  type: string;
  data: any;
};
