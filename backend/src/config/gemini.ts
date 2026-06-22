import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Socket } from "socket.io";
import { env } from "./env.js";

export const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = gemini.getGenerativeModel({
    model: env.GEMINI_MODEL,
    
});

export async function streamAnswer(prompt: string, socket: Socket) {
  const result = await model.generateContentStream(prompt);

  let finalAnswer = "";

  for await (const chunk of result.stream) {
    const text = chunk.text();

    finalAnswer += text;

    socket.emit("chat:chunk", {
      content: text,
    });
  }

  socket.emit("chat:end");

  return finalAnswer;
}