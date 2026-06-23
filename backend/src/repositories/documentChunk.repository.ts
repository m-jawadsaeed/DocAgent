import { prisma } from "../config/prisma.js";

export interface CreateChunkInput {
  documentId: string;

  content: string;

  embedding: number[];

  metadata: Record<string, unknown>;
}

export interface SimilarChunk {
  id: string;

  content: string;

  similarity: number;

  filename: string;
}

export class DocumentChunkRepository {
  public async createChunk(data: CreateChunkInput): Promise<void> {
    const vectorLiteral = `[${data.embedding.join(",")}]`;

    await prisma.$executeRaw`

      INSERT INTO "DocumentChunk"
      (
        id,
        "documentId",
        content,
        metadata,
        embedding
      )
      VALUES
      (
        gen_random_uuid(),
        ${data.documentId},
        ${data.content},
        ${JSON.stringify(data.metadata)}::jsonb,
        ${vectorLiteral}::vector
      )

    `;
  }

  public async createMany(chunks: CreateChunkInput[]): Promise<void> {
    for (const chunk of chunks) {
      await this.createChunk(chunk);
    }
  }

  public async similaritySearch(
    userId: string,
    embedding: number[],
    limit = 8,
  ): Promise<SimilarChunk[]> {
    const vectorLiteral = `[${embedding.join(",")}]`;

    const results = await prisma.$queryRaw<SimilarChunk[]>`

      SELECT
        dc.id,
        dc.content,
        d.filename,

        1 -
        (
          dc.embedding <=>
          ${vectorLiteral}::vector
        ) AS similarity

      FROM "DocumentChunk" dc

      INNER JOIN "Document" d
      ON d.id = dc."documentId"

      WHERE
      d."userId" = ${userId}

      AND

      (
        1 -
        (
          dc.embedding <=>
          ${vectorLiteral}::vector
        )
      ) > 0.45

      ORDER BY
      dc.embedding <=>
      ${vectorLiteral}::vector

      LIMIT ${limit}

      `;

    return results;
  }
}
