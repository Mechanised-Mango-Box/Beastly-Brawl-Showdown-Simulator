"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const battle_1 = require("@sim/core/battle");
const express_1 = require("express");
const node_http_1 = require("node:http");
const readline = require("readline");
const common_monster_pool_1 = require("@sim/data/common/common_monster_pool");
const common_move_pool_1 = require("@sim/data/common/common_move_pool");
const MIN_PLAYER_COUNT = 2;
const players = [];
/// Setup CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
});
/// Setup server
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173/",
    },
});
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
    const newPlayer = {
        name: auth.name, //`P${players.length + 1}`,
        sideId: players.length,
        socket: socket,
        monsterId: "mystic_wryven",
    };
    players.push(newPlayer);
    console.log(`New player:\n\t- Name: ${newPlayer.name}\n\t- Monster Template: ${JSON.stringify(newPlayer.monsterId)}`);
    next();
});
/// Start accepting requests to connect
io.on("connection", (socket) => {
    socket.on("disconnect", (dc_reason) => {
        console.log(`Socket disconnected: ${dc_reason}`);
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
    const listenForStart = (line) => {
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
    const battle = new battle_1.Battle({
        seed: 0,
        monsterPool: common_monster_pool_1.COMMON_MONSTER_POOL,
        movePool: common_move_pool_1.commonMovePool,
        playerOptionSet: players.map((player) => {
            const playerOptions = {
                monsterId: player.monsterId,
            };
            return playerOptions;
        }),
    });
    /// Subscribe to notice events
    battle.noticeBoard.subscribeListener({
        onPostNotice: function (target, notice) {
            console.log(`[target=${target}] Start listen for: ${notice.kind}`);
            players[target].socket.emit("newNotice", notice);
        },
        onRemoveNotice: function (target, notice) {
            console.log(`[target=${target}] Stop listen for: ${notice.kind}`);
        },
    });
    players.map((player, index) => {
        player.socket.on("getSelfInfo", () => {
            return player.sideId;
        });
        player.socket.on("getHistory", () => {
            return battle.eventHistory.events;
        });
        player.socket.on("getNotices", () => {
            return Array.from(battle.noticeBoard.noticeMaps[player.sideId].values());
        });
        player.socket.on("resolveNotice", (noticeKind, params) => {
            switch (noticeKind) {
                // TODO make generic
                case "chooseMove": {
                    const chooseMove = battle.noticeBoard.noticeMaps[index].get(noticeKind);
                    const chooseMoveParams = params;
                    chooseMove.callback(...chooseMoveParams);
                    break;
                }
                case "roll": {
                    const roll = battle.noticeBoard.noticeMaps[index].get(noticeKind);
                    const rollParams = params;
                    roll.callback(...rollParams);
                    break;
                }
                // TODO Reroll
                default:
                    console.error(`Notice resolution [noticeKind=${noticeKind}] not implmeneted.`);
                    break;
            }
        });
    });
    /// Subscribe to event history
    battle.eventHistory.subscribeListener({
        onNewEvent: function (event) {
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
