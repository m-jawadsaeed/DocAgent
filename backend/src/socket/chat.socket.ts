import { io } from "./socket.js";
import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export function registerChatSocket() {
  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("chat:send", async (payload) => {
      try {
        await chatService.streamToSocket(
          socket,
          payload.userId,
          payload.conversationId,
          payload.question,
        );
      } catch (error) {
        socket.emit("chat:error", {
          message: "Something went wrong",
          error,
        });
      }
    });
  });
}
