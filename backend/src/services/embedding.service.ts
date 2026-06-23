import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

let extractor: FeatureExtractionPipeline | null = null;

export class EmbeddingService {
  private async getExtractor(): Promise<FeatureExtractionPipeline> {
    if (!extractor) {
      extractor = (await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
      )) as FeatureExtractionPipeline;
    }

    return extractor;
  }

  public async createEmbedding(text: string): Promise<number[]> {
    const model = await this.getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    const embedding = output.tolist() as number[];

    if (embedding.length !== 384) {
      throw new Error(`Expected 384 dimensions, got ${embedding.length}`);
    }

    return embedding;
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
      embeddings.push(await this.createEmbedding(text));
    }

    return embeddings;
  }
}
