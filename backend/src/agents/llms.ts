import {
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { env } from "../config/env.js";

import { documentSearchTool }
from "../tools/document-search.tool.js";

import { summarizeDocumentTool }
from "../tools/summarizeDocument.tool.js";

import { getConversationHistoryTool }
from "../tools/getConversationHistory.tool.js";

import { listUserDocumentsTool }
from "../tools/listUserDocuments.tool.js";

import { getConversationMemoryTool }
from "../tools/getConversationMemory.tool.js";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",

  temperature: 0,

  maxOutputTokens: 4096,
});

export const llmWithTools =
  llm.bindTools([
    documentSearchTool,
    summarizeDocumentTool,
    getConversationHistoryTool,
    getConversationMemoryTool,
    listUserDocumentsTool,
  ]);

export const SYSTEM_PROMPT = `
You are an AI Document Assistant.

Rules:

1. Always search documents before answering.
2. Use tools whenever relevant.
3. Never hallucinate.
4. Only answer from retrieved context.
5. Cite document sources.
6. Use conversation memory when available.
7. If information is unavailable,
   say you don't know.
`;
