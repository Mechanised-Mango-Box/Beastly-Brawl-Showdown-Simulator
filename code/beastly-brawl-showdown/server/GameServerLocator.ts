import { Mongo } from "meteor/mongo";
import { sqids } from "./main";

export const GameServerRecords = new Mongo.Collection("game_server_registers");

/**
 * Returns the server number considered most suitable for a requester
 * TODO: Add logic to select the best server based on load, location, etc.
 */
export function getBestServerNo(): number {
  return 7; // placeholder for now
}

/**
 * Locate the best available server for a requester
 * @returns The server URL as a string
 */
export async function locateServerBest(): Promise<string> {
  try {
    const bestServerNo = getBestServerNo();
    const serverInfo = await GameServerRecords.findOneAsync({
      serverNumber: bestServerNo,
    });

    if (!serverInfo) {
      throw new Error(`Server #${bestServerNo} is unavailable or not registered.`);
    }

    if (!serverInfo.serverUrl) {
      throw new Error(`Server #${bestServerNo} has no URL configured.`);
    }

    console.log(`Best server located: #${bestServerNo} -> ${serverInfo.serverUrl}`);
    return serverInfo.serverUrl;
  } catch (err: any) {
    console.error("locateServerBest failed:", err.message || err);
    throw new Error("Unable to locate a suitable game server.");
  }
}

/**
 * Locate the server responsible for a specific join code
 * @param joinCode Encoded join code representing the server
 * @returns The server URL as a string
 */
export async function locateServer(joinCode: string): Promise<string> {
  const [serverNo] = sqids.decode(joinCode);

    const serverInfo = await GameServerRecords.findOneAsync({
      serverNumber: serverNo,
    });

    if (!serverInfo) {
      throw new Error(`Server #${serverNo} is unavailable or not registered.`);
    }

    if (!serverInfo.serverUrl) {
      throw new Error(`Server #${serverNo} has no URL configured.`);
    }

    console.log(`Server for join code "${joinCode}" located: #${serverNo} -> ${serverInfo.serverUrl}`);
    return serverInfo.serverUrl;
  } catch (err: any) {
    console.error("locateServer failed:", err.message || err);
    throw new Error(`Unable to locate server for join code "${joinCode}".`);
  }
}
