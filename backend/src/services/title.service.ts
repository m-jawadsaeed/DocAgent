import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../config/env.js";

const llm = new ChatGoogleGenerativeAI({
  model: env.GEMINI_MODEL,
  temperature: 0,
});

export class TitleService {
  async generateTitle(question: string): Promise<string> {
    const result = await llm.invoke(`
Generate a short conversation title
under 6 words.

Question:
${question}
`);

    return result.content.toString().trim();
  }
}
