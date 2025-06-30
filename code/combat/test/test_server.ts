import { MonsterPool } from "../data/monster_pool";
import { makeMonster } from "../system/monster";
import { asBattleId, Battle } from "../system/battle";
import { asSideId } from "../system/side";
import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../../shared/game_api";

const expressApp = express();
expressApp.use(cors()); // Allow cross-origin requests
expressApp.use(express.json()); // Allow cross-origin requests

const httpServer = http.createServer(expressApp);
export const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, { cors: { origin: "*" } });

const playerChannel = socketServer.of("/player");
const hostChannel = socketServer.of("/host");

import * as readline from "readline";
import { battle_runner } from "../system/battle_runner";

function askCommand(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function main() {
  const battle: Battle = {
    battleId: asBattleId(0),
    sides: [],
  };

  // await connections

  const command = await askCommand("Waiting for start:\n");
  console.log(`Starting...`);

  battle.sides.forEach((side) => {
    side.monster.health = side.monster.template.baseStats.health;
  }); //* Heal all to full

  battle_runner(battle);

}

main();
