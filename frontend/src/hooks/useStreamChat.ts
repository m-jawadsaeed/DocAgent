import { useRef, useState } from "react";

import { api } from "../api/client";
import { useAuthStore } from "../store/auth.store";

export function useStreamChat() {
  const [answer, setAnswer] = useState("");

  const [streaming, setStreaming] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  async function stream(conversationId: string, question: string) {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const token = useAuthStore.getState().accessToken;

    if (!token) {
      throw new Error("Authentication required");
    }

    setAnswer("");
    setStreaming(true);

    const controller = new AbortController();

    controllerRef.current = controller;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/stream`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            conversationId,
            question,
          }),

          signal: controller.signal,
        },
      );

      if (!response.ok) {
        let message = "Failed to stream response";

        try {
          const data = await response.json();

          message = data.message ?? message;
        } catch {}

        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const token = line.replace("data:", "").trim();

          if (!token || token === "[DONE]") {
            continue;
          }

          accumulated += token;

          setAnswer(accumulated);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);

      if (error instanceof Error && error.name !== "AbortError") {
        setAnswer(`Error: ${error.message}`);
      }
    } finally {
      setStreaming(false);
    }
  }

  function stop() {
    controllerRef.current?.abort();

    setStreaming(false);
  }

  async function regenerate(conversationId: string) {
    if (!conversationId) {
      return;
    }

    setAnswer("");
    setStreaming(true);

    try {
      const response = await api.post("/chat/regenerate", {
        conversationId,
      });

      setAnswer(response.data.answer);
    } catch {
      setAnswer("Failed to regenerate response");
    } finally {
      setStreaming(false);
    }
  }

  return {
    answer,
    streaming,
    stream,
    stop,
    regenerate,
  };
}
