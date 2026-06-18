import { HybridRetrievalService } from "./hybrid-retrieval.service.js";

export interface Citation {
  filename: string;
  similarity: number;
  excerpt: string;
}

export interface RetrievalResult {
  context: string;
  citations: Citation[];
}

export class RetrievalService {
  private readonly hybrid = new HybridRetrievalService();

  public async retrieve(
    userId: string,
    question: string,
  ): Promise<RetrievalResult> {
    const result = await this.hybrid.retrieve(userId, question);

    return {
      context: result.context,

      citations: result.citations ?? [],
    };
  }
}
