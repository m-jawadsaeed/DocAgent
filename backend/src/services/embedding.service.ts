import { gemini } from "../config/gemini.js";

export class EmbeddingService {
  public async createEmbedding(
    text: string,
  ): Promise<number[]> {
    const model =
      gemini.getGenerativeModel({
        model:
          "text-embedding-004",
      });

    const result =
      await model.embedContent(
        text,
      );

    return result.embedding.values;
  }

  public async createEmbeddings(
    texts: string[],
  ): Promise<number[][]> {
    return Promise.all(
      texts.map((text) =>
        this.createEmbedding(
          text,
        ),
      ),
    );
  }
}
