import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export function useSocketChat() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("chat:token", (data) => {
      setAnswer((prev) => prev + data.token);
    });

    socket.on("chat:done", () => {
      setLoading(false);
    });

    return () => {
      socket.off("chat:token");
      socket.off("chat:done");
    };
  }, []);

  function send(userId: string, conversationId: string, question: string) {
    setAnswer("");
    setLoading(true);

    socket.emit("chat:send", {
      userId,
      conversationId,
      question,
    });
  }

  return {
    answer,
    loading,
    send,
  };
}
