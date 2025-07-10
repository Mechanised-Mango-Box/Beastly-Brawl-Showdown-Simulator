import * as readline from "readline";
import { CommunicationAdapter } from "./communication_adapter";
import { Notice, NoticeKind } from "../notice/notice";
import { NoticeBoard } from "../notice/notice_board";
import { ActionId } from "../action";
import { SideId } from "../side";

export class CliAdapter implements CommunicationAdapter {
  noticeBoard: NoticeBoard;

  constructor(noticeBoard: NoticeBoard) {
    this.noticeBoard = noticeBoard;
  }

  listen(): void {
    const rl: readline.Interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Enter cmd (target|cmd|arg1|arg2|...):\n",
    });

    rl.prompt();

    rl.on("line", (line: string) => {
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
          case "chooseAction": {
            if (args.length < 2) {
              console.log("❌ onChooseMove requires moveId and moveTarget");
              break;
            }

            notice.callback(parseInt(args[0], 10) as ActionId, parseInt(args[1], 10) as SideId);
            break;
          }
          case "roll": {
            notice.callback();
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
