import { pipeline } from "@xenova/transformers";

type FeatureExtractor = Awaited<
  ReturnType<typeof pipeline<"feature-extraction">>
>;

let extractor: FeatureExtractor | null = null;

export class EmbeddingService {
  private async getExtractor(): Promise<FeatureExtractor> {
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

    const output = await model(text);

    const values = output.tolist();

    const embedding = values[0] as number[];

    return embedding.slice(0, 384);
  }

  public async createEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.createEmbedding(text)));
  }
}
