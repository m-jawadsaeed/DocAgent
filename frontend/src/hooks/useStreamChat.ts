import { useRef, useState } from "react";

import { api } from "../api/client";

import { useAuthStore } from "../store/auth.store";

interface StreamResponse {
  content?: string;

  done?: boolean;

  error?: string;
}

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

          if (typeof data === "object" && data !== null && "message" in data) {
            message = String(data.message);
          }
        } catch {
          //
        }

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

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const payload = line.replace("data:", "").trim();

          if (!payload) {
            continue;
          }

          try {
            const parsed: StreamResponse = JSON.parse(payload);

            if (parsed.done) {
              setStreaming(false);

              return;
            }

            if (parsed.error) {
              setAnswer(`Error: ${parsed.error}`);

              setStreaming(false);

              return;
            }

            const text = parsed.content ?? "";

            if (!text) {
              continue;
            }

            /*
              IMPORTANT FIX:
              LangGraph streams
              complete content each time.
            */

            accumulated = text;

            setAnswer(accumulated);
          } catch {
            //
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setAnswer(`Error: ${error.message}`);
      }
    } finally {
      controllerRef.current = null;

      setStreaming(false);
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
