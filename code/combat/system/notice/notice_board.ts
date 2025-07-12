import { NoticeKind, Notice } from "./notice";

type NoticeMap = Map<NoticeKind, Notice>;
export class NoticeBoard {
  noticeMaps: NoticeMap[];

  constructor(playerCount: number) {
    this.noticeMaps = Array.from({ length: playerCount }, () => new Map<NoticeKind, Notice>());
  }

  postNotice(target: number, notice: Notice): void {
    this.noticeMaps[target].set(notice.kind, notice);
  }
  removeNotice(target: number, noticeKind: NoticeKind): Notice | null {
    const notice: Notice | null = this.noticeMaps[target].get(noticeKind) || null;

    if (!notice) {
      console.log(`${target} does not have a notice: ${noticeKind}`);
      return null;
    }
    this.noticeMaps[target].delete(noticeKind);
    console.log(`${target} >>> Stop listen for: ${noticeKind}`);
    return notice;
  }
}
