import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";

let socket: Socket | null = null;

export function connectSocket() {
  const token = useAuthStore.getState().accessToken;

  if (!token) {
    console.error("No token found");
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("SOCKET ERROR", err);
  });

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED");
  });

  return socket;
}

export function getSocket() {
  return socket;
}
