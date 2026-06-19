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
        const text = await response.text();

        console.error(text);

        throw new Error(`Streaming failed: ${response.status}`);
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

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const raw = line.replace("data:", "").trim();

          if (!raw || raw === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(raw);

            if (parsed.error) {
              throw new Error(parsed.error);
            }

            if (parsed.token) {
              accumulated = parsed.token;

              setAnswer(accumulated);
            }
          } catch (err) {
            console.error("SSE parse error:", err);
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);

      if (error instanceof Error) {
        setAnswer(`Error: ${error.message}`);
      } else {
        setAnswer("Failed to stream response");
      }
    } finally {
      setStreaming(false);

      controllerRef.current = null;
    }
  }

  function stop() {
    controllerRef.current?.abort();

    controllerRef.current = null;

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

      const answerText =
        typeof response.data.answer === "string"
          ? response.data.answer
          : JSON.stringify(response.data.answer, null, 2);

      setAnswer(answerText);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setAnswer(`Error: ${error.message}`);
      } else {
        setAnswer("Failed to regenerate response");
      }
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
