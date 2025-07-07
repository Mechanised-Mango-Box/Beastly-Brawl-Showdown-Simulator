import * as readline from "readline";
import { CommunicationAdapter, ListenEventTypes, EmitDataTypes, ListenerRegistry } from "./communication_adapter";

export class CliAdapter implements CommunicationAdapter {
  private listenMaps: ListenerRegistry[];

  constructor(playerCount: number) {
    this.listenMaps = [];
    for (let i: number = 0; i < playerCount; i++) {
      this.listenMaps.push({
        onSubmitMove: null,
        onRoll: null,
      });
    }
  }

  subscribe<K extends keyof ListenEventTypes>(target: number, event: K, callback: ListenEventTypes[K]): void {
    this.listenMaps[target][event] = callback;
  }

  unsubscribe<K extends keyof ListenEventTypes>(target: number, event: K): void {
    this.listenMaps[target][event] = null;
  }

  emit<K extends keyof EmitDataTypes>(target: number, data: EmitDataTypes[K]): void {
    console.log(`${target} <<< ${JSON.stringify(data)}`);
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
      if (isNaN(target) || target >= this.listenMaps.length) {
        console.warn("❌ Invalid target index.");
        rl.prompt();
        return;
      }

      if (!(eventNameStr in this.listenMaps[target])) {
        console.warn(`❌ Invalid event name: "${eventNameStr}"`);
        rl.prompt();
        return;
      }

      const event: keyof ListenerRegistry = eventNameStr as keyof ListenerRegistry;
      const callback: ListenEventTypes[keyof ListenEventTypes] | null = this.listenMaps[target][event];

      if (!callback) {
        console.warn(`⚠️ No listener registered for event "${eventNameStr}" on target ${target}`);
        rl.prompt();
        return;
      }

      try {
        switch (event) {
          case "onSubmitMove":
            if (args.length < 2) {
              console.log("❌ onChooseMove requires moveId and moveTarget");
            } else {
              (callback as (moveId: string, moveTarget: string) => void)(args[0], args[1]);
            }
            break;
          case "onRoll":
            (callback as () => void)();
            break;
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
