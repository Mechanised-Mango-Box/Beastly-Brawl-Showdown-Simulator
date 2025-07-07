import { io, Socket } from "socket.io-client";
import { PlayerClientToServerEvents, PlayerServerToClientEvents } from "../../shared/types";
import { MonsterId } from "../system/monster";
import { ActionId } from "../system/action";

const socket: Socket<PlayerServerToClientEvents, PlayerClientToServerEvents> = io("http://localhost:8080/player");

// Listen for connection confirmation
socket.on("connect", () => {
  console.log("Connected to server. My socket ID:", socket.id);
});

socket.onAny((event) => {
  console.log(`Event: ${event}`);
});

socket.on("requestMoveSelection", (responseDeadline) => {
	// socket.emit("submitMove", {
	// 	actionId: 1 as ActionId,
	// 	targetSideId: 
	// });
	// console.log("Submitted move #1")
	console.log("timing out and allowing random")
});
