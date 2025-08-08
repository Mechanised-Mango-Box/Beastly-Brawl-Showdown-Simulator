import * as readline from "readline";
import cors from "cors";
import express from "express";
import http from "http";
import { DefaultEventsMap, Namespace, Server, Socket } from "socket.io";
import connectDb from "./db/db";
import { GameServerRegisterModel, IGameServerRegisterEntry } from "./db/models";
import { log_attention, log_event, log_notice, log_warning } from "../shared/utils";
import { HostServerToClientEvents, HostClientToServerEvents, PlayerServerToClientEvents, PlayerClientToServerEvents, PlayerSocketData } from "../shared/types";
import { LobbyManager } from "./lobby_manager";
import { ServerId } from "../shared/types";
import { PlayerChannelAuth, HostChannelAuth } from "../shared/types";
import { Player } from "./user";
import { MonsterPool } from "../simulator/data/monster_pool";

export type ServerConfig = {
  serverIp: string;
  serverPort: number;
  serverNumber: number;
  maxCapcity: number;
  overrideExistingRecordOnStartup: boolean;
};

export type HostSocketData = { placeholder: null };

export async function run(serverConfig: ServerConfig): Promise<void> {
  //#region Startup
  log_notice("Starting server...");

  log_notice("Start websocket server...");
  const expressApp = express();
  expressApp.use(cors()); // Allow cross-origin requests
  expressApp.use(express.json()); // Allow cross-origin requests

  const httpServer = http.createServer(expressApp);
  const socketServer = new Server(httpServer, { cors: { origin: "*" } });

  const playerChannel: Namespace<PlayerClientToServerEvents, PlayerServerToClientEvents, DefaultEventsMap, PlayerSocketData> = socketServer.of("/player");
  const hostChannel: Namespace<HostClientToServerEvents, HostServerToClientEvents, DefaultEventsMap, HostSocketData> = socketServer.of("/host");

  log_notice("Websockets server started.");
  log_notice("Connect to database...");
  connectDb();
  log_notice("Register to global records...");
  const existingRecordCount = await GameServerRegisterModel.countDocuments({
    serverNumber: serverConfig.serverNumber,
  });
  if (existingRecordCount > 0) {
    console.log(`Exsting records found with server number <${serverConfig.serverNumber}>: ${existingRecordCount}`);
    if (!serverConfig.overrideExistingRecordOnStartup) {
      throw new Error("A record already exists, room could not be registered.");
    }
  }
  const updatedRecord = await GameServerRegisterModel.findOneAndUpdate<IGameServerRegisterEntry>(
    { serverNumber: serverConfig.serverNumber },
    {
      serverNumber: serverConfig.serverNumber,
      serverUrl: serverConfig.serverIp.toString() + ":" + serverConfig.serverPort.toString(),
      lastUpdated: new Date(),
    },
    { upsert: true, new: true }
  );
  log_notice("New Record:\n" + JSON.stringify(updatedRecord));
  log_notice("Registered to records.");

  log_notice("Starting allocating resources...");
  const lobbyManager: LobbyManager = new LobbyManager(serverConfig.serverNumber as ServerId, serverConfig.maxCapcity);
  log_notice("Resources allocated.");

  log_notice("Server set up complete.");
  //#endregion

  //#region Events
  log_notice("Register events and start listening...");
  log_notice("Attatching events...");
  socketServer.on("connection", async (socket: Socket) => {
    log_event(`User connected with id: ${socket.id}`);

    //#region Standard
    socket.on("disconnect", () => {
      log_event("User disconnected.");
    });

    socket.on("ping", () => {
      log_event("pinged");
      socket.emit("pong");
    });
    //#endregion
  });

  hostChannel.use((socket, next) => {
    log_event(`Host attempted to join with ${JSON.stringify(socket.handshake.auth)}`);
    // const auth = socket.handshake.auth as HostChannelAuth;
    // // TODO for now always accept the host name
    // if (!auth.hostName) {
    //   next(new Error("No host name provided."));
    //   return;
    // }

    next();
  });

  //#region Host Events
  // TODO use a persistent ID rather than socket ID
  hostChannel.on("connection", async (socket) => {
    socket.on("requestNewLobby", (res) => {
      try {
        const connectionDetails = lobbyManager.allocate(socket); // Generate a new lobby
        res({ success: true, value: { lobbyId: connectionDetails.lobbyId, joinCode: connectionDetails.joinCode } }); // Return the new lobby's connection details to host
      } catch {
        res({ success: false, error: new Error("Could not assgin a room.") });
        return;
      }
    });
  });
  //#endregion

  //#region Player Events
  /// Pre-connection auth check
  expressApp.post("/player-auth-precheck", (req, res) => {
    log_event("Player is prechecking auth\n" + JSON.stringify(req.body));

    const checkResult: {
      isJoinCodeValid: boolean | null;
      isDisplayNameValid: boolean | null;
    } = {
      isJoinCodeValid: null,
      isDisplayNameValid: null,
    };

    if (!req.body) {
      log_notice(`Player auth check result:\n${JSON.stringify(checkResult)}`);
      res.send(checkResult);
      return;
    }

    if (!req.body.joinCode) {
      checkResult.isJoinCodeValid = false;
      log_notice(`Player auth check result:\n${JSON.stringify(checkResult)}`);
      res.send(checkResult);
      return;
    }

    const { lobbyId } = lobbyManager.decodeJoinCode(req.body.joinCode);
    checkResult.isJoinCodeValid = lobbyManager.hasLobby(lobbyId);

    if (!req.body.displayName) {
      checkResult.isDisplayNameValid = false;
      log_notice(`Player auth check result:\n${JSON.stringify(checkResult)}`);
      res.send(checkResult);
      return;
    }
    checkResult.isDisplayNameValid = !lobbyManager.getLobby(lobbyId)?.hasPlayer(req.body.displayName);

    log_notice(`Player auth check result:\n${JSON.stringify(checkResult)}`);
    res.send(checkResult);
  });

  playerChannel.use((socket, next) => {
    // TODO change to callback
    log_event(`Player attempted to join with ${JSON.stringify(socket.handshake.auth)}`);
    const auth = socket.handshake.auth as PlayerChannelAuth;
    if (!auth.joinCode) {
      socket.emit("error", "No join code");
      return;
    }
    if (!auth.displayName) {
      socket.emit("error", "No display name");
      return;
    }
    const { lobbyId } = lobbyManager.decodeJoinCode(auth.joinCode);
    if (!lobbyManager.hasLobby(lobbyId)) {
      log_event("Joined with invalid join code");
      next(new Error("Invalid credentials"));
      return;
    }
    try {
      const lobby = lobbyManager.getLobby(lobbyId)!;
      const newPlayer: Player = {
        socket: socket,
        displayName: auth.displayName,
        monsterTemplate: null,
      };

      log_event(`Join code <${auth.joinCode}> is valid. From <${auth.displayName}>. Socket id = ${socket.id}`);
      log_event(`Adding and setting up player: <${auth.displayName}>. Socket id = ${socket.id}`);
      lobby.addAndSetupPlayer(newPlayer);

      log_event(`Refreshing player list.`);
      lobby.refreshPlayerList();

      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        log_warning("Join room failed unexpectedly.\n" + err.message);
      } else {
        log_attention("Unexpected error is not of error type.");
      }
      next(new Error("Invalid credentials"));
    }
  });

  playerChannel.on("connection", async (socket) => {
    const response = await socket.emitWithAck("requestMonsterSelection");
  });
  //#endregion

  //#region IO
  httpServer.listen(serverConfig.serverPort, () => {
    log_notice(`Socket.IO server running on ${serverConfig.serverIp.toString() + ":" + serverConfig.serverPort.toString()}. <CTRL+C> to shutdown.`);

    // Readline setup
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Listen for Ctrl + C (SIGINT) https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html
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
}
