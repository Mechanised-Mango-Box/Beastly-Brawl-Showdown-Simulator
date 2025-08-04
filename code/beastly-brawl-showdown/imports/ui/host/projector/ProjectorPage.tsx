import { Meteor } from "meteor/meteor";
import { WaitingRoomInfoBox } from "./WaitingRoomInfoBox";
import { ParticipantDisplayBox } from "./ParticipantDisplayBox";
import { io } from "socket.io-client";
import React, { useState } from "react";

export default function ProjectorPage() {
  const [serverUrl, setServerUrl] = useState<string>();
  const [roomId, setRoomId] = useState<number>();
  const [joinCode, setJoinCode] = useState<string>("");

  const [playerList, setPlayerList] = useState<string[]>([]);

  //#region Startup
  if (!serverUrl) {
    /// Try get best server url
    Meteor.call("getBestServerUrl", (error: any, result: string) => {
      if (error) {
        console.error("Error locating room:", error);
        return;
      }

      console.log("Server found at:", result);
      setServerUrl(result);
    });

    return (
      <>
        <p>Connecting to servers...</p>
      </>
    );
  }

  // Connect to game server
  const socket = io(serverUrl + "/host");
  socket.on("connect", () => {
    console.log("Connected to server");

    // Send a test message
    socket.emit("message", "Hello from Projector!");
  });

  socket.on("connect_error", (err: Error) => {
    console.error(`Connection failed: ${err.message}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("echo", (msg: string) => {
    console.log(`Server says: ${msg}`);
  });
  //#endregion
  function getJoinUrl() {
    return Meteor.absoluteUrl() + "join/" + joinCode;
  }
  //#region Request Room
  socket.on(
    "request-room_response",
    (roomInfo: { roomId: number; joinCode: string }) => {
      console.log("Room request response", roomInfo);
      setRoomId(roomInfo.roomId);
      setJoinCode(roomInfo.joinCode);
    }
  );
  //#endregion

  //#region Host App events
  socket.on("player-set-changed", (newPlayerList: string[]) => {
    console.log("New set of players:", newPlayerList.toString());
    setPlayerList(newPlayerList);
  });

  if (!roomId) {
    socket.emit("request-room");
    return (
      <>
        <p>Starting room...</p>
      </>
    );
  }
  //#endregion

  //#region Host App

  return (
    <div className="canvas-body" id="waiting-room-body">
      {/* <ParticipantDisplayBox name={playerList.toString()} /> */}
      <div className="waiting-room-header">
        <div className="join-info">
          Join the game with your phone!
        </div>
        <WaitingRoomInfoBox joinCode={joinCode} joinUrl={getJoinUrl()} />
      </div>

      <div className="waiting-room-logo">
        <h1>Beastly Brawl Showdown!</h1>
      </div>

      <ParticipantDisplayBox name={playerList.toString()} />
    </div>
  );
  //#endregion
}
