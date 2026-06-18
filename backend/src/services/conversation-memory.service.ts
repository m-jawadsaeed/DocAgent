import { llm } from "./llm.service.js";

import type { Message } from "@prisma/client";
import { MessageRepository } from "../repositories/message.repository.js";

import { ConversationMemoryRepository } from "../repositories/conversationMemory.repository.js";

export class ConversationMemoryService {
  private readonly messages = new MessageRepository();

  private readonly memory = new ConversationMemoryRepository();

  public async updateMemory(conversationId: string) {
    const history = await this.messages.getRecentHistory(conversationId, 100);

    if (history.length < 30) {
      return;
    }

    const existing = await this.memory.get(conversationId);

    const transcript = history.map((m : Message) => `${m.role}: ${m.content}`).join("\n");

    const prompt = `

Existing Summary:

${existing?.summary ?? "None"}

Conversation:

${transcript}

Update summary.

Keep important facts,
preferences,
uploaded documents,
decisions
and goals.

`;

    const response = await llm.invoke(prompt);

    await this.memory.upsert(conversationId, response.content.toString());
  }

  public async getMemory(conversationId: string) {
    const memory = await this.memory.get(conversationId);

    return memory?.summary ?? "";
  }
}
