import { pipeline } from "@xenova/transformers";

let extractor: Awaited<ReturnType<typeof pipeline>> | null = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  return extractor;
}

export class EmbeddingService {
  public async createEmbedding(text: string): Promise<number[]> {
    const model = await getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = Array.from(output.data as Float32Array);

    if (embedding.length !== 384) {
      throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
    }

    return embedding;
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    const model = await getExtractor();

    const embeddings: number[][] = [];

    for (const text of texts) {
      const output = await model(text, {
        pooling: "mean",
        normalize: true,
      });

      const embedding = Array.from(output.data as Float32Array);

      embeddings.push(embedding);
    }

    return embeddings;
  }
}
