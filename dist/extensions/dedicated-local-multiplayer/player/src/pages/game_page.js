"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const socket_context_1 = require("../socket/socket_context");
const battle_controls_1 = require("../components/battle_controls");
const react_2 = require("react");
const common_move_pool_1 = require("@sim/data/common/common_move_pool");
const GamePage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [showRedirectToLogin, setShowRedirectToLogin] = (0, react_1.useState)(false);
    const socketContext = (0, react_1.useContext)(socket_context_1.SocketContext);
    const [selfInfo, setSelfInfo] = (0, react_1.useState)(null);
    const [turnHistory, setTurnHistory] = (0, react_1.useState)(null);
    const [pendingNotices, setPendngNotices] = (0, react_1.useState)(null);
    const hasListeners = (0, react_2.useRef)(false);
    const connectProcedure = async () => {
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
        /// Request game data
        setSelfInfo(await socketContext.socket.emitWithAck("getSelfInfo"));
        if (!selfInfo) {
            console.error("Did not recieve SelfInfo");
            return;
        }
        setTurnHistory(await socketContext.socket.emitWithAck("getHistory"));
        if (!turnHistory) {
            console.error("Did not recieve TurnHistory");
            return;
        }
        setPendngNotices(await socketContext.socket.emitWithAck("getNotices"));
        if (!pendingNotices) {
            console.error("Did not recieve PendingNotices");
            return;
        }
        // TODO block / display loading until all data recieved
        socketContext.socket.on("newEvent", (event) => {
            console.log(`New event recorded: ${JSON.stringify(event)}`);
            setTurnHistory((prev) => [...prev, event]);
        });
        socketContext.socket.on("newNotice", (notice) => {
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
    };
    (0, react_1.useEffect)(() => {
        connectProcedure();
    }, [socketContext, navigate]);
    if (!socketContext) {
        return (<>
        <p>Error: Expected a socket context</p>
      </>);
    }
    if (showRedirectToLogin) {
        return <p>Not connected to a server. Redirecting...</p>;
    }
    function actionPanel() {
        if (!pendingNotices || pendingNotices.length == 0) {
            return <p>No pending action</p>;
        }
        const currentNotice = pendingNotices[0];
        switch (currentNotice.kind) {
            case "chooseMove": {
                return (<>
            <battle_controls_1.default onSelectedMoveId={(moveId) => {
                        console.log(`Action pressed: ${moveId}`);
                        let targeting;
                        switch (common_move_pool_1.commonMovePool[moveId].targetingMethod) {
                            case "self": {
                                const selfTargeting = {
                                    targetingMethod: "self",
                                };
                                targeting = selfTargeting;
                                break;
                            }
                            case "single-enemy": {
                                const singleEnemyTargeting = {
                                    targetingMethod: "single-enemy",
                                    target: ((selfInfo + 1) % 2), // TODO get side id
                                };
                                targeting = singleEnemyTargeting;
                                break;
                            }
                            default:
                                console.error(`Error: Unknown targeting method: ${common_move_pool_1.commonMovePool[moveId].targetingMethod}`);
                                return;
                        }
                        const params = [moveId, targeting];
                        socketContext?.socket?.emit("resolveNotice", currentNotice.kind, params);
                        pendingNotices.pop();
                    }} chooseMove={currentNotice}/>
          </>);
            }
            case "roll": {
                return (<>
            <div style={{
                        backgroundColor: "RosyBrown",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
              <img src={"src/assets/rolling-dice-cup.svg"} onClick={() => {
                        console.log("Roll triggered.");
                        const params = [];
                        socketContext?.socket?.emit("resolveNotice", currentNotice.kind, params);
                        pendingNotices.pop();
                    }} style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                    }}/>
            </div>
          </>);
            }
            case "rerollOption": {
                return <button>Reroll</button>;
            }
            default:
                return <p>ERROR - unexpected value</p>;
        }
    }
    return (<>
      <h1>WIP - GAME</h1>
      <div>
        {/* <BattleVisualizer /> */}
        <textarea disabled value={JSON.stringify(turnHistory)}/>
        <br />
        {actionPanel()}
      </div>
    </>);
};
exports.default = GamePage;
