import { io } from "socket.io-client";

const socket = io("ws://localhost:3000", {
    transports: ["websocket"]
});

export default socket;