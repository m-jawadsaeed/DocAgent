import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

import { Message, MessageRole } from "@prisma/client";

import { buildGraph } from "../agents/graph.js";
import { Socket } from "socket.io";
import { ConversationRepository } from "../repositories/conversation.repository.js";
import { MessageRepository } from "../repositories/message.repository.js";

import { SemanticCacheService } from "./semantic-cache.service.js";
import { ConversationMemoryService } from "./conversation-memory.service.js";

import { setToolContext } from "../tools/tool-context.js";
import { AppError } from "../utils/app-error.js";

export class ChatService {
  private readonly graph = buildGraph();

  private readonly conversations = new ConversationRepository();

  private readonly messages = new MessageRepository();

  private readonly cache = new SemanticCacheService();

  private readonly memory = new ConversationMemoryService();

  private extractContent(content: unknown): string {
    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((item: unknown) => {
          if (typeof item === "object" && item !== null && "text" in item) {
            return String((item as { text: string }).text);
          }

          if (typeof item === "string") {
            return item;
          }

          return "";
        })
        .join("");
    }

    if (typeof content === "object" && content !== null) {
      if ("text" in content) {
        return String((content as { text: string }).text);
      }

      if ("content" in content) {
        return String(
          (
            content as {
              content: string;
            }
          ).content,
        );
      }

      return JSON.stringify(content);
    }

    return "";
  }

  public async ask(
    userId: string,
    conversationId: string,
    question: string,
  ): Promise<string> {
    let answer = "";

    for await (const token of this.streamAnswer(
      userId,
      conversationId,
      question,
    )) {
      answer += token;
    }

    return answer;
  }

  public async *streamAnswer(
    userId: string,
    conversationId: string,
    question: string,
  ): AsyncGenerator<string> {
    const conversation = await this.conversations.findByIdAndUser(
      conversationId,
      userId,
    );

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const cacheKey = `${conversationId}:${question.trim().toLowerCase()}`;

    const cached = await this.cache.get(cacheKey);

    if (cached) {
      yield cached;
      return;
    }

    setToolContext({
      userId,
      conversationId,
    });

    const history = await this.messages.getRecentHistory(conversationId, 20);

    const messages: BaseMessage[] = history
      .reverse()
      .map((message: Message): BaseMessage => {
        if (message.role === MessageRole.USER) {
          return new HumanMessage(message.content);
        }

        return new AIMessage(message.content);
      });

    messages.push(new HumanMessage(question));

    await this.messages.create(conversationId, MessageRole.USER, question);

    let finalAnswer = "";
    let finalMessage = "";
    console.log("Starting graph stream");
    const stream = this.graph.streamEvents(
      {
        messages,
      },
      {
        version: "v2",
      },
    );

    for await (const event of stream) {
      console.log("EVENT:", event.event);
      if (event.event === "on_chat_model_stream") {
        const chunk = event.data?.chunk;

        const token = this.extractContent(chunk?.content);

        if (!token) {
          continue;
        }

        finalAnswer += token;

        yield token;
      }

      if (event.event === "on_chat_model_end") {
        const output = event.data?.output;

        if (output && typeof output === "object" && "content" in output) {
          finalMessage = this.extractContent(output.content);
        }
      }
    }

    if (!finalAnswer.trim()) {
      finalAnswer = finalMessage;
    }

    await this.messages.create(
      conversationId,
      MessageRole.ASSISTANT,
      finalAnswer,
    );

    await this.memory.updateMemory(conversationId);

    await this.cache.set(cacheKey, finalAnswer);
  }
  public async streamToSocket(
    socket: Socket,
    userId: string,
    conversationId: string,
    question: string,
  ): Promise<void> {
    console.log("streamToSocket started");

    let fullAnswer = "";

    for await (const token of this.streamAnswer(
      userId,
      conversationId,
      question,
    )) {
      console.log("TOKEN:", token);

      fullAnswer += token;

      socket.emit("chat:token", {
        token,
      });
    }

    console.log("DONE", fullAnswer);

    socket.emit("chat:done", {
      answer: fullAnswer,
    });
  }

  public async regenerate(
    userId: string,
    conversationId: string,
  ): Promise<string> {
    const conversation = await this.conversations.findByIdAndUser(
      conversationId,
      userId,
    );

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const history = await this.messages.getConversationMessages(conversationId);

    const lastUserMessage = [...history]
      .reverse()
      .find((message) => message.role === MessageRole.USER);

    if (!lastUserMessage) {
      return "";
    }

    return this.ask(userId, conversationId, lastUserMessage.content);
  }
}
