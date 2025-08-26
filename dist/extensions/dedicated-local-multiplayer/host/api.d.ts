import type { OrderedEvent } from "@sim/core/event/event_history";
import type { Notice, NoticeKind } from "@sim/core/notice/notice";
import type { SideId } from "@sim/core/side";
export interface ServerToPlayerEvents {
    newEvent: (event: OrderedEvent) => void;
    newNotice: (notice: Notice) => void;
}
export interface PlayerToServerEvents {
    resolveNotice<K extends NoticeKind>(kind: K, params: Parameters<Extract<Notice, {
        kind: K;
    }>["callback"]>): void;
    getHistory(): OrderedEvent[];
    getSelfInfo(): SideId;
    getNotices(): Notice[];
}
