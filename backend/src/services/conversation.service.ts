import { llm } from "./llm.service.js";

export async function generateConversationTitle(question: string) {
  const response = await llm.invoke(`
Generate a short title
(max 5 words)

Question:

${question}
`);

  return String(response.content).replace(/"/g, "").trim();
}
