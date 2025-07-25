import { SideId } from "../side";

interface BaseNotice<TKind extends string = string, TData = unknown, TCallback = (...args: unknown[]) => void> {
  readonly kind: TKind;
  data: TData;
  callback: TCallback;
}

export type Notice = ChooseMove | Roll | RerollOption;
export type NoticeKind = Notice["kind"];

export type ChooseMove = BaseNotice<"chooseMove", { moveIdOptions: EntryID[] }, (moveId: EntryID, target: SideId) => void>;
export type Roll = BaseNotice<"roll", { diceFaces: number }, () => void>;
export type RerollOption = BaseNotice<"rerollOption", { diceFaces: number }, (shouldReroll: boolean) => void>;
