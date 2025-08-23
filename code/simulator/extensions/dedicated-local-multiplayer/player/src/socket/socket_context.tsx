import { createContext } from "react";
import type { Socket } from "socket.io-client";
// import { type PlayerToServerEvents, type ServerToPlayerEvents } from "../../../host/app";
// TODO make this interface shared

type SocketContextType = {
  socket: Socket | null;
  // socket: Socket<ServerToPlayerEvents, PlayerToServerEvents> | null;
  setSocket: (value: Socket) => void;
};

export const SocketContext = createContext<SocketContextType | null>(null);
