import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

export function useSocketChat() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn("Socket not initialized");
      return;
    }

    const handleToken = (data: { token: string }) => {
      setAnswer((prev) => prev + data.token);
    };

    const handleDone = () => {
      setLoading(false);
    };

    const handleError = (error: unknown) => {
      console.error("Chat Error:", error);
      setLoading(false);
    };

    socket.on("chat:token", handleToken);
    socket.on("chat:done", handleDone);
    socket.on("chat:error", handleError);

    return () => {
      socket.off("chat:token", handleToken);
      socket.off("chat:done", handleDone);
      socket.off("chat:error", handleError);
    };
  }, []);

  const send = (conversationId: string, question: string) => {
    const socket = getSocket();

    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    setAnswer("");
    setLoading(true);

    socket.emit("chat:send", {
      conversationId,
      question,
    });
  };

  return {
    answer,
    loading,
    send,
  };
}
