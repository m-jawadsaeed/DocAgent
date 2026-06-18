import { prisma } from "../config/prisma.js";

export class AuditLogRepository {
  async create(
    userId: string,
    action: string,
    metadata: Record<string, string>,
  ) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    });
  }
}
