import { Meteor } from "meteor/meteor";
import { locateServerBest } from "../../server/GameServerLocator";

Meteor.methods({
  async getBestServerUrl(): Promise<string> {
    try {
      const serverUrl = await locateServerBest();
      console.log(`Attempting connection to game server @ ${serverUrl}`);

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        console.log(`Connection attempt ${attempt} of ${MAX_RETRIES}`);

        const success = await new Promise<boolean>((resolve, reject) => {
          const socket: Socket = io(serverUrl + "/host");

          const timeout = setTimeout(() => {
            socket.disconnect();
            reject(new Meteor.Error(500, "Server did not respond in time."));
          }, TIMEOUT_MS);

          socket.on("connect", () => {
            console.log("Connected, sending echo test...");
            socket.emit("echo", "Test echo msg");
          });

          socket.on("echo", (_msg) => {
            clearTimeout(timeout);
            console.log("Echo received from server!");
            socket.disconnect();
            resolve(true);
          });

          socket.on("connect_error", (err) => {
            clearTimeout(timeout);
            console.error("Socket connection failed:", err.message);
            socket.disconnect();
            reject(new Meteor.Error(500, "Could not connect to server."));
          });
        }).catch((err) => {
          console.warn(`Attempt ${attempt} failed: ${err.message}`);
          return false;
        });

        if (success) return serverUrl;
      }

      throw new Meteor.Error(500, "All connection attempts to the game server failed.");
    } catch (err: any) {
      console.error("getBestServerUrl failed:", err.message || err);
      throw new Meteor.Error(500, "Failed to locate or connect to a game server.");
    }
  },
});
