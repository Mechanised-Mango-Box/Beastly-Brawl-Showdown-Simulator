"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketProvider = SocketProvider;
const react_1 = require("react");
const socket_context_1 = require("./socket_context");
function SocketProvider({ children }) {
    const [socket, setSocket] = (0, react_1.useState)(null);
    return <socket_context_1.SocketContext.Provider value={{ socket, setSocket }}>{children}</socket_context_1.SocketContext.Provider>;
}
