import { NoticeKind, Notice } from "./notice";
type NoticeBoardListener = {
    onPostNotice(target: number, notice: Notice): void;
    onRemoveNotice(target: number, notice: Notice): void;
};
type NoticeMap = Map<NoticeKind, Notice>;
export declare class NoticeBoard {
    noticeMaps: NoticeMap[];
    listeners: NoticeBoardListener[];
    constructor(playerCount: number);
    postNotice(target: number, notice: Notice): void;
    removeNotice(target: number, noticeKind: NoticeKind): Notice | null;
    subscribeListener(listener: NoticeBoardListener): void;
    unsubscribeListener(listener: NoticeBoardListener): void;
    private emitOnPostNotice;
    private emitOnRemoveNotice;
}
export {};
