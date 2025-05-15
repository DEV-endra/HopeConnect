import { io } from "socket.io-client";

const socket = io("wss://hopeconnect-backend.onrender.com", {
    transports: ["websocket"]
});

export default socket;