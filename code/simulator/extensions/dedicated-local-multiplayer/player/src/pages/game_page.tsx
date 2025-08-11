import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket/socket_context";
import BattleControls from "../components/battle_controls";
import { type BaseEvent } from "../../../../../core/event/base_event";
import type { Notice } from "../../../../../core/notice/notice";
import { useRef } from "react";
import type { SideId } from "../../../../../core/side";
import type { SelfTargeting, SingleEnemyTargeting, TargetingData } from "../../../../../core/action/targeting";
import { commonMovePool } from "../../../../../data/common_move_pool";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showRedirectToLogin, setShowRedirectToLogin] = useState(false);
  const socketContext = useContext(SocketContext);

  const [turnHistory, setTurnHistory] = useState<BaseEvent[]>([]);
  const [pendingNotices, setPendngNotices] = useState<Notice[]>([]);

  const hasListeners = useRef(false);

  useEffect(() => {
    if (hasListeners.current) {
      return; /// Socket connection already exists - dont need this
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

    socketContext.socket.onAny((event, args) => console.log(`Message recieved:\n${event}\n${JSON.stringify(args)}`));

    // TODO request game data - block / display loading until all data recieved

    socketContext.socket.on("newEvent", (event: BaseEvent) => {
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
              onSelectedMoveId={(moveId) => {
                console.log(`Action pressed: ${moveId}`);
                let targeting: TargetingData;
                switch (commonMovePool[moveId].targetingMethod) {
                  case "self":
                    const selfTargeting: SelfTargeting = {
                      targetingMethod: "self"
                    }
                    targeting = selfTargeting
                    break;
                  case "single-enemy":
                    const singleEnemyTargeting: SingleEnemyTargeting = {
                      targetingMethod: "single-enemy",
                      target: ((sideId + 1) % 2) as SideId, // TODO get side id
                    }
                    targeting = singleEnemyTargeting
                    break;

                  default:
                    console.error(`Error: Unknown targeting method: ${commonMovePool[moveId].targetingMethod}`)
                    return;
                }
                const params: Parameters<typeof currentNotice.callback> = [moveId, targeting];
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
          <>
            <div
              style={{
                backgroundColor: "cornsilk",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={"src/assets/rolling-dice-cup.svg"}
                onClick={() => {
                  console.log("Roll triggered.");
                  const params: Parameters<typeof currentNotice.callback> = [];
                  socketContext?.socket?.emit("resolveNotice", currentNotice.kind, params);

                  pendingNotices.pop();
                }}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </div>
          </>
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
