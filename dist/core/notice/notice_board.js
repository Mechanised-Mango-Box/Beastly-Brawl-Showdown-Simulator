"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeBoard = void 0;
class NoticeBoard {
    constructor(playerCount) {
        this.noticeMaps = Array.from({ length: playerCount }, () => new Map());
        this.listeners = [];
    }
    postNotice(target, notice) {
        this.noticeMaps[target].set(notice.kind, notice);
        this.emitOnPostNotice(target, notice);
    }
    removeNotice(target, noticeKind) {
        const notice = this.noticeMaps[target].get(noticeKind) || null;
        if (!notice) {
            console.log(`${target} does not have a notice: ${noticeKind}`);
            return null;
        }
        this.noticeMaps[target].delete(noticeKind);
        this.emitOnRemoveNotice(target, notice);
        return notice;
    }
    subscribeListener(listener) {
        this.listeners.push(listener);
    }
    unsubscribeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }
    emitOnPostNotice(target, notice) {
        this.listeners.forEach((listener) => {
            listener.onPostNotice(target, notice);
        });
    }
    emitOnRemoveNotice(target, notice) {
        this.listeners.forEach((listener) => {
            listener.onRemoveNotice(target, notice);
        });
    }
}
exports.NoticeBoard = NoticeBoard;
