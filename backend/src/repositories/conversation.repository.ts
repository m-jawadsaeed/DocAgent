import { prisma } from "../config/prisma.js";

export class ConversationRepository {
  async findByIdAndUser(conversationId: string, userId: string) {
    return prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  async create(userId: string, title: string) {
    return prisma.conversation.create({
      data: {
        userId,
        title,
      },
    });
  }
}
