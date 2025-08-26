import { NoticeBoard } from "@sim/core/notice/notice_board";
import { EventHistory } from "@sim/core/event/event_history";
export declare class CliAdapter {
    noticeBoard: NoticeBoard;
    eventHistory: EventHistory;
    constructor(noticeBoard: NoticeBoard, eventHistory: EventHistory);
    listen(): void;
}
