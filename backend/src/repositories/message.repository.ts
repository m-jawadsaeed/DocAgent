import { Prisma, MessageRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export class MessageRepository {
  public async create(
    conversationId: string,
    role: MessageRole,
    content: string,
    citations?: Prisma.InputJsonValue,
  ) {
    return prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        citations,
      },
    });
  }

  public async getHistory(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });
  }

  public async getRecentHistory(conversationId: string, limit = 20) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  public async getConversationMessages(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }
}
