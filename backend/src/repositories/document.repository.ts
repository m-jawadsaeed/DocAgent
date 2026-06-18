import { prisma } from "../config/prisma.js";

export class DocumentRepository {
  public async create(userId: string, filename: string) {
    return prisma.document.create({
      data: {
        userId,

        filename,

        status: "PROCESSING",
      },
    });
  }

  public async updateStatus(id: string, status: "READY" | "FAILED") {
    return prisma.document.update({
      where: {
        id,
      },

      data: {
        status,
      },
    });
  }

  public async findById(id: string) {
    return prisma.document.findUnique({
      where: {
        id,
      },
    });
  }

  public async findAllByUser(userId: string) {
    return prisma.document.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async delete(documentId: string, userId: string) {
    return prisma.document.deleteMany({
      where: {
        id: documentId,

        userId,
      },
    });
  }
}
