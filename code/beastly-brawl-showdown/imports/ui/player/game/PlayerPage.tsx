import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const Player = () => {
  const joinCode = sessionStorage.getItem("joinCode");
  const displayName = sessionStorage.getItem("displayName");
  const serverUrl = sessionStorage.getItem("serverUrl");

  //#region Connect to game server
  const socketRef = useRef<Socket>();
  useEffect(() => {
    socketRef.current = io(serverUrl + "/player", {
      auth: {
        joinCode: joinCode,
        displayName: displayName,
      },
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

    socketRef.current.on("echo", (msg: string) => {
      console.log(`Server says: ${msg}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Cleanup on unmount
      }
    };
  }, []);
  //#endregion

  const [isConnected, setIsConnected] = useState(false);

  //#region Bouncing animation
  const waitingTextRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isConnected) return;

    const restartAnimation = () => {
      if (waitingTextRef.current) {
        const letters = waitingTextRef.current.querySelectorAll('.bounce-letter');
        letters.forEach((letter, index) => {
          const element = letter as HTMLElement;
          // Remove animation
          element.style.animation = 'none';
          // Force reflow
          requestAnimationFrame(() => {
            element.style.animation = `bounce 0.6s ease-in-out ${index * 0.1}s both`;
          });
        });
      }
    };

    // Start first animation after a brief delay
    const initialTimeout = setTimeout(restartAnimation, 100);
    
    // Loop every 2 seconds
    const interval = setInterval(restartAnimation, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isConnected]);
  //#endregion

  if (!isConnected) {
    return <p>Connecting to server...</p>;
  }

  return (
    <div className="waiting-screen">
      <div className="logo" />
      <div className="waiting-wrapper">
        <div className="waiting-line" />
        <div className="waiting-text" ref={waitingTextRef}>
          <span className="bounce-letter">W</span>
          <span className="bounce-letter">a</span>
          <span className="bounce-letter">i</span>
          <span className="bounce-letter">t</span>
          <span className="bounce-letter">i</span>
          <span className="bounce-letter">n</span>
          <span className="bounce-letter">g</span>
          <span className="bounce-letter">.</span>
          <span className="bounce-letter">.</span>
          <span className="bounce-letter">.</span>
        </div>
        <div className="waiting-line" />
      </div>
    </div>
  );
};
