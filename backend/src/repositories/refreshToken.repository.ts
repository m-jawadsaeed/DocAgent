import { prisma } from "../config/prisma.js";

export class RefreshTokenRepository {
  async create(token: string, userId: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async find(token: string) {
    return prisma.refreshToken.findFirst({
      where: {
        token,
      },
    });
  }

  async delete(token: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  }
}
