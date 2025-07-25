import * as readline from "readline";
import { Notice, NoticeKind } from "../notice/notice";
import { NoticeBoard } from "../notice/notice_board";
import { SideId } from "../side";
import { EventHistory } from "../history/event_history";
import { EntryID } from "../types";

export class CliAdapter {
  noticeBoard: NoticeBoard;
  eventHistory: EventHistory;

  constructor(noticeBoard: NoticeBoard, eventHistory: EventHistory) {
    this.noticeBoard = noticeBoard;

    this.eventHistory = eventHistory;
  }

  listen(): void {
    const rl: readline.Interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "<<< Enter cmd (target|cmd|arg1|arg2|...):\n> ",
    });

    rl.prompt();

    rl.on("line", (line: string) => {
      switch (line.trim().toLowerCase()) {
        case "history":
          console.log(`History (events count = ${this.eventHistory.events.length}):\n${JSON.stringify(this.eventHistory.events)}`);
          return;
        case "notice":
          console.log(`Notices (player count = ${this.noticeBoard.noticeMaps.length}):\n${JSON.stringify(this.noticeBoard.noticeMaps.map((map) => Object.fromEntries(map)))}`); //* Hacky print
          return;

        default:
          break;
      }

      const [targetStr, eventNameStr, ...args] = line.trim().split("|");

      const target: number = parseInt(targetStr);
      if (isNaN(target) || target >= this.noticeBoard.noticeMaps.length) {
        console.warn("❌ Invalid target index.");
        rl.prompt();
        return;
      }

      const notice: Notice | null = this.noticeBoard.noticeMaps[target].get(eventNameStr as NoticeKind) || null;
      if (!notice) {
        console.warn(`❌ Invalid event name: "${eventNameStr}"`);
        rl.prompt();
        return;
      }

      try {
        switch (notice.kind) {
          case "chooseMove": {
            if (args.length < 2) {
              console.log("❌ onChooseMove requires moveId and moveTarget");
              break;
            }

            notice.callback(args[0].toLowerCase() as EntryID, parseInt(args[1], 10) as SideId);
            break;
          }
          case "roll": {
            notice.callback();
            break;
          }
          case "rerollOption": {
            if (args.length < 1) {
              console.log("❌ rerollOption requires shouldReroll");
              break;
            }

            if (args[0].toLowerCase() === "y") {
              notice.callback(true);
            }
            if (args[0].toLowerCase() === "n") {
              notice.callback(false);
            }

            console.log("❌ rerollOption - shouldReroll should be y/n");
            break;
          }
          default:
            console.error(`❓ Unknown event name: "${eventNameStr}"`);
        }
      } catch (err) {
        console.error(`💥 Error executing callback:`, err);
      }

      rl.prompt();
    });

    rl.on("close", () => {
      console.log("👋 CLI listener terminated.");
    });
  }
}
