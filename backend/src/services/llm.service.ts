import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../config/env.js";

import { documentSearchTool } from "../tools/document-search.tool.js";
import { summarizeDocumentTool } from "../tools/summarizeDocument.tool.js";
import { getConversationHistoryTool } from "../tools/getConversationHistory.tool.js";
import { getConversationMemoryTool } from "../tools/getConversationMemory.tool.js";
import { listUserDocumentsTool } from "../tools/listUserDocuments.tool.js";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: env.GEMINI_MODEL,

  temperature: 0,

  maxOutputTokens: 4096,

  streaming: true,
});

export const tools = [
  documentSearchTool,
  summarizeDocumentTool,
  getConversationHistoryTool,
  getConversationMemoryTool,
  listUserDocumentsTool,
];

export const llmWithTools = llm.bindTools(tools);

export const SYSTEM_PROMPT = `
You are an AI-powered Document Q&A assistant.

You have access to:

- document_search
- summarize_document
- list_user_documents
- get_conversation_history
- get_conversation_memory

RULES:

1. ALWAYS use document_search before answering document questions.
2. NEVER hallucinate.
3. ONLY answer from retrieved context.
4. Cite filenames whenever possible.
5. Use conversation memory when relevant.
6. If information is not found, clearly say so.
7. Be concise and accurate.

WORKFLOW:

- Search documents first.
- Analyze retrieved chunks.
- Generate answer using retrieved evidence.
- Mention source filenames.
`;
