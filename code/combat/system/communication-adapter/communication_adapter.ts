import { NoticeBoard } from "../notice/notice_board";

export interface CommunicationAdapter {
  noticeBoard: NoticeBoard;
}
// TODO remove? might not be needed as a contruct