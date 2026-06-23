import { pipeline } from "@xenova/transformers";

let extractor: Awaited<ReturnType<typeof pipeline>> | null = null;
export class EmbeddingService {
  private async getExtractor() {
    if (!extractor) {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      );
    }

    return extractor;
  }

  public async createEmbedding(text: string): Promise<number[]> {
    const model = await this.getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data) as number[];

    if (!embedding.length) {
      throw new Error("Failed to generate embedding");
    }

    if (embedding.length === 768) {
      return embedding;
    }

    if (embedding.length > 768) {
      return embedding.slice(0, 768);
    }

    return [...embedding, ...new Array(768 - embedding.length).fill(0)];
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.createEmbedding(text)));
  }
}
