import { io } from "socket.io-client";

const socket = io("http://localhost:8080/");

socket.on("starttournament", (msg: any) => {
  console.log("Tournament started:", msg);
});

socket.on("reportbattleresults", (msg: any) => {
    console.log("Battle results reported:", msg);
});

