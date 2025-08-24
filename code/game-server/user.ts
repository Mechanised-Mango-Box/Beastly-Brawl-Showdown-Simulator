import { DefaultEventsMap, Socket } from "socket.io";
import { MonsterTemplate } from "../combat/system/monster";
import { HostServerToClientEvents, HostClientToServerEvents, PlayerServerToClientEvents, PlayerClientToServerEvents, PlayerSocketData } from "../shared/types";
import { HostSocketData } from "./server";

// export type SnowflakeId = {
//   timeSinceEpoch: number;
//   machineId: number;
// };

export type Host = {
  socket: Socket<HostClientToServerEvents, HostServerToClientEvents, DefaultEventsMap, HostSocketData>;
}

export type Player = {
  socket: Socket<PlayerClientToServerEvents, PlayerServerToClientEvents, DefaultEventsMap, PlayerSocketData>;

  displayName: string;
  monsterTemplate: MonsterTemplate | null;
}
