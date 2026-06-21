import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

import { verifyAccessToken } from "../utils/jwt.js";

export let io: Server;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      console.log("Socket token:", token);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyAccessToken(token);

      socket.data.userId = payload.userId;

      console.log("Authenticated:", payload.userId);

      next();
    } catch (error) {
      console.error("Socket auth error:", error);

      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, socket.data.userId);
  });

  return io;
}
