import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MonsterSelectionScreen } from "../../MonsterSelection/MonsterSelectionScreen";
import { MonsterPool } from "/imports/simulator/data/monster_pool";
import { Monster } from "/imports/simulator/core/monster/monster";

export const Player = () => {
  const joinCode = sessionStorage.getItem("joinCode");
  const displayName = sessionStorage.getItem("displayName");
  const serverUrl = sessionStorage.getItem("serverUrl");

  //#region Connect to game server
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(serverUrl + "/player", {
      auth: { joinCode, displayName },
    });
    console.log("Connecting to server with auth...");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socketRef.current.on("connect_error", (err: Error) => {
      console.error(`Connection failed: ${err.message}`);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socketRef.current?.disconnect(); // Cleanup on unmount
    };
  }, []);

  //#endregion

  //#region Monster Selection State
  const [monsterSelected, setMonsterSelected] = useState(false);

  // Callback when a monster is chosen
  const handleMonsterSelection = (monsterName: string) => {
    const template = MonsterPool.find(m => m.name === monsterName);
    if (!template) {
      console.error("Invalid monster selected:", monsterName);
      return;
    }

    const monsterInstance = new Monster(template);

    if (socketRef.current) {
      socketRef.current.emit("RequestSubmitMonster", { data: monsterInstance });
      setMonsterSelected(true);
      console.log("Monster selected:", monsterName);
    } else {
      console.warn("No socket connection available");
    }
  };
  //#endregion

  // Show connection waiting screen
  if (!isConnected) {
    return <p>Connecting to server...</p>;
  }

  // Show monster selection screen until a monster is picked
  if (!monsterSelected) {
    return <MonsterSelectionScreen setSelectedMonsterCallback={handleMonsterSelection} />;
  }

  // Once a monster is picked, fallback to your existing waiting screen
  return (
    <div className="waiting-screen">
      <div className="logo" />
      <div className="waiting-wrapper">
        <div className="waiting-line" />
        <p className="waiting-text">Waiting for other players...</p>
        <div className="waiting-line" />
      </div>
    </div>
  );
};
