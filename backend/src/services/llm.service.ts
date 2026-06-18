import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../config/env.js";
import { documentSearchTool } from "../tools/document-search.tool.js";

import { summarizeDocumentTool } from "../tools/summarizeDocument.tool.js";

import { getConversationHistoryTool } from "../tools/getConversationHistory.tool.js";

import { getConversationMemoryTool } from "../tools/getConversationMemory.tool.js";

import { listUserDocumentsTool } from "../tools/listUserDocuments.tool.js";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",

  temperature: 0,
});

export const llmWithTools = llm.bindTools([
  documentSearchTool,
  summarizeDocumentTool,
  getConversationHistoryTool,
  getConversationMemoryTool,
  listUserDocumentsTool,
]);

export const SYSTEM_PROMPT = `You are an AI-powered Document Q&A assistant with access to the user's uploaded PDF documents.

Your capabilities:
- Search through uploaded documents using the document_search tool
- List available documents using list_user_documents
- Retrieve document summaries using summarize_document
- Access conversation history and memory for context

Guidelines:
1. ALWAYS use the document_search tool when the user asks questions about their documents
2. Provide accurate answers based ONLY on the retrieved document content
3. Cite the source documents in your responses (mention filenames)
4. If information is not found in the documents, clearly state that
5. Never make up or hallucinate information
6. Use conversation memory to maintain context across the discussion
7. Be concise and helpful

When answering:
- Start by searching relevant documents
- Extract the most relevant information
- Provide a clear, well-structured answer
- Include citations to source documents`;
