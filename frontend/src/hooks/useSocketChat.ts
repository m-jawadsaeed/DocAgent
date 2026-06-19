import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export function useSocketChat() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("chat:chunk", (data) => {
      setAnswer((prev) => prev + data.content);
    });

    socket.on("chat:end", () => {
      setLoading(false);
    });

    return () => {
      socket.off("chat:chunk");
      socket.off("chat:end");
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
