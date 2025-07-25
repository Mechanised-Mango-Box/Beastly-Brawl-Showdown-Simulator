import { DefaultEventsMap, Server, Socket } from "socket.io";
import { MonsterPool } from "../../combat/data/monster_pool";
import { Battle } from "../../combat/system/battle";
import express from "express";
import { createServer } from "node:http";
import * as readline from "readline";
import { MonsterTemplate } from "../../combat/system/monster/monster";
import { ChooseMove, Notice, NoticeKind, Roll } from "../../combat/system/notice/notice";
import { BattleEvent } from "../../combat/system/history/events";

type Player = {
  name: string;
  monsterTemplate: MonsterTemplate;
  socket: Socket<PlayerToServerEvents, ServerToPlayerEvents, never, PlayerSocketData>;
};

export interface ServerToPlayerEvents {
  newEvent: (event: BattleEvent) => void;
  newNotice: (notice: Notice) => void;
}
export interface PlayerToServerEvents {
  /// Extract the notice type that matches the kind=K requirement, then get the callback Params
  resolveNotice<K extends NoticeKind>(kind: K, params: Parameters<Extract<Notice, { kind: K }>["callback"]>): void;
}
interface PlayerSocketData {
  // name: string;
  // monsterTemplateId: number;
}

const MIN_PLAYER_COUNT = 2;

const players: Player[] = [];

/// Setup CLI
const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

/// Setup server
const app = express();
const server = createServer(app);
const io = new Server<PlayerToServerEvents, ServerToPlayerEvents, never, PlayerSocketData>(server);

/// Middleware
io.use((socket, next) => {
  const auth = socket.handshake.auth;

  if (!auth) {
    next(new Error("Authentication error"));
    return;
  }
  if (!auth.name) {
    next(new Error("Authentication error: no name provided"));
    return;
  }

  /// Valid connection
  const newPlayer: Player = {
    name: auth.name, //`P${players.length + 1}`,
    socket: socket,
    monsterTemplate: MonsterPool[1],
  };

  players.push(newPlayer);
  console.log(`New player:\n\t- Name: ${newPlayer.name}\n\t- Monster Template: ${JSON.stringify(newPlayer.monsterTemplate)}`);
  next();
});

/// Start accepting requests to connect
io.on("connection", (socket) => {
  socket.on("disconnect", (dcReason) => {
    console.log(`Socket disconnected: ${dcReason}`);
  });

  socket.onAny((args) => {
    console.log(`Recieved event: ${args}`);
  });
});

console.log("Start server at http://localhost:3000");
server.listen(3000, () => {
  console.log("Waiting for connections...");

  rl.prompt();
  /// Wait for host to confirm start
  /// - Make sure there is at least 2 players
  const listenForStart = (line: string) => {
    switch (line.trim().toLowerCase()) {
      case "start":
        console.log(`Attempting start:\n\tUsers: ${players.length}/${MIN_PLAYER_COUNT}`);
        if (players.length < MIN_PLAYER_COUNT) {
          console.log("Not enough players.");
          break;
        }
        console.log("Starting...");
        rl.removeListener("line", listenForStart);
        startSimulator();
        return;
      default:
        console.log('Awaiting "start" command...');
        break;
    }
    rl.prompt();
  };

  rl.on("line", listenForStart);
});

function startSimulator() {
  /// Create battle
  const battle: Battle = new Battle({
    seed: 0,
    playerOptionSet: players.map((player) => {
      return {
        name: player.name,
        monsterTemplate: player.monsterTemplate,
      };
    }),
    player_option_timeout: 1000,
  });

  /// Subscribe to notice events
  battle.noticeBoard.subscribeListener({
    onPostNotice: function (target: number, notice: Notice): void {
      console.log(`[target=${target}] Start listen for: ${notice.kind}`);
      players[target].socket.emit("newNotice", notice);
    },
    onRemoveNotice: function (target: number, notice: Notice): void {
      console.log(`[target=${target}] Stop listen for: ${notice.kind}`);
    },
  });
  players.map((player, index) => {
    player.socket.on("resolveNotice", (noticeKind, params) => {
      switch (noticeKind) {
        // TODO make generic
        case "chooseMove": {
          const chooseMove = battle.noticeBoard.noticeMaps[index].get(noticeKind)! as ChooseMove;
          const chooseMoveParams = params as Parameters<ChooseMove["callback"]>;
          chooseMove.callback(...chooseMoveParams);
          break;
        }

        case "roll": {
          const roll = battle.noticeBoard.noticeMaps[index].get(noticeKind)! as Roll;
          const rollParams = params as Parameters<Roll["callback"]>;
          roll.callback(...rollParams);
          break;
        }
        default:
          console.error(`Notice resolution [noticeKind=${noticeKind}] not implmeneted.`);
          break;
      }
    });
  });

  /// Subscribe to event history
  battle.eventHistory.subscribeListener({
    onNewEvent: function (event: BattleEvent): void {
      console.log(JSON.stringify(event));

      // TODO - better way to broadcast to all
      players.map((player) => {
        player.socket.emit("newEvent", event);
      });
    },
  });

  //# Start battle
  console.log(`Battle: Run`);
  battle.run();
}
