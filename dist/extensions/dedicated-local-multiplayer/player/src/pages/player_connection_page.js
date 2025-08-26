"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("react");
const socket_io_client_1 = require("socket.io-client");
const socket_context_1 = require("../socket/socket_context");
const PlayerConnectionPage = () => {
    const [playerName, setPlayerName] = (0, react_1.useState)("");
    const [serverAddress, setServerAddress] = (0, react_1.useState)("localhost:3000");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const socketContext = (0, react_2.useContext)(socket_context_1.SocketContext);
    if (!socketContext) {
        return (<>
        <p>Error: Expected a socket context</p>
      </>);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!playerName.trim() || !serverAddress.trim()) {
            alert("Please enter both a player name and a server address.");
            return;
        }
        if (!socketContext.socket) {
            console.log("Replacing socket...");
        }
        const newSocket = (0, socket_io_client_1.io)(`http://${serverAddress}`, {
            auth: { name: playerName, monsterTemplate: 1 },
            transports: ["websocket"],
        });
        socketContext.setSocket(newSocket);
        navigate("/");
    };
    return (<>
      <h1>Join Game Server</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="playerName">Player Name</label>
          <input id="playerName" type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter your name"/>
        </p>
        <p>
          <label htmlFor="serverAddress">Server (IP:Port)</label>
          <input id="serverAddress" type="text" value={serverAddress} onChange={(e) => setServerAddress(e.target.value)} placeholder="e.g. 127.0.0.1:3000"/>
        </p>
        <p>
          <button type="submit">Connect</button>
        </p>
      </form>
    </>);
};
exports.default = PlayerConnectionPage;
