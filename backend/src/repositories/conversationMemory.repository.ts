import { prisma } from "../config/prisma.js";

export class ConversationMemoryRepository {
  public async get(conversationId: string) {
    return prisma.conversationMemory.findUnique({
      where: {
        conversationId,
      },
    });
  }

  public async upsert(conversationId: string, summary: string) {
    return prisma.conversationMemory.upsert({
      where: {
        conversationId,
      },

      create: {
        conversationId,
        summary,
      },

      update: {
        summary,
      },
    });
  }
}
