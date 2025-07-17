import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket/socket_context";
import BattleControls from "../components/battle_controls";
import { type BattleEvent } from "../../../../combat/system/history/events";
import type { Notice } from "../../../../combat/system/notice/notice";
import { useRef } from "react";
import type { ActionId } from "../../../../combat/system/action";
import type { SideId } from "../../../../combat/system/side";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showRedirectToLogin, setShowRedirectToLogin] = useState(false);
  const socketContext = useContext(SocketContext);

  const [turnHistory, setTurnHistory] = useState<BattleEvent[]>([]);
  const [pendingNotices, setPendngNotices] = useState<Notice[]>([]);

  const hasListeners = useRef(false);

  useEffect(() => {
    if (hasListeners.current) {
      return;
      /// Socket connection already exists - dont need this
    }

    if (!socketContext) {
      console.error("This component requiries a parent SocketContext");
      return;
    }

    if (!socketContext.socket) {
      console.error("This no socket on record, get one from join first.");
      setShowRedirectToLogin(true);

      const timer = setTimeout(() => {
        navigate("/join");
      }, 5000);

      return () => clearTimeout(timer);
    }

    socketContext.socket.onAny((event, args) => console.log(`Event recieved:\n${event}\n${JSON.stringify(args)}`));

    socketContext.socket.on("newEvent", (event: BattleEvent) => {
      console.log(`New event recorded: ${JSON.stringify(event)}`);
      setTurnHistory((prev) => [...prev, event]);
    });
    socketContext.socket.on("newNotice", (notice: Notice) => {
      console.log(`New notice recieved: ${JSON.stringify(notice)}`);
      setPendngNotices((prev) => [...prev, notice]);
      console.log(`Queued notice (length=${pendingNotices.length}): ${JSON.stringify(notice)}`);
    });

    return () => {
      if (!socketContext.socket) {
        return;
      }

      socketContext.socket.off("newEvent");
      socketContext.socket.off("newNotice");
      socketContext.socket.offAny();
    };
  }, [socketContext, navigate]);

  if (!socketContext) {
    return (
      <>
        <p>Error: Expected a socket context</p>
      </>
    );
  }

  if (showRedirectToLogin) {
    return <p>Not connected to a server. Redirecting...</p>;
  }

  function actionPanel() {
    if (pendingNotices.length == 0) {
      return <p>No pending action</p>;
    }

    const currentNotice = pendingNotices[0];
    switch (currentNotice.kind) {
      case "chooseMove": {
        return (
          <>
            <BattleControls
              onSelectedMoveId={(actionId) => {
                console.log(`Action pressed: ${actionId}`);
                const params: Parameters<typeof currentNotice.callback> = [1 as ActionId, 1 as SideId];
                socketContext?.socket?.emit("resolveNotice", currentNotice.kind, params);

                pendingNotices.pop();
              }}
              chooseMove={currentNotice}
            />
          </>
        );
      }
      case "roll": {
        return (
          <button
            onClick={() => {
              console.log("Roll triggered.");
              const params: Parameters<typeof currentNotice.callback> = [];
              socketContext?.socket?.emit("resolveNotice", currentNotice.kind, params);

              pendingNotices.pop();
            }}
          >
            Roll
          </button>
        );
      }
      case "rerollOption": {
        return <button>Reroll</button>;
      }
      default:
        return <p>ERROR - unexpected value</p>;
    }
  }

  return (
    <>
      <h1>WIP - GAME</h1>
      <div>
        <textarea disabled value={JSON.stringify(turnHistory)} />
        <br />
        {actionPanel()}
      </div>
    </>
  );
};

export default GamePage;
