import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
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
