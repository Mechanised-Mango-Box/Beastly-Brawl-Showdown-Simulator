import { Socket } from "socket.io";
import Sqids from "sqids";
import { LobbyId, ServerId, JoinCode } from "../shared/types";
import { Lobby } from "./lobby";
import { Host } from "./user";

/**
 * A map of {@link Lobby} instances, with automatic assignment of IDs.
 */
export class LobbyManager {
  private lobbies = new Map<LobbyId, Lobby>();

  readonly serverId: ServerId;
  readonly maxCapacity: number;

  readonly CODE_MIN_LENGTH = 6; // TODO move to argv
  readonly CODE_ALPHABET = "0123456789"; // TODO move to argv
  private readonly sqids = new Sqids({
    minLength: this.CODE_MIN_LENGTH,
    alphabet: this.CODE_ALPHABET,
  });
  
  constructor(serverId: ServerId, maxCapacity: number) {
    if (serverId < 0) {
      throw new Error("Invalid server id.");
    }

    this.serverId = serverId;

    if (maxCapacity <= 0) {
      throw new Error("Invalid server capacity.");
    }

    this.maxCapacity = maxCapacity;
  }

  encodeJoinCode(serverId: ServerId, lobbyId: LobbyId): JoinCode {
    return this.sqids.encode([serverId, lobbyId]) as JoinCode;
  }

  decodeJoinCode(joinCode: JoinCode): { serverId: ServerId; lobbyId: LobbyId } {
    const [serverId, lobbyId] = this.sqids.decode(joinCode);
    return {
      serverId: serverId as ServerId,
      lobbyId: lobbyId as LobbyId,
    };
  }

  private lastAssignedLobbyId: LobbyId = 0 as LobbyId;
  private peekNextLobbyId(): LobbyId {
    return (this.lastAssignedLobbyId + 1) as LobbyId;
  }

  private popNextLobbyId(): LobbyId {
    this.lastAssignedLobbyId = this.peekNextLobbyId();

    return this.lastAssignedLobbyId;
  }

  getLobby(lobbyId: LobbyId): Lobby | null {
    return this.lobbies.get(lobbyId) ?? null;
  }

  hasLobby(lobbyId: LobbyId): boolean {
    return this.lobbies.has(lobbyId);
  }

  allocate(hostSocket: Socket): { lobbyId: LobbyId; joinCode: JoinCode } {
    const newLobbyId = this.popNextLobbyId() as LobbyId;
    const newHost: Host = {
      socket: hostSocket,
    };

    const newLobby = new Lobby(newHost, newLobbyId, this.encodeJoinCode(this.serverId, newLobbyId));

    this.lobbies.set(newLobbyId, newLobby);

    return {
      lobbyId: newLobby.lobbyId,
      joinCode: newLobby.joinCode,
    };
  }

  deallocate(lobbyId: LobbyId): void {
    console.log("attempting to deallocate lobby #", lobbyId);
    throw new Error("Not implemented");
  }
}
