import { ActionId } from "../action";
import { SideId } from "../side";
import { BaseNotice } from "./base_notice";

export type Notice = ChooseAction | Roll;
export type NoticeKind = Notice["kind"];

export type ChooseAction = BaseNotice<"chooseAction", { possibleActionIds: ActionId[] }, (actionId: ActionId, target: SideId) => void>;
export type Roll = BaseNotice<"roll", { diceFaces: number }, () => void>;