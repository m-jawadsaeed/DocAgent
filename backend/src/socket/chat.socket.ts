import { io } from "./socket.js";

import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export function registerChatSocket() {
  io.on("connection", (socket) => {
    console.log(` Socket Connected: ${socket.id}`);

    socket.on("chat:send", async ({ userId, conversationId, question }) => {
      try {
        if (!userId || !conversationId || !question) {
          socket.emit("chat:error", {
            message: "Missing required fields",
          });

          return;
        }

        await chatService.streamToSocket(
          socket,
          userId,
          conversationId,
          question,
        );
      } catch (error) {
        console.error(error);

        socket.emit("chat:error", {
          message:
            error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    });

    socket.on("chat:regenerate", async ({ userId, conversationId }) => {
      try {
        const answer = await chatService.regenerate(userId, conversationId);

        socket.emit("chat:regenerate:done", {
          answer,
        });
      } catch (error) {
        socket.emit("chat:error", {
          message:
            error instanceof Error ? error.message : "Internal Server Error",
        });
      }
    });

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(conversationId);

      console.log(` Joined room ${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(conversationId);

      console.log(` Left room ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(` Socket Disconnected: ${socket.id}`);
    });
  });
}
