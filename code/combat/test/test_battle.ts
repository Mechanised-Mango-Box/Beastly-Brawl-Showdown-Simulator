import { MonsterPool } from "../data/monster_pool";
import { makeMonster } from "../system/monster";
import { Battle, BattleId } from "../system/battle";
import http from "http";
import { DefaultEventsMap, Namespace, Server, Socket } from "socket.io";
import { HostClientToServerEvents, HostServerToClientEvents, PlayerClientToServerEvents, PlayerServerToClientEvents, PlayerSocketData } from "../../shared/types";
import { battle_runner } from "../system/battle_runner";
import { SideId } from "../system/side";
import { Player } from "../../game-server/user";
import * as readline from "readline";
import cors from "cors";
import express from "express";
import { HostSocketData } from "../../game-server/server";
import { log_attention, log_notice } from "../../shared/utils";
const PORT = 8080;
const expressApp = express();
expressApp.use(cors()); // Allow cross-origin requests
expressApp.use(express.json()); // Allow cross-origin requests

const httpServer = http.createServer(expressApp);
const socketServer = new Server(httpServer, { cors: { origin: "*" } });

const playerChannel: Namespace<PlayerClientToServerEvents, PlayerServerToClientEvents, DefaultEventsMap, PlayerSocketData> = socketServer.of("/player");
// const hostChannel: Namespace<HostClientToServerEvents, HostServerToClientEvents, DefaultEventsMap, HostSocketData> = socketServer.of("/host");

const battle: Battle = {
  battleId: 0 as BattleId,
  sides: [],
  turnCount: 0
};

playerChannel.on("connection", (socket) => {
  console.log("CONNECTION");
  // Temp assign
  const _pid = battle.sides.length;
  const _p: Player = {
    socket: socket,
    displayName: `player #${_pid}`,
    monsterTemplate: MonsterPool[0],
  };

  battle.sides.push({
    id: _pid as SideId,
    controllingPlayer: _p,
    monster: makeMonster(_p.monsterTemplate!),
    turns: []
  });

  if (battle.sides.length >= 2) {
    start_battle();
  }
});

function start_battle() {
  battle.sides.forEach((side) => {
    side.monster.health = side.monster.template.baseStats.health;
  }); //* Heal all to full

  console.log("START BATTLE");
  battle_runner(battle);
}

//#region IO
httpServer.listen(PORT, () => {
  log_notice(`Socket.IO server running on ${"localhost" + ":" + PORT}. <CTRL+C> to shutdown.`);

  // Readline setup
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Listen for CTRL+C (SIGINT) https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
  const listenForShutdown = (): void => {
    process.on("SIGINT", () => {
      log_attention("Gracefully shutting down...");

      rl.close(); // Close input interface
      socketServer.close(); // Close Socket.IO
      httpServer.close(() => {
        log_attention("Server closed.");
        process.exit(0); // Exit process
      });
    });
  };

  // Start listening
  listenForShutdown();
  //#endregion
});
