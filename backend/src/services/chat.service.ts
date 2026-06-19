import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

import { Message, MessageRole } from "@prisma/client";

import { buildGraph } from "../agents/graph.js";

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
        return String((content as { content: string }).content);
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
      return cached;
    }

    setToolContext({
      userId,
      conversationId,
    });

    const history = await this.messages.getRecentHistory(conversationId, 20);

    const langchainHistory: BaseMessage[] = history.map(
      (message: Message): BaseMessage => {
        if (message.role === MessageRole.USER) {
          return new HumanMessage(message.content);
        }

        return new AIMessage(message.content);
      },
    );

    await this.messages.create(conversationId, MessageRole.USER, question);

    const result = await this.graph.invoke({
      messages: [...langchainHistory, new HumanMessage(question)],
    });

    const graphState = result as {
      messages?: BaseMessage[];
    };

    const lastMessage = graphState.messages?.[graphState.messages.length - 1];

    const answer = this.extractContent(lastMessage?.content);

    await this.messages.create(conversationId, MessageRole.ASSISTANT, answer);

    await this.memory.updateMemory(conversationId);

    await this.cache.set(cacheKey, answer);

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

    setToolContext({
      userId,
      conversationId,
    });

    const history = await this.messages.getRecentHistory(conversationId, 20);

    const messages: BaseMessage[] = history.map(
      (message: Message): BaseMessage => {
        if (message.role === MessageRole.USER) {
          return new HumanMessage(message.content);
        }

        return new AIMessage(message.content);
      },
    );

    messages.push(new HumanMessage(question));

    const stream = await this.graph.stream({
      messages,
    });

    let latestAnswer = "";

    for await (const chunk of stream) {
      if (!chunk || typeof chunk !== "object") {
        continue;
      }

      const firstValue = Object.values(chunk)[0];

      const state = firstValue as {
        messages?: BaseMessage[];
      };

      const lastMessage = state.messages?.[state.messages.length - 1];

      const content = this.extractContent(lastMessage?.content);

      if (!content) {
        continue;
      }

      latestAnswer = content;

      yield String(content);
    }

    await this.messages.create(conversationId, MessageRole.USER, question);

    await this.messages.create(
      conversationId,
      MessageRole.ASSISTANT,
      latestAnswer,
    );

    await this.memory.updateMemory(conversationId);
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

    const history = (
      await this.messages.getRecentHistory(conversationId, 20)
    ).reverse();

    const lastUserMessage = [...history]
      .reverse()
      .find((message) => message.role === MessageRole.USER);

    if (!lastUserMessage) {
      return "";
    }

    return this.ask(userId, conversationId, lastUserMessage.content);
  }
}
